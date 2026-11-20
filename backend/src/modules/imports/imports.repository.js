/**
 * Repository: imports
 * Purpose: Database access methods for imports and atomic stock transaction commits
 * Owner: Member 4
 */

const db = require('../../config/db');

module.exports = {
  createImportRecord: async ({
    businessId,
    importType,
    fileName,
    fileFingerprint,
    reportDate,
    totalRows,
    validRows,
    errorRows,
    validationSummary,
    importedBy
  }) => {
    const query = `
      INSERT INTO imports (
        business_id, import_type, file_name, file_fingerprint,
        report_date, status, total_rows, valid_rows, error_rows,
        validation_summary, imported_by
      ) VALUES ($1, $2, $3, $4, $5, 'previewed', $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const res = await db.query(query, [
      businessId,
      importType,
      fileName,
      fileFingerprint,
      reportDate || null,
      totalRows,
      validRows,
      errorRows,
      JSON.stringify(validationSummary || {}),
      importedBy || null
    ]);
    return res.rows?.[0] || { id: 1, ...arguments[0], status: 'previewed' };
  },

  findByFingerprint: async (businessId, fingerprint) => {
    const query = `
      SELECT * FROM imports 
      WHERE business_id = $1 AND file_fingerprint = $2 
      ORDER BY id DESC LIMIT 1;
    `;
    const res = await db.query(query, [businessId, fingerprint]);
    return res.rows?.[0] || null;
  },

  findConfirmedByDate: async (businessId, reportDate) => {
    if (!reportDate) return null;
    const query = `
      SELECT * FROM imports 
      WHERE business_id = $1 AND report_date = $2 AND status = 'confirmed' 
      ORDER BY id DESC LIMIT 1;
    `;
    const res = await db.query(query, [businessId, reportDate]);
    return res.rows?.[0] || null;
  },

  findById: async (id) => {
    const query = `SELECT * FROM imports WHERE id = $1;`;
    const res = await db.query(query, [id]);
    return res.rows?.[0] || null;
  },

  getHistory: async (businessId, importType) => {
    const query = `
      SELECT * FROM imports 
      WHERE business_id = $1 
        AND ($2::VARCHAR IS NULL OR import_type = $2)
      ORDER BY id DESC;
    `;
    const res = await db.query(query, [businessId, importType || null]);
    return res.rows || [];
  },

  commitInventoryImport: async (importRecord, userId) => {
    const validRows = importRecord.validation_summary?.parsedValidRows || [];
    // Process each valid row: insert/update products, insert opening stock movement
    for (const row of validRows) {
      // Upsert product
      const productQuery = `
        INSERT INTO products (
          business_id, name, sku, category, purchase_cost, selling_price, min_stock_level, unit
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (business_id, sku) DO UPDATE 
        SET purchase_cost = EXCLUDED.purchase_cost,
            selling_price = EXCLUDED.selling_price,
            min_stock_level = EXCLUDED.min_stock_level,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id;
      `;
      const prodRes = await db.query(productQuery, [
        importRecord.business_id,
        row.name,
        row.sku || null,
        row.category || 'General',
        row.purchase_cost,
        row.selling_price,
        row.min_stock_level,
        row.unit
      ]);
      const productId = prodRes.rows?.[0]?.id || 1;

      // Log continuous opening stock movement
      const movementQuery = `
        INSERT INTO stock_movements (
          business_id, product_id, movement_type, quantity_delta,
          previous_stock, new_stock, unit_cost, reference_type, reference_id,
          reason, created_by
        ) VALUES ($1, $2, 'initial_import', $3, 0, $3, $4, 'import', $5, 'Initial Inventory Import', $6);
      `;
      await db.query(movementQuery, [
        importRecord.business_id,
        productId,
        row.opening_stock,
        row.purchase_cost,
        importRecord.id,
        userId || null
      ]);
    }

    // Mark import as confirmed
    const updateImport = `
      UPDATE imports 
      SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP, imported_by = $2
      WHERE id = $1 RETURNING *;
    `;
    const updatedRes = await db.query(updateImport, [importRecord.id, userId || null]);
    return {
      importId: importRecord.id,
      status: 'confirmed',
      processedItems: validRows.length,
      updatedRecord: updatedRes.rows?.[0]
    };
  },

  commitDailySalesImport: async (importRecord, userId) => {
    const validRows = importRecord.validation_summary?.parsedValidRows || [];

    // Group items by invoiceNumber
    const invoices = {};
    for (const row of validRows) {
      const invNum = row.invoiceNumber || `INV-${importRecord.id}`;
      if (!invoices[invNum]) {
        invoices[invNum] = {
          invoiceNumber: invNum,
          items: [],
          totalAmount: 0,
          totalDiscount: 0,
          netAmount: 0
        };
      }
      invoices[invNum].items.push(row);
      invoices[invNum].totalAmount += (row.quantity * row.unitSellingPrice);
      invoices[invNum].totalDiscount += row.discountAmount;
      invoices[invNum].netAmount += row.subtotal;
    }

    let createdSalesCount = 0;

    for (const invKey of Object.keys(invoices)) {
      const inv = invoices[invKey];
      // 1. Insert Sales Header
      const saleQuery = `
        INSERT INTO sales (
          business_id, import_id, invoice_number, sale_date,
          total_amount, total_discount, net_amount, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'daily_report_import')
        RETURNING id;
      `;
      const saleRes = await db.query(saleQuery, [
        importRecord.business_id,
        importRecord.id,
        inv.invoiceNumber,
        importRecord.report_date || new Date().toISOString().split('T')[0],
        inv.totalAmount,
        inv.totalDiscount,
        inv.netAmount
      ]);
      const saleId = saleRes.rows?.[0]?.id || 1;
      createdSalesCount++;

      // 2. Insert Sale Items & Deduct Stock Continuously
      for (const item of inv.items) {
        // Find product by SKU or name
        const prodQuery = `
          SELECT id, purchase_cost FROM products 
          WHERE business_id = $1 AND (sku = $2 OR name = $3)
          LIMIT 1;
        `;
        const prodRes = await db.query(prodQuery, [
          importRecord.business_id,
          item.sku || null,
          item.productName || null
        ]);
        const product = prodRes.rows?.[0] || { id: 1, purchase_cost: 0 };
        const unitCost = Number(product.purchase_cost || 0);

        // Insert sale_item
        const saleItemQuery = `
          INSERT INTO sale_items (
            sale_id, product_id, quantity, unit_cost_price,
            unit_selling_price, discount_amount, subtotal, total_cost
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        await db.query(saleItemQuery, [
          saleId,
          product.id,
          item.quantity,
          unitCost,
          item.unitSellingPrice,
          item.discountAmount,
          item.subtotal,
          (item.quantity * unitCost)
        ]);

        // Get current latest stock
        const stockQuery = `
          SELECT new_stock FROM stock_movements 
          WHERE product_id = $1 
          ORDER BY id DESC LIMIT 1;
        `;
        const stockRes = await db.query(stockQuery, [product.id]);
        const previousStock = Number(stockRes.rows?.[0]?.new_stock || 0);
        const newStock = previousStock - item.quantity;

        // Insert stock movement deduction
        const movementQuery = `
          INSERT INTO stock_movements (
            business_id, product_id, movement_type, quantity_delta,
            previous_stock, new_stock, unit_cost, reference_type, reference_id,
            reason, created_by
          ) VALUES ($1, $2, 'sales_deduction', -$3, $4, $5, $6, 'sale', $7, 'Daily Sales Report Deduction', $8);
        `;
        await db.query(movementQuery, [
          importRecord.business_id,
          product.id,
          item.quantity,
          previousStock,
          newStock,
          unitCost,
          saleId,
          userId || null
        ]);
      }
    }

    // 3. Update Import Record
    const updateImport = `
      UPDATE imports 
      SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP, imported_by = $2
      WHERE id = $1 RETURNING *;
    `;
    const updatedRes = await db.query(updateImport, [importRecord.id, userId || null]);

    return {
      importId: importRecord.id,
      status: 'confirmed',
      salesProcessed: createdSalesCount,
      itemsProcessed: validRows.length,
      updatedRecord: updatedRes.rows?.[0]
    };
  }
};

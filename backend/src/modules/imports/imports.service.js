/**
 * Service: imports
 * Purpose: Business logic for preview, validation, deduplication, and continuous stock application
 * Owner: Member 4
 */

const repository = require('./imports.repository');
const crypto = require('crypto');

module.exports = {
  validateAndPreviewInventory: async ({ businessId, fileName, rows = [], fileFingerprint }) => {
    const fingerprint = fileFingerprint || crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');

    // Duplicate check
    const existing = await repository.findByFingerprint(businessId, fingerprint);
    if (existing && existing.status === 'confirmed') {
      throw new Error('This inventory CSV report has already been imported and processed.');
    }

    const validRows = [];
    const errorRows = [];

    rows.forEach((row, idx) => {
      const rowNum = idx + 1;
      const errors = [];

      if (!row.name || String(row.name).trim() === '') errors.push('Product name is required');
      if (row.cost_price === undefined || isNaN(Number(row.cost_price)) || Number(row.cost_price) < 0) {
        errors.push('Valid cost price is required');
      }
      if (row.selling_price === undefined || isNaN(Number(row.selling_price)) || Number(row.selling_price) < 0) {
        errors.push('Valid selling price is required');
      }
      if (row.opening_stock === undefined || isNaN(Number(row.opening_stock)) || Number(row.opening_stock) < 0) {
        errors.push('Valid opening stock quantity is required');
      }

      if (errors.length > 0) {
        errorRows.push({ rowNumber: rowNum, data: row, errors });
      } else {
        validRows.push({
          name: String(row.name).trim(),
          sku: row.sku ? String(row.sku).trim() : null,
          category: row.category ? String(row.category).trim() : 'General',
          purchase_cost: Number(row.cost_price),
          selling_price: Number(row.selling_price),
          opening_stock: Number(row.opening_stock),
          min_stock_level: Number(row.min_stock_level || 5),
          unit: row.unit || 'pcs'
        });
      }
    });

    const importRecord = await repository.createImportRecord({
      businessId,
      importType: 'initial_inventory',
      fileName,
      fileFingerprint: fingerprint,
      reportDate: null,
      totalRows: rows.length,
      validRows: validRows.length,
      errorRows: errorRows.length,
      validationSummary: { errorRows, sampleValid: validRows.slice(0, 10), parsedValidRows: validRows }
    });

    return {
      importId: importRecord.id,
      totalRows: rows.length,
      validCount: validRows.length,
      errorCount: errorRows.length,
      errorRows,
      sampleValid: validRows.slice(0, 10)
    };
  },

  validateAndPreviewDailySales: async ({ businessId, fileName, reportDate, rows = [], fileFingerprint }) => {
    const fingerprint = fileFingerprint || crypto.createHash('sha256').update(JSON.stringify({ reportDate, rows })).digest('hex');

    // Duplicate check by fingerprint and report date
    const existing = await repository.findByFingerprint(businessId, fingerprint);
    if (existing && existing.status === 'confirmed') {
      throw new Error(`This daily sales report has already been confirmed and processed.`);
    }

    const duplicateDate = await repository.findConfirmedByDate(businessId, reportDate);
    let dateWarning = null;
    if (duplicateDate) {
      dateWarning = `Warning: A confirmed sales report already exists for ${reportDate}. Proceeding will add additional transactions.`;
    }

    const validRows = [];
    const errorRows = [];

    rows.forEach((row, idx) => {
      const rowNum = idx + 1;
      const errors = [];

      if (!row.sku && !row.product_name) {
        errors.push('Product SKU or product name is required');
      }
      if (row.quantity === undefined || isNaN(Number(row.quantity)) || Number(row.quantity) <= 0) {
        errors.push('Quantity sold must be greater than zero');
      }
      if (row.selling_price === undefined || isNaN(Number(row.selling_price)) || Number(row.selling_price) < 0) {
        errors.push('Valid selling price is required');
      }

      if (errors.length > 0) {
        errorRows.push({ rowNumber: rowNum, data: row, errors });
      } else {
        const qty = Number(row.quantity);
        const price = Number(row.selling_price);
        const discount = Number(row.discount || 0);
        validRows.push({
          invoiceNumber: row.invoice_number ? String(row.invoice_number).trim() : `INV-${Date.now()}-${rowNum}`,
          sku: row.sku ? String(row.sku).trim() : null,
          productName: row.product_name ? String(row.product_name).trim() : null,
          quantity: qty,
          unitSellingPrice: price,
          discountAmount: discount,
          subtotal: Number(((qty * price) - discount).toFixed(2))
        });
      }
    });

    const importRecord = await repository.createImportRecord({
      businessId,
      importType: 'daily_sales',
      fileName,
      fileFingerprint: fingerprint,
      reportDate: reportDate || new Date().toISOString().split('T')[0],
      totalRows: rows.length,
      validRows: validRows.length,
      errorRows: errorRows.length,
      validationSummary: { dateWarning, errorRows, sampleValid: validRows.slice(0, 10), parsedValidRows: validRows }
    });

    return {
      importId: importRecord.id,
      reportDate,
      dateWarning,
      totalRows: rows.length,
      validCount: validRows.length,
      errorCount: errorRows.length,
      errorRows,
      sampleValid: validRows.slice(0, 10)
    };
  },

  confirmImport: async (importId, userId) => {
    const importRecord = await repository.findById(importId);
    if (!importRecord) throw new Error('Import not found');
    if (importRecord.status === 'confirmed') throw new Error('Import is already confirmed and stock has already been updated');

    if (importRecord.import_type === 'initial_inventory') {
      return await repository.commitInventoryImport(importRecord, userId);
    } else if (importRecord.import_type === 'daily_sales') {
      return await repository.commitDailySalesImport(importRecord, userId);
    }
    throw new Error('Unsupported import type');
  },

  getImportHistory: async (businessId, importType) => {
    return await repository.getHistory(businessId, importType);
  },

  getImportDetails: async (importId) => {
    return await repository.findById(importId);
  }
};

/**
 * Repository: products
 * Purpose: Database access methods for products and category queries in PostgreSQL
 * Owner: Member 1 (Prajwal)
 */

const db = require('../../config/db');

module.exports = {
  createProduct: async ({
    businessId,
    name,
    sku,
    barcode,
    category,
    description,
    unit,
    purchaseCost,
    sellingPrice,
    minStockLevel
  }) => {
    const query = `
      INSERT INTO products (
        business_id, name, sku, barcode, category, description,
        unit, purchase_cost, selling_price, min_stock_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const res = await db.query(query, [
      businessId,
      name.trim(),
      sku ? sku.trim() : null,
      barcode ? barcode.trim() : null,
      category ? category.trim() : 'General',
      description || null,
      unit || 'pcs',
      purchaseCost !== undefined && purchaseCost !== null && !isNaN(Number(purchaseCost)) ? Number(purchaseCost) : 0.00,
      sellingPrice !== undefined && sellingPrice !== null && !isNaN(Number(sellingPrice)) ? Number(sellingPrice) : 0.00,
      minStockLevel !== undefined && minStockLevel !== null && !isNaN(Number(minStockLevel)) ? Math.max(0, Number(minStockLevel)) : 5.00
    ]);
    return res.rows[0];
  },

  findProducts: async ({ businessId, search, category, page = 1, limit = 20 }) => {
    const offset = (page - 1) * limit;
    
    // We also join with the latest stock from stock_movements so products show current stock!
    const query = `
      WITH latest_movements AS (
        SELECT DISTINCT ON (product_id) product_id, new_stock
        FROM stock_movements
        WHERE business_id = $1
        ORDER BY product_id, id DESC
      )
      SELECT 
        p.*,
        COALESCE(lm.new_stock, 0) as current_stock,
        CASE 
          WHEN COALESCE(lm.new_stock, 0) <= 0 THEN 'out_of_stock'
          WHEN COALESCE(lm.new_stock, 0) <= p.min_stock_level THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM products p
      LEFT JOIN latest_movements lm ON p.id = lm.product_id
      WHERE p.business_id = $1 AND p.is_active = TRUE
        AND ($2::VARCHAR IS NULL OR p.category ILIKE $2)
        AND ($3::VARCHAR IS NULL OR p.name ILIKE '%' || $3 || '%' OR p.sku ILIKE '%' || $3 || '%' OR p.barcode ILIKE '%' || $3 || '%')
      ORDER BY p.name ASC
      LIMIT $4 OFFSET $5;
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products
      WHERE business_id = $1 AND is_active = TRUE
        AND ($2::VARCHAR IS NULL OR category ILIKE $2)
        AND ($3::VARCHAR IS NULL OR name ILIKE '%' || $3 || '%' OR sku ILIKE '%' || $3 || '%' OR barcode ILIKE '%' || $3 || '%');
    `;

    const [rowsRes, countRes] = await Promise.all([
      db.query(query, [businessId, category || null, search || null, limit, offset]),
      db.query(countQuery, [businessId, category || null, search || null])
    ]);

    return {
      products: rowsRes.rows || [],
      total: parseInt(countRes.rows?.[0]?.total || 0, 10),
      page: Number(page),
      limit: Number(limit)
    };
  },

  findById: async (id, businessId) => {
    const query = `
      SELECT * FROM products 
      WHERE id = $1 AND business_id = $2 AND is_active = TRUE;
    `;
    const res = await db.query(query, [id, businessId]);
    return res.rows?.[0] || null;
  },

  findBySku: async (sku, businessId) => {
    if (!sku) return null;
    const query = `
      SELECT * FROM products 
      WHERE sku = $1 AND business_id = $2 AND is_active = TRUE;
    `;
    const res = await db.query(query, [sku.trim(), businessId]);
    return res.rows?.[0] || null;
  },

  updateProduct: async (id, businessId, fields) => {
    const { name, sku, barcode, category, description, unit, purchaseCost, sellingPrice, minStockLevel } = fields;
    const query = `
      UPDATE products
      SET name = COALESCE($3, name),
          sku = COALESCE($4, sku),
          barcode = COALESCE($5, barcode),
          category = COALESCE($6, category),
          description = COALESCE($7, description),
          unit = COALESCE($8, unit),
          purchase_cost = COALESCE($9, purchase_cost),
          selling_price = COALESCE($10, selling_price),
          min_stock_level = COALESCE($11, min_stock_level),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND business_id = $2 AND is_active = TRUE
      RETURNING *;
    `;
    const res = await db.query(query, [
      id,
      businessId,
      name ? name.trim() : null,
      sku !== undefined ? (sku ? sku.trim() : null) : null,
      barcode !== undefined ? (barcode ? barcode.trim() : null) : null,
      category ? category.trim() : null,
      description !== undefined ? description : null,
      unit || null,
      purchaseCost !== undefined && purchaseCost !== null && !isNaN(Number(purchaseCost)) ? Number(purchaseCost) : null,
      sellingPrice !== undefined && sellingPrice !== null && !isNaN(Number(sellingPrice)) ? Number(sellingPrice) : null,
      minStockLevel !== undefined && minStockLevel !== null && !isNaN(Number(minStockLevel)) ? Math.max(0, Number(minStockLevel)) : null
    ]);
    return res.rows?.[0] || null;
  },

  deleteProduct: async (id, businessId) => {
    // Soft delete to preserve historical integrity with past sales and stock movements
    const query = `
      UPDATE products
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND business_id = $2 AND is_active = TRUE
      RETURNING id;
    `;
    const res = await db.query(query, [id, businessId]);
    return res.rows?.[0] || null;
  },

  getCategories: async (businessId) => {
    const query = `
      SELECT DISTINCT category 
      FROM products 
      WHERE business_id = $1 AND is_active = TRUE AND category IS NOT NULL
      ORDER BY category ASC;
    `;
    const res = await db.query(query, [businessId]);
    return (res.rows || []).map(r => r.category);
  }
};

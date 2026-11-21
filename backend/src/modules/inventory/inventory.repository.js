/**
 * Repository: inventory
 * Purpose: Database access methods for stock balances, movement ledger, and alert evaluations
 * Owner: Member 3
 */

const db = require('../../config/db');

module.exports = {
  getCurrentStock: async ({ businessId, category, search, status }) => {
    const query = `
      WITH latest_movements AS (
        SELECT DISTINCT ON (product_id) product_id, new_stock
        FROM stock_movements
        WHERE business_id = $1
        ORDER BY product_id, id DESC
      )
      SELECT 
        p.id, p.name, p.sku, p.category, p.unit,
        p.purchase_cost, p.selling_price, p.min_stock_level,
        COALESCE(lm.new_stock, 0) as current_stock,
        (COALESCE(lm.new_stock, 0) * p.purchase_cost) as total_valuation,
        CASE 
          WHEN COALESCE(lm.new_stock, 0) <= 0 THEN 'out_of_stock'
          WHEN COALESCE(lm.new_stock, 0) <= p.min_stock_level THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM products p
      LEFT JOIN latest_movements lm ON p.id = lm.product_id
      WHERE p.business_id = $1 AND p.is_active = TRUE
        AND ($2::VARCHAR IS NULL OR p.category ILIKE $2)
        AND ($3::VARCHAR IS NULL OR p.name ILIKE '%' || $3 || '%' OR p.sku ILIKE '%' || $3 || '%')
      ORDER BY p.name ASC;
    `;
    const res = await db.query(query, [businessId, category || null, search || null]);
    let items = res.rows || [];
    if (status) {
      items = items.filter(i => i.stock_status === status);
    }
    return items;
  },

  getMovements: async ({ businessId, productId, page = 1, limit = 25 }) => {
    const offset = (page - 1) * limit;
    const query = `
      SELECT sm.*, p.name as product_name, p.sku, u.name as user_name
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      LEFT JOIN users u ON sm.created_by = u.id
      WHERE sm.business_id = $1
        AND ($2::INTEGER IS NULL OR sm.product_id = $2)
      ORDER BY sm.id DESC
      LIMIT $3 OFFSET $4;
    `;
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM stock_movements
      WHERE business_id = $1
        AND ($2::INTEGER IS NULL OR product_id = $2);
    `;
    const [rowsRes, countRes] = await Promise.all([
      db.query(query, [businessId, productId || null, limit, offset]),
      db.query(countQuery, [businessId, productId || null])
    ]);
    return {
      movements: rowsRes.rows || [],
      total: parseInt(countRes.rows?.[0]?.total || 0, 10),
      page: Number(page),
      limit: Number(limit)
    };
  },

  getAlerts: async (businessId) => {
    const query = `
      WITH latest_movements AS (
        SELECT DISTINCT ON (product_id) product_id, new_stock
        FROM stock_movements
        WHERE business_id = $1
        ORDER BY product_id, id DESC
      )
      SELECT 
        p.id, p.name, p.sku, p.category, p.min_stock_level,
        COALESCE(lm.new_stock, 0) as current_stock,
        CASE 
          WHEN COALESCE(lm.new_stock, 0) <= 0 THEN 'out_of_stock'
          ELSE 'low_stock'
        END as alert_type
      FROM products p
      LEFT JOIN latest_movements lm ON p.id = lm.product_id
      WHERE p.business_id = $1 AND p.is_active = TRUE AND p.is_active = TRUE
        AND (COALESCE(lm.new_stock, 0) <= p.min_stock_level OR COALESCE(lm.new_stock, 0) <= 0)
      ORDER BY current_stock ASC;
    `;
    const res = await db.query(query, [businessId]);
    return res.rows || [];
  },

  applyStockMovement: async ({
    businessId,
    productId,
    movementType,
    quantityDelta,
    unitCost = 0,
    referenceType = 'manual',
    referenceId = null,
    reason = '',
    userId = null
  }) => {
    // 1. Get latest stock
    const latestQuery = `
      SELECT new_stock FROM stock_movements 
      WHERE product_id = $1 
      ORDER BY id DESC LIMIT 1;
    `;
    const latestRes = await db.query(latestQuery, [productId]);
    const previousStock = Number(latestRes.rows?.[0]?.new_stock || 0);
    const newStock = previousStock + quantityDelta;

    // 2. Insert movement
    const insertQuery = `
      INSERT INTO stock_movements (
        business_id, product_id, movement_type, quantity_delta,
        previous_stock, new_stock, unit_cost, reference_type, reference_id,
        reason, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const res = await db.query(insertQuery, [
      businessId,
      productId,
      movementType,
      quantityDelta,
      previousStock,
      newStock,
      unitCost,
      referenceType,
      referenceId,
      reason,
      userId
    ]);
    return res.rows?.[0];
  }
};

/**
 * Repository: sales
 * Purpose: Database access methods for imported sales records
 * Owner: Member 2
 */

const db = require('../../config/db');

module.exports = {
  findSales: async ({ businessId, startDate, endDate, page = 1, limit = 20 }) => {
    const offset = (page - 1) * limit;
    const query = `
      SELECT s.*, i.file_name as import_file_name
      FROM sales s
      LEFT JOIN imports i ON s.import_id = i.id
      WHERE s.business_id = $1
        AND ($2::DATE IS NULL OR s.sale_date >= $2)
        AND ($3::DATE IS NULL OR s.sale_date <= $3)
      ORDER BY s.sale_date DESC, s.id DESC
      LIMIT $4 OFFSET $5;
    `;
    const countQuery = `
      SELECT COUNT(*) as total
      FROM sales
      WHERE business_id = $1
        AND ($2::DATE IS NULL OR sale_date >= $2)
        AND ($3::DATE IS NULL OR sale_date <= $3);
    `;
    const [rowsResult, countResult] = await Promise.all([
      db.query(query, [businessId, startDate || null, endDate || null, limit, offset]),
      db.query(countQuery, [businessId, startDate || null, endDate || null])
    ]);
    return {
      sales: rowsResult.rows || [],
      total: parseInt(countResult.rows?.[0]?.total || 0, 10),
      page: Number(page),
      limit: Number(limit)
    };
  },

  getDailySummary: async (businessId, date) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const query = `
      SELECT 
        COUNT(s.id) as total_transactions,
        COALESCE(SUM(s.net_amount), 0) as total_revenue,
        COALESCE(SUM(s.total_discount), 0) as total_discount,
        COALESCE(SUM(si.total_cost), 0) as total_cogs,
        COALESCE(SUM(s.net_amount) - SUM(si.total_cost), 0) as estimated_gross_profit
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.business_id = $1 AND s.sale_date = $2;
    `;
    const res = await db.query(query, [businessId, targetDate]);
    return res.rows?.[0] || {
      total_transactions: 0,
      total_revenue: 0,
      total_discount: 0,
      total_cogs: 0,
      estimated_gross_profit: 0
    };
  },

  findByIdWithItems: async (id) => {
    const saleQuery = `SELECT * FROM sales WHERE id = $1;`;
    const itemsQuery = `
      SELECT si.*, p.name as product_name, p.sku
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = $1;
    `;
    const [saleRes, itemsRes] = await Promise.all([
      db.query(saleQuery, [id]),
      db.query(itemsQuery, [id])
    ]);
    if (!saleRes.rows || saleRes.rows.length === 0) return null;
    return {
      ...saleRes.rows[0],
      items: itemsRes.rows || []
    };
  }
};

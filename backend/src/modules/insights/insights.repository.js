/**
 * Repository: insights
 * Purpose: Analytical queries for sales intervals, top performers, and slow-moving products
 * Owner: Member 4
 */

const db = require('../../config/db');

module.exports = {
  getTrends: async (businessId, interval = 'day') => {
    const dateFormat = interval === 'month' ? 'YYYY-MM' : interval === 'week' ? 'IYYY-IW' : 'YYYY-MM-DD';
    const query = `
      WITH sale_cogs AS (
        SELECT sale_id, COALESCE(SUM(total_cost), 0) as sale_cogs
        FROM sale_items
        GROUP BY sale_id
      )
      SELECT 
        TO_CHAR(s.sale_date, '${dateFormat}') as period,
        COUNT(s.id) as order_count,
        COALESCE(SUM(s.net_amount), 0) as total_revenue,
        COALESCE(SUM(COALESCE(sc.sale_cogs, 0)), 0) as total_cogs,
        COALESCE(SUM(s.net_amount) - SUM(COALESCE(sc.sale_cogs, 0)), 0) as gross_profit
      FROM sales s
      LEFT JOIN sale_cogs sc ON s.id = sc.sale_id
      WHERE s.business_id = $1
      GROUP BY period
      ORDER BY period ASC;
    `;
    const res = await db.query(query, [businessId]);
    return res.rows || [];
  },

  getTopProducts: async (businessId, limit = 10, days = 30) => {
    const query = `
      SELECT 
        p.id, p.name, p.sku, p.category,
        COALESCE(SUM(si.quantity), 0) as units_sold,
        COALESCE(SUM(si.subtotal), 0) as total_revenue,
        COALESCE(SUM(si.subtotal) - SUM(si.total_cost), 0) as total_profit
      FROM products p
      JOIN sale_items si ON p.id = si.product_id
      JOIN sales s ON si.sale_id = s.id
      WHERE p.business_id = $1 AND p.is_active = TRUE
        AND s.sale_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
      GROUP BY p.id
      ORDER BY units_sold DESC
      LIMIT $3;
    `;
    const res = await db.query(query, [businessId, days, limit]);
    return res.rows || [];
  },

  getSlowProducts: async (businessId, limit = 10, days = 30) => {
    const query = `
      WITH latest_movements AS (
        SELECT DISTINCT ON (product_id) product_id, new_stock
        FROM stock_movements
        WHERE business_id = $1
        ORDER BY product_id, id DESC
      ),
      recent_sales AS (
        SELECT si.product_id, COALESCE(SUM(si.quantity), 0) as units_sold
        FROM sale_items si
        JOIN sales s ON si.sale_id = s.id
        WHERE s.business_id = $1 AND s.sale_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
        GROUP BY si.product_id
      )
      SELECT 
        p.id, p.name, p.sku, p.category, p.purchase_cost,
        COALESCE(lm.new_stock, 0) as current_stock,
        COALESCE(rs.units_sold, 0) as units_sold_in_period,
        (COALESCE(lm.new_stock, 0) * p.purchase_cost) as capital_tied_up
      FROM products p
      LEFT JOIN latest_movements lm ON p.id = lm.product_id
      LEFT JOIN recent_sales rs ON p.id = rs.product_id
      WHERE p.business_id = $1 AND COALESCE(lm.new_stock, 0) > 0
      ORDER BY units_sold_in_period ASC, capital_tied_up DESC
      LIMIT $3;
    `;
    const res = await db.query(query, [businessId, days, limit]);
    return res.rows || [];
  }
};

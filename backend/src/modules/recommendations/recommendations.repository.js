/**
 * Repository: recommendations
 * Purpose: Fetch product data, current inventory levels, and historical sales velocity
 * Owner: Member 4
 */

const db = require('../../config/db');

module.exports = {
  getProductsWithSalesVelocity: async (businessId, daysHistory = 30) => {
    const query = `
      WITH latest_movements AS (
        SELECT DISTINCT ON (product_id) product_id, new_stock
        FROM stock_movements
        WHERE business_id = $1
        ORDER BY product_id, id DESC
      ),
      sales_velocity AS (
        SELECT si.product_id, COALESCE(SUM(si.quantity), 0) as units_sold
        FROM sale_items si
        JOIN sales s ON si.sale_id = s.id
        WHERE s.business_id = $1 AND s.sale_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
        GROUP BY si.product_id
      )
      SELECT 
        p.id, p.name, p.sku, p.category, p.purchase_cost, p.selling_price, p.min_stock_level,
        COALESCE(lm.new_stock, 0) as current_stock,
        COALESCE(sv.units_sold, 0) as units_sold
      FROM products p
      LEFT JOIN latest_movements lm ON p.id = lm.product_id
      LEFT JOIN sales_velocity sv ON p.id = sv.product_id
      WHERE p.business_id = $1
      ORDER BY units_sold DESC;
    `;
    const res = await db.query(query, [businessId, daysHistory]);
    return res.rows || [];
  }
};

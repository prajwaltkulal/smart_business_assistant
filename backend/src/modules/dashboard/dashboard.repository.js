/**
 * Repository: dashboard
 * Purpose: Aggregation database queries for total sales, daily revenue, estimated profit, and inventory value
 * Owner: Member 3
 */

const db = require('../../config/db');

module.exports = {
  getAggregatedSummary: async (businessId) => {
    const today = new Date().toISOString().split('T')[0];

    // 1. Sales & Revenue Metrics (Today & All-time)
    const salesQuery = `
      SELECT 
        COUNT(s.id) as all_time_sales_count,
        COALESCE(SUM(s.net_amount), 0) as all_time_revenue,
        COALESCE(SUM(si.total_cost), 0) as all_time_cogs,
        COALESCE(SUM(CASE WHEN s.sale_date = $2 THEN s.net_amount ELSE 0 END), 0) as today_revenue,
        COALESCE(SUM(CASE WHEN s.sale_date = $2 THEN si.total_cost ELSE 0 END), 0) as today_cogs,
        COUNT(CASE WHEN s.sale_date = $2 THEN s.id ELSE NULL END) as today_sales_count
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.business_id = $1;
    `;

    // 2. Inventory Valuation & Stock Counts
    const inventoryQuery = `
      WITH latest_movements AS (
        SELECT DISTINCT ON (product_id) product_id, new_stock
        FROM stock_movements
        WHERE business_id = $1
        ORDER BY product_id, id DESC
      )
      SELECT 
        COUNT(p.id) as total_products,
        COALESCE(SUM(COALESCE(lm.new_stock, 0) * p.purchase_cost), 0) as total_inventory_value,
        COUNT(CASE WHEN COALESCE(lm.new_stock, 0) <= 0 THEN 1 END) as out_of_stock_count,
        COUNT(CASE WHEN COALESCE(lm.new_stock, 0) > 0 AND COALESCE(lm.new_stock, 0) <= p.min_stock_level THEN 1 END) as low_stock_count,
        COUNT(CASE WHEN COALESCE(lm.new_stock, 0) > p.min_stock_level THEN 1 END) as in_stock_count
      FROM products p
      LEFT JOIN latest_movements lm ON p.id = lm.product_id
      WHERE p.business_id = $1;
    `;

    const [salesRes, invRes] = await Promise.all([
      db.query(salesQuery, [businessId, today]),
      db.query(inventoryQuery, [businessId])
    ]);

    const s = salesRes.rows?.[0] || {};
    const i = invRes.rows?.[0] || {};

    const todayRev = Number(s.today_revenue || 0);
    const todayCogs = Number(s.today_cogs || 0);
    const todayProfit = todayRev - todayCogs;

    const allTimeRev = Number(s.all_time_revenue || 0);
    const allTimeCogs = Number(s.all_time_cogs || 0);
    const allTimeProfit = allTimeRev - allTimeCogs;

    return {
      today: {
        date: today,
        revenue: todayRev,
        salesCount: Number(s.today_sales_count || 0),
        estimatedProfit: todayProfit,
        profitMargin: todayRev > 0 ? Number(((todayProfit / todayRev) * 100).toFixed(2)) : 0
      },
      allTime: {
        totalSalesCount: Number(s.all_time_sales_count || 0),
        totalRevenue: allTimeRev,
        estimatedProfit: allTimeProfit
      },
      inventory: {
        totalProducts: Number(i.total_products || 0),
        totalValuation: Number(i.total_inventory_value || 0),
        inStockCount: Number(i.in_stock_count || 0),
        lowStockCount: Number(i.low_stock_count || 0),
        outOfStockCount: Number(i.out_of_stock_count || 0)
      }
    };
  }
};

/**
 * Controller: insights
 * Purpose: Handle requests for daily, weekly, monthly trends, top-selling and slow-moving items
 * Owner: Member 2
 */

const service = require('./insights.service');

module.exports = {
  getSalesTrends: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { interval = 'day' } = req.query; // 'day', 'week', 'month'
      const trends = await service.getSalesTrends(businessId, interval);
      res.json({ success: true, data: trends });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getTopSellers: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { limit = 10, days = 30 } = req.query;
      const topSellers = await service.getTopSellers(businessId, limit, days);
      res.json({ success: true, data: topSellers });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getSlowMovers: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { limit = 10, days = 30 } = req.query;
      const slowMovers = await service.getSlowMovers(businessId, limit, days);
      res.json({ success: true, data: slowMovers });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

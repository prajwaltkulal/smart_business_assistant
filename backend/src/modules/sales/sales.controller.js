/**
 * Controller: sales
 * Purpose: Handle requests for imported sales records and daily sales reports
 * Owner: Member 2
 */

const service = require('./sales.service');

module.exports = {
  getSales: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { startDate, endDate, page = 1, limit = 20 } = req.query;
      const result = await service.getSales({ businessId, startDate, endDate, page, limit });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getDailySummary: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { date } = req.query;
      const summary = await service.getDailySummary({ businessId, date });
      res.json({ success: true, data: summary });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getSaleDetails: async (req, res, next) => {
    try {
      const { id } = req.params;
      const sale = await service.getSaleDetails(id);
      if (!sale) {
        return res.status(404).json({ success: false, message: 'Sale record not found' });
      }
      res.json({ success: true, data: sale });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
};

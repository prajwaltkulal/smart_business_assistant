/**
 * Controller: sales
 * Purpose: Handle requests for imported sales records and daily sales reports
 * Owner: Member 2
 */

const service = require('./sales.service');

module.exports = {
  getSales: async (req, res, next) => {
    try {
      const { businessId, startDate, endDate, page, limit } = req.query;
      const result = await service.getSales({ businessId, startDate, endDate, page, limit });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  getDailySummary: async (req, res, next) => {
    try {
      const { businessId, date } = req.query;
      const summary = await service.getDailySummary({ businessId, date });
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
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
      next(err);
    }
  }
};

/**
 * Controller: dashboard
 * Purpose: Handle requests for dashboard summary metrics
 * Owner: Member 3
 */

const service = require('./dashboard.service');

module.exports = {
  getSummary: async (req, res, next) => {
    try {
      const { businessId } = req.query;
      const summary = await service.getDashboardSummary(businessId);
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }
};

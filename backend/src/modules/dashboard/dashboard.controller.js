/**
 * Controller: dashboard
 * Purpose: Handle requests for dashboard summary metrics
 * Owner: Member 2
 */

const service = require('./dashboard.service');

module.exports = {
  getSummary: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const summary = await service.getDashboardSummary(businessId);
      res.json({ success: true, data: summary });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

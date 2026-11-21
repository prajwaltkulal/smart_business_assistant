/**
 * Controller: settings
 * Purpose: Handle requests for viewing and modifying business configuration
 * Owner: Member 1 (Prajwal)
 */

const service = require('./settings.service');

module.exports = {
  getSettings: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const settings = await service.getSettings(businessId);
      res.json({ success: true, data: settings });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  updateSettings: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.body.businessId;
      const updated = await service.updateSettings(businessId, req.body);
      res.json({ success: true, message: 'Settings updated successfully', data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

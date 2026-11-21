/**
 * Controller: business
 * Purpose: Handle requests for creating and managing shop profiles
 * Owner: Member 2
 */

const service = require('./business.service');

module.exports = {
  create: async (req, res, next) => {
    try {
      const ownerId = req.user.id;
      const { name, category, operatingMode, currency, address, phone, email } = req.body;
      const result = await service.createBusiness({
        name,
        category,
        operatingMode,
        currency,
        address,
        phone,
        email,
        ownerId
      });
      res.status(201).json({ success: true, message: 'Business created successfully', data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const business = await service.getBusinessById(id);
      res.json({ success: true, data: business });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await service.updateBusiness(id, req.body);
      res.json({ success: true, message: 'Business updated successfully', data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

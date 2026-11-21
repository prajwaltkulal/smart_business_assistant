/**
 * Controller: products
 * Purpose: Handle incoming HTTP requests and responses for product catalog
 * Owner: Member 1 (Prajwal)
 */

const service = require('./products.service');

module.exports = {
  create: async (req, res, next) => {
    try {
      const businessId = req.businessMembership.business_id || req.body.businessId || req.query.businessId;
      const userId = req.user?.id;
      const product = await service.createProduct({
        ...req.body,
        businessId,
        userId
      });
      res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getAll: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { search, category, page = 1, limit = 20 } = req.query;
      const result = await service.getProducts({ businessId, search, category, page, limit });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getById: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { id } = req.params;
      const product = await service.getProductById(id, businessId);
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.body.businessId || req.query.businessId;
      const { id } = req.params;
      const updated = await service.updateProduct(id, businessId, req.body);
      res.json({ success: true, message: 'Product updated successfully', data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  delete: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const { id } = req.params;
      const result = await service.deleteProduct(id, businessId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getCategories: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const categories = await service.getCategories(businessId);
      res.json({ success: true, data: categories });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

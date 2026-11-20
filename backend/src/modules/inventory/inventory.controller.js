/**
 * Controller: inventory
 * Purpose: Handle requests for stock levels, additions, adjustments, movements, and alerts
 * Owner: Member 3
 */

const service = require('./inventory.service');

module.exports = {
  getStockLevels: async (req, res, next) => {
    try {
      const { businessId, category, search, status } = req.query;
      const stock = await service.getStockLevels({ businessId, category, search, status });
      res.json({ success: true, data: stock });
    } catch (err) {
      next(err);
    }
  },

  getStockMovements: async (req, res, next) => {
    try {
      const { businessId, productId, page, limit } = req.query;
      const movements = await service.getStockMovements({ businessId, productId, page, limit });
      res.json({ success: true, ...movements });
    } catch (err) {
      next(err);
    }
  },

  getStockAlerts: async (req, res, next) => {
    try {
      const { businessId } = req.query;
      const alerts = await service.getStockAlerts(businessId);
      res.json({ success: true, data: alerts });
    } catch (err) {
      next(err);
    }
  },

  recordAdjustment: async (req, res, next) => {
    try {
      const { businessId, productId, adjustmentQuantity, reason } = req.body;
      const userId = req.user?.id || req.body.userId;
      const result = await service.recordAdjustment({
        businessId,
        productId,
        adjustmentQuantity,
        reason,
        userId
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  recordAddition: async (req, res, next) => {
    try {
      const { businessId, productId, quantity, unitCost, reason } = req.body;
      const userId = req.user?.id || req.body.userId;
      const result = await service.recordAddition({
        businessId,
        productId,
        quantity,
        unitCost,
        reason,
        userId
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
};

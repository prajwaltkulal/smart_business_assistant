/**
 * Service: inventory
 * Purpose: Business logic for continuous inventory balances, adjustments, additions, and alerts
 * Owner: Member 3
 */

const repository = require('./inventory.repository');

module.exports = {
  getStockLevels: async (filters) => {
    return await repository.getCurrentStock(filters);
  },

  getStockMovements: async (filters) => {
    return await repository.getMovements(filters);
  },

  getStockAlerts: async (businessId) => {
    return await repository.getAlerts(businessId);
  },

  recordAdjustment: async ({ businessId, productId, adjustmentQuantity, reason, userId }) => {
    if (!productId || adjustmentQuantity === undefined) {
      throw new Error('Product ID and adjustment quantity are required');
    }
    return await repository.applyStockMovement({
      businessId,
      productId,
      movementType: 'manual_adjustment',
      quantityDelta: Number(adjustmentQuantity),
      reason: reason || 'Manual Physical Stock Adjustment',
      referenceType: 'manual',
      userId
    });
  },

  recordAddition: async ({ businessId, productId, quantity, unitCost, reason, userId }) => {
    if (!productId || !quantity || Number(quantity) <= 0) {
      throw new Error('Valid product and positive quantity required');
    }
    return await repository.applyStockMovement({
      businessId,
      productId,
      movementType: 'stock_addition',
      quantityDelta: Number(quantity),
      unitCost: unitCost || 0,
      reason: reason || 'Stock Addition / Purchase Receipt',
      referenceType: 'purchase',
      userId
    });
  }
};

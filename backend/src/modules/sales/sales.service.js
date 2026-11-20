/**
 * Service: sales
 * Purpose: Business logic for imported sales reports
 * Owner: Member 2
 */

const repository = require('./sales.repository');

module.exports = {
  getSales: async (filters) => {
    return await repository.findSales(filters);
  },

  getDailySummary: async ({ businessId, date }) => {
    return await repository.getDailySummary(businessId, date);
  },

  getSaleDetails: async (id) => {
    return await repository.findByIdWithItems(id);
  }
};

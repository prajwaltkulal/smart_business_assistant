/**
 * Service: insights
 * Purpose: Business logic for sales analysis and product velocity categorization
 * Owner: Member 4
 */

const repository = require('./insights.repository');

module.exports = {
  getSalesTrends: async (businessId, interval) => {
    return await repository.getTrends(businessId, interval);
  },

  getTopSellers: async (businessId, limit, days) => {
    return await repository.getTopProducts(businessId, Number(limit), Number(days));
  },

  getSlowMovers: async (businessId, limit, days) => {
    return await repository.getSlowProducts(businessId, Number(limit), Number(days));
  }
};

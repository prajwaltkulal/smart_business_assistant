/**
 * Service: dashboard
 * Purpose: Aggregation logic for total sales, revenue, profit, inventory value, and stock levels
 * Owner: Member 3
 */

const repository = require('./dashboard.repository');

module.exports = {
  getDashboardSummary: async (businessId) => {
    return await repository.getAggregatedSummary(businessId);
  }
};

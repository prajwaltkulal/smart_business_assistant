/**
 * API Client: insightsApi
 * Purpose: Frontend HTTP methods for sales trends, top sellers, and slow moving products
 * Owner: Member 2
 */

import { apiRequest } from './apiClient';

export const insightsApi = {
  getTrends: (interval = 'day') => {
    return apiRequest(`/insights/trends?interval=${interval}`);
  },

  getTopSellers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/insights/top-sellers${query ? `?${query}` : ''}`);
  },

  getSlowMovers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/insights/slow-movers${query ? `?${query}` : ''}`);
  }
};

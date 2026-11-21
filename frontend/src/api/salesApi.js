/**
 * API Client: salesApi
 * Purpose: Frontend HTTP methods for querying imported daily sales and daily summaries
 * Owner: Member 2
 */

import { apiRequest } from './apiClient';

export const salesApi = {
  getSales: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/sales${query ? `?${query}` : ''}`);
  },

  getDailySummary: (date) => {
    return apiRequest(`/sales/daily-summary${date ? `?date=${date}` : ''}`);
  },

  getSaleDetails: (id) => {
    return apiRequest(`/sales/${id}`);
  }
};

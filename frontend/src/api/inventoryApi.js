/**
 * API Client: inventoryApi
 * Purpose: Frontend HTTP methods for inventory stock levels, movements, additions, adjustments, and alerts
 * Owner: Member 1 (Prajwal)
 */

import { apiRequest } from './apiClient';

export const inventoryApi = {
  getStock: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/inventory/stock${query ? `?${query}` : ''}`);
  },

  getMovements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/inventory/movements${query ? `?${query}` : ''}`);
  },

  getAlerts: () => {
    return apiRequest('/inventory/alerts');
  },

  recordAdjustment: (adjustmentData) => {
    return apiRequest('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(adjustmentData)
    });
  },

  recordAddition: (additionData) => {
    return apiRequest('/inventory/add', {
      method: 'POST',
      body: JSON.stringify(additionData)
    });
  }
};

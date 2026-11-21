/**
 * API Client: importsApi
 * Purpose: Frontend HTTP methods for dual CSV imports (Initial Inventory & Daily Sales), validation preview, and confirmation
 * Owner: Member 2
 */

import { apiRequest } from './apiClient';

export const importsApi = {
  previewInitialInventory: (payload) => {
    return apiRequest('/imports/preview/initial-inventory', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  previewDailySales: (payload) => {
    return apiRequest('/imports/preview/daily-sales', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  confirmImport: (importId) => {
    return apiRequest(`/imports/confirm/${importId}`, {
      method: 'POST'
    });
  },

  getHistory: (importType = '') => {
    return apiRequest(`/imports/history${importType ? `?importType=${importType}` : ''}`);
  },

  getDetails: (importId) => {
    return apiRequest(`/imports/${importId}`);
  }
};

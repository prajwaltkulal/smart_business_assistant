/**
 * API Client: settingsApi
 * Purpose: Frontend HTTP methods for shop settings, operating mode, and currency
 * Owner: Member 1 (Prajwal)
 */

import { apiRequest } from './apiClient';

export const settingsApi = {
  getSettings: () => {
    return apiRequest('/settings');
  },

  updateSettings: (settingsData) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  }
};

/**
 * API Client: authApi
 * Purpose: Frontend HTTP methods for login, registration, and session check
 * Owner: Shared
 */

import { apiRequest } from './apiClient';

export const authApi = {
  login: (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  register: (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getCurrentUser: () => {
    return apiRequest('/auth/me');
  }
};

/**
 * API Client: recommendationsApi
 * Purpose: Frontend HTTP methods for budget-aware restocking suggestions
 * Owner: Member 2
 */

import { apiRequest } from './apiClient';

export const recommendationsApi = {
  getRestockPlan: (payload = { budget: 10000 }) => {
    return apiRequest('/recommendations/restock', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

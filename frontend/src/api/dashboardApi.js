/**
 * API Client: dashboardApi
 * Purpose: Frontend HTTP methods for dashboard KPI summaries and alerts
 * Owner: Member 2
 */

import { apiRequest } from './apiClient';

export const dashboardApi = {
  getSummary: () => {
    return apiRequest('/dashboard/summary');
  }
};

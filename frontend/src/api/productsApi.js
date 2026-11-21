/**
 * API Client: productsApi
 * Purpose: Frontend HTTP methods for products endpoints
 * Owner: Member 1 (Prajwal)
 */

import { apiRequest } from './apiClient';

export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },

  getById: (id) => {
    return apiRequest(`/products/${id}`);
  },

  getCategories: () => {
    return apiRequest('/products/categories');
  },

  create: (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  update: (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  delete: (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  }
};

/**
 * API Fetch Client Configuration
 * Purpose: Central HTTP client with Authorization token & Business ID header handling
 * Owner: Shared
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const businessId = localStorage.getItem('active_business_id');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(businessId ? { 'X-Business-Id': businessId } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error?.message || 'API request failed');
  }

  return data;
}

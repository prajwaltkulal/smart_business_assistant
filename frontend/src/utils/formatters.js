/**
 * Utility: Formatters
 * Purpose: Format currency, dates, and stock units
 * Owner: Shared
 */

export function formatCurrency(amount, currency = '₹') {
  return `${currency}${Number(amount || 0).toLocaleString()}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
}

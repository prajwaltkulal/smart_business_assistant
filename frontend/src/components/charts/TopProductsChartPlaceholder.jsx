/**
 * Component: TopProductsChartPlaceholder
 * Purpose: Placeholder for Top Products bar chart (renders container without fake data)
 * Owner: Member 4
 */

import React from 'react';

export default function TopProductsChartPlaceholder({ title = 'Top Selling Products Chart' }) {
  return (
    <div className="chart-placeholder">
      <h4>{title}</h4>
      <p>Awaiting transaction history to rank products...</p>
    </div>
  );
}

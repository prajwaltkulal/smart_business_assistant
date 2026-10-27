/**
 * Component: SalesChartPlaceholder
 * Purpose: Placeholder for Sales performance chart (renders container without fake data)
 * Owner: Member 4
 */

import React from 'react';

export default function SalesChartPlaceholder({ title = 'Sales Performance Chart' }) {
  return (
    <div className="chart-placeholder">
      <h4>{title}</h4>
      <p>Awaiting sales data to render chart...</p>
    </div>
  );
}

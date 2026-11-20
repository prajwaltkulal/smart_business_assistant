/**
 * Component: SummaryCards
 * Purpose: Display key performance indicators: Today's Revenue, Estimated Profit, Total Inventory Valuation, and Low Stock Alerts
 * Owner: Member 1
 * Section: Dashboard
 */

import React, { useState } from 'react';

export default function SummaryCards() {
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    estimatedProfit: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    activeProducts: 0
  });

  return (
    <div className="summary-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
      <div className="card metric-card" style={{ padding: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>Today's Revenue</h4>
        <h2 style={{ margin: 0, color: '#2b6cb0' }}>₹{metrics.todayRevenue.toLocaleString()}</h2>
        <span style={{ fontSize: '12px', color: '#888' }}>From imported daily sales</span>
      </div>

      <div className="card metric-card" style={{ padding: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>Estimated Gross Profit</h4>
        <h2 style={{ margin: 0, color: '#2f855a' }}>₹{metrics.estimatedProfit.toLocaleString()}</h2>
        <span style={{ fontSize: '12px', color: '#888' }}>Revenue minus purchase cost</span>
      </div>

      <div className="card metric-card" style={{ padding: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>Total Inventory Value</h4>
        <h2 style={{ margin: 0, color: '#4a5568' }}>₹{metrics.totalInventoryValue.toLocaleString()}</h2>
        <span style={{ fontSize: '12px', color: '#888' }}>Current continuous stock value</span>
      </div>

      <div className="card metric-card" style={{ padding: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>Stock Alerts</h4>
        <h2 style={{ margin: 0, color: metrics.lowStockCount > 0 ? '#c53030' : '#2f855a' }}>
          {metrics.lowStockCount} Products
        </h2>
        <span style={{ fontSize: '12px', color: '#888' }}>Items requiring restocking</span>
      </div>
    </div>
  );
}

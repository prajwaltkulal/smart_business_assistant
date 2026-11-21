/**
 * Component: TopSellers
 * Purpose: Display high-velocity products ranked by quantity sold and revenue
 * Owner: Member 2
 * Section: Business Insights
 */

import React, { useState, useEffect } from 'react';
import { insightsApi } from '../../../api/insightsApi';

export default function TopSellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTopSellers() {
      try {
        setLoading(true);
        const res = await insightsApi.getTopSellers({ limit: 10, days: 30 });
        setItems(res.data || []);
      } catch (err) {
        console.error('Failed to load top sellers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopSellers();
  }, []);

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>🏆 Top Selling Products (Last 30 Days)</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '8px' }}>Product</th>
              <th style={{ padding: '8px' }}>Units Sold</th>
              <th style={{ padding: '8px' }}>Revenue</th>
              <th style={{ padding: '8px' }}>Profit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '16px' }}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>No sales data.</td></tr>
            ) : (
              items.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '8px' }}><strong>{p.name}</strong></td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.units_sold}</td>
                  <td style={{ padding: '8px', color: '#2563eb' }}>₹{Number(p.total_revenue).toFixed(2)}</td>
                  <td style={{ padding: '8px', color: '#16a34a' }}>₹{Number(p.total_profit).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

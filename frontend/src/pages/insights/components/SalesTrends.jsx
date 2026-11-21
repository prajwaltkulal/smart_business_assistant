/**
 * Component: SalesTrends
 * Purpose: Display daily, weekly, and monthly sales trend breakdown
 * Owner: Member 2
 * Section: Business Insights
 */

import React, { useState, useEffect } from 'react';
import { insightsApi } from '../../../api/insightsApi';

export default function SalesTrends({ interval }) {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true);
        const res = await insightsApi.getTrends(interval);
        setTrends(res.data || []);
      } catch (err) {
        console.error('Failed to load trends:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, [interval]);

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
        Sales & Profit Performance ({interval.toUpperCase()})
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '10px 8px' }}>Period</th>
              <th style={{ padding: '10px 8px' }}>Order Count</th>
              <th style={{ padding: '10px 8px' }}>Total Revenue</th>
              <th style={{ padding: '10px 8px' }}>Cost of Goods (COGS)</th>
              <th style={{ padding: '10px 8px' }}>Gross Profit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading trends...</td>
              </tr>
            ) : trends.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No trend data recorded yet.</td>
              </tr>
            ) : (
              trends.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '10px 8px' }}><strong>{t.period}</strong></td>
                  <td style={{ padding: '10px 8px' }}>{t.order_count}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#2563eb' }}>₹{Number(t.total_revenue).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px' }}>₹{Number(t.total_cogs).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#16a34a' }}>₹{Number(t.gross_profit).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

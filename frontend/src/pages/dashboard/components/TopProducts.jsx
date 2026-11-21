/**
 * Component: TopProducts
 * Purpose: Top Selling Products performance bars ranking units sold, revenue, and gross profit contribution from real database
 * Owner: Member 2
 * Section: Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insightsApi } from '../../../api/insightsApi';

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTop() {
      try {
        setLoading(true);
        const res = await insightsApi.getTopSellers({ limit: 5, days: 30 });
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load top products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTop();
  }, []);

  const displayList = products;
  const maxRevenue = Math.max(...displayList.map(p => Number(p.total_revenue || 0)), 1);

  return (
    <div className="dashboard-card col-span-4" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '17px', fontWeight: '800' }}>
            Top Selling Products
          </h3>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '12px' }}>
            Ranked by actual sales volume & revenue
          </p>
        </div>
        <button
          onClick={() => navigate('/insights')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          View All →
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          Loading product rankings...
        </div>
      ) : displayList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {displayList.map((prod, idx) => {
            const rev = Number(prod.total_revenue || 0);
            const profit = Number(prod.total_profit || 0);
            const barWidth = Math.min(Math.max((rev / maxRevenue) * 100, 10), 100);
            const badgeColors = ['#eff6ff', '#ecfdf5', '#fffbeb', '#f8fafc', '#f8fafc'];
            const textColors = ['#1d4ed8', '#047857', '#b45309', '#475569', '#475569'];

            return (
              <div key={prod.id || idx} style={{ paddingBottom: '12px', borderBottom: idx < displayList.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: badgeColors[idx] || '#f1f5f9',
                      color: textColors[idx] || '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{prod.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{prod.category || 'General'} • {prod.sku}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                      ₹{rev.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
                      +₹{profit.toFixed(2)} profit
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div style={{ width: '100%', height: '7px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    borderRadius: '4px',
                    background: idx === 0
                      ? 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)'
                      : idx === 1
                      ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                      : '#94a3b8'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10.5px', color: '#64748b' }}>
                  <span>{prod.units_sold} units sold</span>
                  <span>{((rev / maxRevenue) * 100).toFixed(0)}% volume share</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          padding: '28px 16px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px dashed #cbd5e1',
          margin: 'auto 0'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏆</div>
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>No Sales Transactions Recorded</div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 12px 0' }}>
            Products will be automatically ranked once daily sales reports are imported.
          </p>
          <button
            onClick={() => navigate('/reports-imports')}
            style={{
              padding: '6px 14px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📥 Import Daily Sales
          </button>
        </div>
      )}
    </div>
  );
}
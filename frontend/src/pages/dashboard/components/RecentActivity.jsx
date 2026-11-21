/**
 * Component: RecentActivity
 * Purpose: Live continuous stock audit ledger stream showing sales deductions, purchases, and imports
 * Owner: Member 1 (Prajwal)
 * Section: Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../../api/inventoryApi';

export default function RecentActivity() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        const res = await inventoryApi.getMovements({ limit: 6 });
        setMovements(res.data?.movements || res.data || []);
      } catch (err) {
        console.error('Failed to load activity ledger:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  const getMovementBadge = (type) => {
    switch (type) {
      case 'sales_deduction':
        return { label: 'Sales Deduction', bg: '#fef2f2', color: '#dc2626', icon: '🛒' };
      case 'stock_addition':
        return { label: 'Stock Restock', bg: '#ecfdf5', color: '#059669', icon: '📥' };
      case 'initial_import':
        return { label: 'Catalog Import', bg: '#eef2ff', color: '#4f46e5', icon: '📋' };
      case 'manual_adjustment':
        return { label: 'Audit Adjustment', bg: '#fffbeb', color: '#d97706', icon: '⚖️' };
      default:
        return { label: type || 'Stock Event', bg: '#f1f5f9', color: '#475569', icon: '📦' };
    }
  };

  return (
    <div className="dashboard-card col-span-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '17px', fontWeight: '800' }}>
            Continuous Stock Ledger
          </h3>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '12px' }}>
            Real-time movement & audit history
          </p>
        </div>
        <button
          onClick={() => navigate('/inventory')}
          style={{
            background: 'none',
            border: 'none',
            color: '#4f46e5',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Full Ledger →
        </button>
      </div>

      {movements.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {movements.slice(0, 5).map((m, idx) => {
            const badge = getMovementBadge(m.movement_type);
            const delta = Number(m.quantity_delta);
            const isNegative = delta < 0;

            return (
              <div
                key={m.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>{badge.icon}</span>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a' }}>
                      {m.product_name || `Product #${m.product_id}`}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      <span style={{ color: badge.color, fontWeight: '700' }}>{badge.label}</span>
                      {m.created_at ? ` • ${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: isNegative ? '#dc2626' : '#16a34a'
                  }}>
                    {isNegative ? `${delta}` : `+${delta}`}
                  </span>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    Bal: {m.new_stock}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          padding: '24px 16px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px dashed #cbd5e1'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>📝</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
            No Stock Movements Recorded
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
            Stock transactions occur continuously on initial imports, purchases, and sales.
          </p>
        </div>
      )}
    </div>
  );
}
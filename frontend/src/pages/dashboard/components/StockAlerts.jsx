/**
 * Component: StockAlerts
 * Purpose: Urgent visual alerts for low-stock and out-of-stock products with immediate restock actions
 * Owner: Member 1 (Prajwal)
 * Section: Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../../api/inventoryApi';

export default function StockAlerts() {
  const [alerts, setAlerts] = useState({ lowStock: [], outOfStock: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        const res = await inventoryApi.getAlerts();
        if (res.data) {
          setAlerts(res.data);
        }
      } catch (err) {
        console.error('Failed to load inventory alerts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const totalAlerts = (alerts.lowStock?.length || 0) + (alerts.outOfStock?.length || 0);

  return (
    <div className="dashboard-card col-span-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '17px', fontWeight: '800' }}>
            Inventory Health & Alerts
          </h3>
          {totalAlerts > 0 && (
            <span style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {totalAlerts} Urgent
            </span>
          )}
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
          Open Ledger →
        </button>
      </div>

      {totalAlerts > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Out of Stock Items */}
          {alerts.outOfStock?.map(item => (
            <div
              key={`out-${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#991b1b' }}>{item.name}</div>
                <div style={{ fontSize: '11px', color: '#b91c1c' }}>
                  SKU: {item.sku} • Min Level: {item.min_stock_level}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  0 Stock
                </span>
              </div>
            </div>
          ))}

          {/* Low Stock Items */}
          {alerts.lowStock?.map(item => (
            <div
              key={`low-${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#92400e' }}>{item.name}</div>
                <div style={{ fontSize: '11px', color: '#b45309' }}>
                  SKU: {item.sku} • Min: {item.min_stock_level} {item.unit}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  backgroundColor: '#f59e0b',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  {item.current_stock} Left
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '28px 16px',
          textAlign: 'center',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>✅</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#166534' }}>All Stock Levels Healthy</div>
          <p style={{ fontSize: '12px', color: '#15803d', margin: '4px 0 0 0' }}>
            No products have breached their minimum safety stock thresholds.
          </p>
        </div>
      )}

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Automatic reorder triggers enabled</span>
        <button
          onClick={() => navigate('/recommendations')}
          style={{
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#334155',
            cursor: 'pointer'
          }}
        >
          💡 Restock Optimizer
        </button>
      </div>
    </div>
  );
}
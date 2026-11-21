/**
 * Component: Recommendations
 * Purpose: AI-assisted restocking recommendations preview for the business owner
 * Owner: Member 2
 * Section: Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationsApi } from '../../../api/recommendationsApi';

export default function Recommendations() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlan() {
      try {
        setLoading(true);
        const res = await recommendationsApi.getRestockPlan({ budget: 15000 });
        if (res.data) {
          setPlan(res.data);
        }
      } catch (err) {
        console.error('Failed to load restock plan:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, []);

  const items = (plan?.recommendations || plan?.plan || []).slice(0, 3);

  return (
    <div className="dashboard-card col-span-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '17px', fontWeight: '800' }}>
              Restock Recommendations
            </h3>
          </div>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '12px' }}>
            Budget-aware restocking suggestions
          </p>
        </div>
        <button
          onClick={() => navigate('/recommendations')}
          style={{
            background: 'none',
            border: 'none',
            color: '#4f46e5',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Plan Budget →
        </button>
      </div>

      {items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((rec, idx) => (
            <div
              key={rec.product_id || idx}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{rec.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Restock: <strong>+{rec.suggestedUnits || rec.suggested_quantity || 1} units</strong> • Cost: ₹{Number(rec.estimatedCost || rec.estimated_cost || 0).toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: rec.urgency === 'critical' ? '#dc2626' : rec.urgency === 'high' ? '#ea580c' : '#059669',
                  backgroundColor: rec.urgency === 'critical' ? '#fee2e2' : rec.urgency === 'high' ? '#ffedd5' : '#ecfdf5',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: `1px solid ${rec.urgency === 'critical' ? '#fca5a5' : rec.urgency === 'high' ? '#fdba74' : '#a7f3d0'}`
                }}>
                  {rec.urgency ? rec.urgency.toUpperCase() : 'RESTOCK'}
                </span>
              </div>
            </div>
          ))}

          <div style={{
            marginTop: '6px',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: '#eef2ff',
            color: '#4338ca',
            fontSize: '12px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Optimal plan ready for ₹15,000 working capital
          </div>
        </div>
      ) : (
        <div style={{
          padding: '24px 16px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px dashed #cbd5e1'
        }}>
          <div style={{ fontSize: '26px', marginBottom: '6px' }}>📦</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
            Restock Model Ready
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 10px 0' }}>
            Set a monthly restocking budget to generate prioritized purchasing lists.
          </p>
          <button
            onClick={() => navigate('/recommendations')}
            style={{
              padding: '6px 14px',
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Open Restock Planner
          </button>
        </div>
      )}
    </div>
  );
}
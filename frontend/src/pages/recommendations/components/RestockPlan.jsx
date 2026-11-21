/**
 * Component: RestockPlan
 * Purpose: Display proposed purchase order items, recommended quantities, estimated costs, and explainable reasons
 * Owner: Member 2
 * Section: Smart Recommendations
 */

import React from 'react';

export default function RestockPlan({ planData }) {
  const plan = planData?.plan || planData?.recommendations || [];

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Recommended Purchase Orders</h3>

      {plan.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
          ✓ All products have sufficient safety stock for the current sales velocity, or catalog has limited sales history.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 8px' }}>Product</th>
                <th style={{ padding: '10px 8px' }}>Current Stock</th>
                <th style={{ padding: '10px 8px' }}>Daily Sales Velocity</th>
                <th style={{ padding: '10px 8px' }}>Suggested Units</th>
                <th style={{ padding: '10px 8px' }}>Estimated Cost</th>
                <th style={{ padding: '10px 8px' }}>Urgency</th>
                <th style={{ padding: '10px 8px' }}>Reason & Decision Rationale</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <strong>{item.name}</strong>
                    {item.sku && <div style={{ fontSize: '11px', color: '#94a3b8' }}>SKU: {item.sku}</div>}
                  </td>
                  <td style={{ padding: '10px 8px' }}>{item.currentStock}</td>
                  <td style={{ padding: '10px 8px' }}>{item.dailyVelocity} units/day</td>
                  <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#2563eb', fontSize: '15px' }}>
                    +{item.suggestedUnits}
                  </td>
                  <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>₹{Number(item.estimatedCost).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      background: item.urgency === 'critical' ? '#fee2e2' : item.urgency === 'high' ? '#ffedd5' : '#f1f5f9',
                      color: item.urgency === 'critical' ? '#dc2626' : item.urgency === 'high' ? '#ea580c' : '#475569',
                      padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase'
                    }}>
                      {item.urgency}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', fontSize: '13px', color: '#334155' }}>
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

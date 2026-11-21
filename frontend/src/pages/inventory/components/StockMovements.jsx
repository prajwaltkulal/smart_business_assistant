/**
 * Component: StockMovements
 * Purpose: Display continuous stock movement audit history ledger (openings, additions, sales deductions, manual adjustments)
 * Owner: Member 1 (Prajwal)
 * Section: Inventory Management
 */

import React from 'react';

export default function StockMovements({ movements, loading, onRefresh }) {
  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Continuous Stock Movement Audit Ledger</h3>
          <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '13px' }}>
            Every initial import, daily sales deduction, and manual adjustment is tracked continuously with prior and new balances.
          </p>
        </div>
        <button
          onClick={onRefresh}
          style={{ background: 'none', border: '1px solid #cbd5e0', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}
        >
          ↻ Refresh Ledger
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
              <th style={{ padding: '10px 8px' }}>Date & Time</th>
              <th style={{ padding: '10px 8px' }}>Product</th>
              <th style={{ padding: '10px 8px' }}>Movement Type</th>
              <th style={{ padding: '10px 8px' }}>Previous Stock</th>
              <th style={{ padding: '10px 8px' }}>Change (Delta)</th>
              <th style={{ padding: '10px 8px' }}>New Closing Stock</th>
              <th style={{ padding: '10px 8px' }}>Reason / Notes</th>
              <th style={{ padding: '10px 8px' }}>Logged By</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '28px', color: '#718096' }}>
                  Loading continuous movement events...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '28px', color: '#718096' }}>
                  No stock movements recorded yet. Movements appear when initial stock is imported or adjustments are made.
                </td>
              </tr>
            ) : (
              movements.map((m) => {
                const isPositive = Number(m.quantity_delta) > 0;
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '10px 8px', color: '#718096' }}>
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <strong>{m.product_name}</strong>
                      {m.sku && <div style={{ fontSize: '11px', color: '#a0aec0' }}>SKU: {m.sku}</div>}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        background: m.movement_type === 'initial_import' ? '#ebf8ff' : m.movement_type === 'stock_addition' ? '#f0fff4' : '#fffaf0',
                        color: m.movement_type === 'initial_import' ? '#2b6cb0' : m.movement_type === 'stock_addition' ? '#276749' : '#c05621',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold'
                      }}>
                        {m.movement_type}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', color: '#718096' }}>{Number(m.previous_stock).toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 'bold', color: isPositive ? '#276749' : '#c53030' }}>
                      {isPositive ? `+${Number(m.quantity_delta).toFixed(2)}` : Number(m.quantity_delta).toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{Number(m.new_stock).toFixed(2)}</td>
                    <td style={{ padding: '10px 8px', color: '#4a5568' }}>{m.reason || '-'}</td>
                    <td style={{ padding: '10px 8px', color: '#718096' }}>{m.user_name || 'System / Auto'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

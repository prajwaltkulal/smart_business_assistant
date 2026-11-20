/**
 * Component: StockMovements
 * Purpose: Display continuous stock movement audit ledger (additions, sales deductions, manual adjustments)
 * Owner: Member 3
 * Section: Inventory Management
 */

import React, { useState } from 'react';

export default function StockMovements() {
  const [movements, setMovements] = useState([]);

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3>Stock Movement Audit History (Continuous Ledger)</h3>
      <p style={{ color: '#666', fontSize: '13px' }}>
        Tracks every stock addition, daily sales report deduction, and manual adjustment to preserve auditability.
      </p>

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th>Timestamp</th>
            <th>Product</th>
            <th>Movement Type</th>
            <th>Previous Stock</th>
            <th>Quantity Delta</th>
            <th>New Stock</th>
            <th>Reference</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {movements.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '24px' }}>
                No stock movement events logged yet. Stock movements are created when reports are imported or adjustments made.
              </td>
            </tr>
          ) : (
            movements.map((m) => (
              <tr key={m.id}>
                <td>{new Date(m.created_at).toLocaleString()}</td>
                <td>{m.product_name}</td>
                <td>{m.movement_type}</td>
                <td>{m.previous_stock}</td>
                <td style={{ color: m.quantity_delta < 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                  {m.quantity_delta > 0 ? `+${m.quantity_delta}` : m.quantity_delta}
                </td>
                <td><strong>{m.new_stock}</strong></td>
                <td>{m.reference_type} #{m.reference_id || '-'}</td>
                <td>{m.reason}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

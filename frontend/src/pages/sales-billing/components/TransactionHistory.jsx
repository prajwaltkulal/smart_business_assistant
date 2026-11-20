/**
 * Component: TransactionHistory
 * Purpose: Display imported sales transactions, daily summaries, invoice numbers, amounts, and discounts
 * Owner: Member 2
 * Section: Sales Reports
 */

import React, { useState, useEffect } from 'react';

export default function TransactionHistory() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In actual implementation, calls backend /api/sales and /api/sales/daily-summary
  }, [selectedDate]);

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Imported Sales Transactions</h3>
        <div>
          <label htmlFor="sales-date-filter" style={{ marginRight: '8px' }}>Date:</label>
          <input
            id="sales-date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="daily-summary-bar" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
        <div><strong>Daily Revenue:</strong> ₹{summary?.total_revenue || '0.00'}</div>
        <div><strong>Transactions:</strong> {summary?.total_transactions || 0}</div>
        <div><strong>Total Discounts:</strong> ₹{summary?.total_discount || '0.00'}</div>
        <div><strong>Estimated Profit:</strong> ₹{summary?.estimated_gross_profit || '0.00'}</div>
      </div>

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Source</th>
            <th>Total Amount</th>
            <th>Discount</th>
            <th>Net Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                No sales records found for this period. Upload a daily sales report in Reports & Imports.
              </td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.invoice_number || `INV-${sale.id}`}</td>
                <td>{sale.sale_date}</td>
                <td>{sale.source}</td>
                <td>₹{sale.total_amount}</td>
                <td>₹{sale.total_discount}</td>
                <td><strong>₹{sale.net_amount}</strong></td>
                <td><span className="badge badge-success">Imported</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

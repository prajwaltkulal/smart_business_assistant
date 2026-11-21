/**
 * Component: TransactionHistory
 * Purpose: Display imported sales transactions, daily summaries, invoice numbers, amounts, and discounts
 * Owner: Member 2
 * Section: Sales Reports
 */

import React, { useState, useEffect } from 'react';
import { salesApi } from '../../../api/salesApi';

export default function TransactionHistory() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        setLoading(true);
        const [salesRes, summaryRes] = await Promise.all([
          salesApi.getSales({ startDate: selectedDate, endDate: selectedDate }),
          salesApi.getDailySummary(selectedDate)
        ]);
        setSales(salesRes.sales || []);
        setSummary(summaryRes.data || null);
      } catch (err) {
        console.error('Failed to load sales data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSalesData();
  }, [selectedDate]);

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Imported Sales Transactions</h3>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            Daily transactions ingested from external billing software.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="sales-date-filter" style={{ fontWeight: 'bold', fontSize: '13px' }}>Filter by Date:</label>
          <input
            id="sales-date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          />
        </div>
      </div>

      {/* Daily Metrics Bar */}
      <div className="daily-summary-bar" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px',
        margin: '16px 0 24px 0', padding: '16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Daily Revenue</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>₹{Number(summary?.total_revenue || 0).toFixed(2)}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Transactions</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{summary?.total_transactions || 0} Orders</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Total Discounts</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ea580c' }}>₹{Number(summary?.total_discount || 0).toFixed(2)}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Estimated Profit</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>₹{Number(summary?.estimated_gross_profit || 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '10px 8px' }}>Invoice #</th>
              <th style={{ padding: '10px 8px' }}>Sale Date</th>
              <th style={{ padding: '10px 8px' }}>Source</th>
              <th style={{ padding: '10px 8px' }}>Gross Total</th>
              <th style={{ padding: '10px 8px' }}>Discount</th>
              <th style={{ padding: '10px 8px' }}>Net Amount</th>
              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  Loading imported transactions...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No sales records found for {selectedDate}. Upload a daily sales report in Reports & Imports.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '10px 8px' }}><strong>{sale.invoice_number || `INV-${sale.id}`}</strong></td>
                  <td style={{ padding: '10px 8px' }}>{sale.sale_date}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {sale.source}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>₹{Number(sale.total_amount).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px', color: '#ea580c' }}>₹{Number(sale.total_discount).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>₹{Number(sale.net_amount).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      Imported & Deducted
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

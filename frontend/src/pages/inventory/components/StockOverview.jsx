/**
 * Component: StockOverview
 * Purpose: Display current stock levels, inventory valuation, and stock alerts (in stock, low stock, out of stock)
 * Owner: Member 1 (Prajwal)
 * Section: Inventory Management
 */

import React from 'react';

export default function StockOverview({
  stockItems,
  loading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenAdjustModal,
  onOpenPurchaseModal
}) {
  const totalValuation = stockItems.reduce((sum, item) => sum + Number(item.total_valuation || 0), 0);
  const lowStockCount = stockItems.filter((i) => i.stock_status === 'low_stock').length;
  const outOfStockCount = stockItems.filter((i) => i.stock_status === 'out_of_stock').length;

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
      {/* Top Action Bar & Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#f7fafc', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid #3182ce' }}>
          <div style={{ fontSize: '12px', color: '#718096' }}>Total Stock Valuation</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2b6cb0' }}>₹{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div style={{ background: '#f7fafc', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid #dd6b20' }}>
          <div style={{ fontSize: '12px', color: '#718096' }}>Low Stock Items</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c05621' }}>{lowStockCount} Products</div>
        </div>
        <div style={{ background: '#f7fafc', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid #e53e3e' }}>
          <div style={{ fontSize: '12px', color: '#718096' }}>Out of Stock Items</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c53030' }}>{outOfStockCount} Products</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock (Reorder Needed)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onOpenPurchaseModal}
            style={{ backgroundColor: '#2f855a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Supplier Stock Arrival
          </button>
          <button
            onClick={onOpenAdjustModal}
            style={{ backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ± Adjust Stock
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
              <th style={{ padding: '12px 8px' }}>Product</th>
              <th style={{ padding: '12px 8px' }}>SKU</th>
              <th style={{ padding: '12px 8px' }}>Category</th>
              <th style={{ padding: '12px 8px' }}>Purchase Cost</th>
              <th style={{ padding: '12px 8px' }}>Selling Price</th>
              <th style={{ padding: '12px 8px' }}>Available Stock</th>
              <th style={{ padding: '12px 8px' }}>Inventory Value</th>
              <th style={{ padding: '12px 8px' }}>Alert Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#718096' }}>
                  Loading real-time stock balances...
                </td>
              </tr>
            ) : stockItems.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#718096' }}>
                  No inventory items match your search.
                </td>
              </tr>
            ) : (
              stockItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 8px' }}><strong>{item.name}</strong></td>
                  <td style={{ padding: '12px 8px', color: '#4a5568' }}>{item.sku || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ background: '#edf2f7', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>₹{Number(item.purchase_cost).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px' }}>₹{Number(item.selling_price).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', fontSize: '15px' }}>
                    <strong>{item.current_stock}</strong> {item.unit}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: '500' }}>
                    ₹{Number(item.total_valuation || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {item.stock_status === 'out_of_stock' && (
                      <span style={{ background: '#fed7d7', color: '#c53030', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        Out of Stock
                      </span>
                    )}
                    {item.stock_status === 'low_stock' && (
                      <span style={{ background: '#feebc8', color: '#c05621', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        Low Stock (≤{item.min_stock_level})
                      </span>
                    )}
                    {item.stock_status === 'in_stock' && (
                      <span style={{ background: '#c6f6d5', color: '#276749', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        In Stock
                      </span>
                    )}
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

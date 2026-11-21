/**
 * Component: ProductList
 * Purpose: Display product catalog table with search, category filtering, status badges, and edit/delete actions
 * Owner: Member 1 (Prajwal)
 */

import React from 'react';

export default function ProductList({
  products,
  loading,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  onEdit,
  onDelete
}) {
  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Search and Category Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by product name, SKU or barcode..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '160px' }}
        >
          <option value="">All Categories</option>
          {categories.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
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
              <th style={{ padding: '12px 8px' }}>Stock Status</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#718096' }}>
                  Loading catalog products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#718096' }}>
                  No products found. Click "Add Product" to create your first item or upload an Initial Inventory CSV.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <strong>{p.name}</strong>
                    {p.barcode && <div style={{ fontSize: '11px', color: '#a0aec0' }}>Barcode: {p.barcode}</div>}
                  </td>
                  <td style={{ padding: '12px 8px', color: '#4a5568' }}>{p.sku || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ background: '#edf2f7', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>₹{Number(p.purchase_cost).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>₹{Number(p.selling_price).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <strong>{p.current_stock}</strong> {p.unit}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {p.stock_status === 'out_of_stock' && (
                      <span style={{ background: '#fed7d7', color: '#c53030', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        Out of Stock
                      </span>
                    )}
                    {p.stock_status === 'low_stock' && (
                      <span style={{ background: '#feebc8', color: '#c05621', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        Low Stock (≤{p.min_stock_level})
                      </span>
                    )}
                    {p.stock_status === 'in_stock' && (
                      <span style={{ background: '#c6f6d5', color: '#276749', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        In Stock
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button
                      onClick={() => onEdit(p)}
                      style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', marginRight: '12px', fontWeight: 'bold' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
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

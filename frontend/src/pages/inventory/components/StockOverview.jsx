/**
 * Component: StockOverview
 * Purpose: Display available stock, inventory valuation, and stock alerts (in stock, low stock, out of stock)
 * Owner: Member 3
 * Section: Inventory Management
 */

import React, { useState, useEffect } from 'react';

export default function StockOverview() {
  const [stockItems, setStockItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Current Stock Levels & Inventory Status</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Purchase Cost</th>
            <th>Selling Price</th>
            <th>Available Stock</th>
            <th>Total Valuation</th>
            <th>Alert / Status</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '24px' }}>
                No inventory records available. Import your Initial Inventory CSV or Add Products.
              </td>
            </tr>
          ) : (
            stockItems.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td>{item.sku || '-'}</td>
                <td>{item.category}</td>
                <td>₹{item.purchase_cost}</td>
                <td>₹{item.selling_price}</td>
                <td>{item.current_stock} {item.unit}</td>
                <td>₹{item.total_valuation}</td>
                <td>
                  {item.stock_status === 'out_of_stock' && <span className="badge badge-danger" style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</span>}
                  {item.stock_status === 'low_stock' && <span className="badge badge-warning" style={{ color: 'orange', fontWeight: 'bold' }}>Low Stock</span>}
                  {item.stock_status === 'in_stock' && <span className="badge badge-success" style={{ color: 'green' }}>In Stock</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

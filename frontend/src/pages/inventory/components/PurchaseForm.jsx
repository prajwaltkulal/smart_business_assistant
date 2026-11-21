/**
 * Component: PurchaseForm
 * Purpose: Modal form to record incoming supplier stock arrivals with unit costs and invoice numbers
 * Owner: Member 1 (Prajwal)
 * Section: Inventory Management
 */

import React, { useState } from 'react';

export default function PurchaseForm({ isOpen, onClose, onSave, products = [] }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleProductSelect = (id) => {
    setProductId(id);
    const selected = products.find((p) => String(p.id) === String(id));
    if (selected && selected.purchase_cost) {
      setUnitCost(selected.purchase_cost);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productId) {
      setError('Please select a product.');
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setError('Arrival quantity must be greater than 0.');
      return;
    }

    const reason = `Supplier Stock Arrival${invoiceRef ? ` - Invoice #${invoiceRef.trim()}` : ''}`;

    try {
      setSubmitting(true);
      await onSave({
        productId: Number(productId),
        quantity: qty,
        unitCost: Number(unitCost || 0),
        reason
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record purchase receipt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Record Supplier Stock Arrival</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        {error && (
          <div style={{ background: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Select Product *</label>
            <select
              value={productId}
              onChange={(e) => handleProductSelect(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">-- Choose incoming product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.current_stock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Quantity Received *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Unit Purchase Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="0.00"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Supplier Invoice # / PO Reference</label>
            <input
              type="text"
              value={invoiceRef}
              onChange={(e) => setInvoiceRef(e.target.value)}
              placeholder="e.g. INV-90412 / PO-88"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#2f855a', color: '#fff', cursor: 'pointer' }}
            >
              {submitting ? 'Recording...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

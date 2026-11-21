/**
 * Component: AdjustmentForm
 * Purpose: Modal form for manual stock corrections (spoilage, damage, physical recount) with required reason selection
 * Owner: Member 1 (Prajwal)
 * Section: Inventory Management
 */

import React, { useState } from 'react';

export default function AdjustmentForm({ isOpen, onClose, onSave, products = [] }) {
  const [productId, setProductId] = useState('');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [direction, setDirection] = useState('deduct'); // 'deduct' or 'add'
  const [reasonCategory, setReasonCategory] = useState('Damaged Goods');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productId) {
      setError('Please select a product.');
      return;
    }

    const qty = Number(adjustmentQuantity);
    if (!qty || qty <= 0) {
      setError('Adjustment quantity must be greater than 0.');
      return;
    }

    const finalDelta = direction === 'deduct' ? -qty : qty;
    const finalReason = `${reasonCategory}${notes ? `: ${notes.trim()}` : ''}`;

    try {
      setSubmitting(true);
      await onSave({
        productId: Number(productId),
        adjustmentQuantity: finalDelta,
        reason: finalReason
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record adjustment');
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
          <h3 style={{ margin: 0 }}>Manual Stock Adjustment</h3>
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
              onChange={(e) => setProductId(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">-- Choose a product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.current_stock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Action</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="deduct">Deduct Stock (-)</option>
                <option value="add">Add Stock (+)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Quantity *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                placeholder="e.g. 5"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Adjustment Reason *</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="Damaged Goods">Damaged Goods / Broken Packaging</option>
              <option value="Expired / Spoiled">Expired / Spoiled</option>
              <option value="Customer Return">Customer Return (Restocked)</option>
              <option value="Physical Audit Correction">Physical Audit Correction (Count Discrepancy)</option>
              <option value="Sample / Internal Use">Sample / Internal Shop Use</option>
              <option value="Other Adjustment">Other Adjustment</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Additional Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Found 2 torn packs on shelf"
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
              style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#3182ce', color: '#fff', cursor: 'pointer' }}
            >
              {submitting ? 'Applying...' : 'Apply Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

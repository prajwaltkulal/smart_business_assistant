/**
 * Component: ProductForm
 * Purpose: Modal/form to add a new product or edit an existing one
 * Owner: Member 1 (Prajwal)
 */

import React, { useState, useEffect } from 'react';

export default function ProductForm({ isOpen, onClose, onSave, initialData, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'General',
    unit: 'pcs',
    purchaseCost: '',
    sellingPrice: '',
    minStockLevel: '5',
    initialStock: '0',
    description: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        barcode: initialData.barcode || '',
        category: initialData.category || 'General',
        unit: initialData.unit || 'pcs',
        purchaseCost: (initialData.purchase_cost !== null && initialData.purchase_cost !== undefined) ? String(initialData.purchase_cost) : '',
        sellingPrice: (initialData.selling_price !== null && initialData.selling_price !== undefined) ? String(initialData.selling_price) : '',
        minStockLevel: (initialData.min_stock_level !== null && initialData.min_stock_level !== undefined) ? String(initialData.min_stock_level) : '5',
        initialStock: '0',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        category: 'General',
        unit: 'pcs',
        purchaseCost: '',
        sellingPrice: '',
        minStockLevel: '5',
        initialStock: '0',
        description: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave({
        ...formData,
        purchaseCost: formData.purchaseCost !== '' && !isNaN(Number(formData.purchaseCost)) ? Number(formData.purchaseCost) : 0,
        sellingPrice: formData.sellingPrice !== '' && !isNaN(Number(formData.sellingPrice)) ? Number(formData.sellingPrice) : 0,
        minStockLevel: (formData.minStockLevel !== '' && !isNaN(Number(formData.minStockLevel))) ? Math.max(0, Number(formData.minStockLevel)) : 5,
        initialStock: Number(formData.initialStock || 0)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
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
        backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '540px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>{initialData ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        {error && (
          <div style={{ background: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Current Available Stock Banner for Existing Products */}
        {initialData && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#166534', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Current Physical Stock on Shelves
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>
                {initialData.current_stock !== undefined ? initialData.current_stock : '0'} {initialData.unit || 'units'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: Number(initialData.current_stock || 0) <= 0 
                  ? '#fee2e2' 
                  : Number(initialData.current_stock || 0) <= Number(initialData.min_stock_level || 5)
                  ? '#fef3c7'
                  : '#dcfce7',
                color: Number(initialData.current_stock || 0) <= 0 
                  ? '#dc2626' 
                  : Number(initialData.current_stock || 0) <= Number(initialData.min_stock_level || 5)
                  ? '#b45309'
                  : '#15803d'
              }}>
                {Number(initialData.current_stock || 0) <= 0 
                  ? '⚠️ Out of Stock (0 remaining)' 
                  : Number(initialData.current_stock || 0) <= Number(initialData.min_stock_level || 5)
                  ? `⚠️ Low Stock (≤ ${initialData.min_stock_level})`
                  : `✓ In Stock (${initialData.current_stock} remaining)`}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Basmati Rice 5kg"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>SKU (Stock Code)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. RICE-001"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Barcode</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="e.g. 890123456789"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Grains, Beverages"
                list="category-suggestions"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <datalist id="category-suggestions">
                {categories.map((c, i) => <option key={i} value={c} />)}
              </datalist>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="ltr">Liters (ltr)</option>
                <option value="box">Box</option>
                <option value="packet">Packet</option>
                <option value="bag">Bag</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Purchase Cost (₹) *</label>
              <input
                type="number"
                step="0.01"
                name="purchaseCost"
                value={formData.purchaseCost}
                onChange={handleChange}
                placeholder="0.00"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Min Stock Alert Level</label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleChange}
                placeholder="5"
                min="0"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '3px' }}>
                {initialData ? `Current stock is ${initialData.current_stock || 0}. Alert triggers if stock falls to or below this.` : 'Alert triggers when stock reaches this amount.'}
              </span>
            </div>
            {!initialData && (
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Opening Stock Quantity</label>
                <input
                  type="number"
                  name="initialStock"
                  value={formData.initialStock}
                  onChange={handleChange}
                  placeholder="0"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            )}
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
              {submitting ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

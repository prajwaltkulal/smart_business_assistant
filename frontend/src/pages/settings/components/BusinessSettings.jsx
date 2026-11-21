/**
 * Component: BusinessSettings
 * Purpose: Update shop profile, operating mode (Owner-Managed / Owner-Supervised), currency, and address
 * Owner: Member 1 (Prajwal)
 * Section: Settings
 */

import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../../api/settingsApi';

export default function BusinessSettings() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    operating_mode: 'owner_managed',
    currency: 'INR',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await settingsApi.getSettings();
        if (res.data) {
          setFormData({
            name: res.data.name || '',
            category: res.data.category || '',
            operating_mode: res.data.operating_mode || 'owner_managed',
            currency: res.data.currency || 'INR',
            address: res.data.address || '',
            phone: res.data.phone || '',
            email: res.data.email || ''
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.updateSettings({
        name: formData.name,
        category: formData.category,
        operatingMode: formData.operating_mode,
        currency: formData.currency,
        address: formData.address,
        phone: formData.phone,
        email: formData.email
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading business settings...</div>;
  }

  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Business Profile & Operating Mode</h3>
      <p style={{ margin: '0 0 20px 0', color: '#718096', fontSize: '14px' }}>
        Configure how your shop operates, set currency, and manage store metadata.
      </p>

      {message && (
        <div style={{ background: '#c6f6d5', color: '#22543d', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Shop / Business Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Business Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Retail Grocery, Supermarket"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        {/* Operating Mode Selector */}
        <div style={{ marginBottom: '20px', background: '#f7fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#2d3748' }}>
            Store Operating Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={{
              display: 'block', border: formData.operating_mode === 'owner_managed' ? '2px solid #3182ce' : '1px solid #cbd5e0',
              borderRadius: '6px', padding: '12px', cursor: 'pointer', background: '#fff'
            }}>
              <input
                type="radio"
                name="operating_mode"
                value="owner_managed"
                checked={formData.operating_mode === 'owner_managed'}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              <strong>Owner-Managed</strong>
              <p style={{ margin: '6px 0 0 20px', fontSize: '12px', color: '#718096' }}>
                You manage sales reports, inventory adjustments, and decisions personally.
              </p>
            </label>

            <label style={{
              display: 'block', border: formData.operating_mode === 'owner_supervised' ? '2px solid #3182ce' : '1px solid #cbd5e0',
              borderRadius: '6px', padding: '12px', cursor: 'pointer', background: '#fff'
            }}>
              <input
                type="radio"
                name="operating_mode"
                value="owner_supervised"
                checked={formData.operating_mode === 'owner_supervised'}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              <strong>Owner-Supervised</strong>
              <p style={{ margin: '6px 0 0 20px', fontSize: '12px', color: '#718096' }}>
                Staff upload daily billing reports and view stock; financial margins are restricted to owners.
              </p>
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="INR">Indian Rupee (₹ INR)</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
              <option value="GBP">British Pound (£ GBP)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Store Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Store Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Shop No., Street, City, State"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{ backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

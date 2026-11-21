/**
 * Component: InviteEmployee
 * Purpose: Modal form to invite an employee with a selected role and permissions
 * Owner: Member 1 (Prajwal)
 * Section: Team Management
 */

import React, { useState } from 'react';

export default function InviteEmployee({ isOpen, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [canViewFinancials, setCanViewFinancials] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      await onInvite({
        email: email.trim(),
        role,
        permissions: {
          canViewFinancials: role === 'owner' || role === 'manager' || canViewFinancials
        }
      });
      setEmail('');
      setRole('employee');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to invite team member');
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
        backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '440px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Invite Staff Member</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        {error && (
          <div style={{ background: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Employee Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. staff@shop.com"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>Assigned Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="employee">Cashier / Staff (Can view stock availability & upload daily reports)</option>
              <option value="manager">Manager (Can adjust stock & manage products)</option>
              <option value="owner">Co-Owner (Full access to profits, margins & settings)</option>
            </select>
          </div>

          {role === 'employee' && (
            <div style={{ marginBottom: '16px', background: '#f7fafc', padding: '10px', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canViewFinancials}
                  onChange={(e) => setCanViewFinancials(e.target.checked)}
                />
                Allow viewing cost prices & profit margins
              </label>
            </div>
          )}

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
              {submitting ? 'Inviting...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

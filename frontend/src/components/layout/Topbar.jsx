/**
 * Component: Topbar
 * Purpose: Header bar with shop profile, current user badge, operating mode tag, and logout action
 * Owner: Member 1 (Prajwal)
 */

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../hooks/useBusiness';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { business } = useBusiness();

  return (
    <header className="topbar" style={{
      height: '60px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
    }}>
      <div className="topbar-shop-name" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
          {business?.name || 'Smart Retail Store'}
        </span>
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          fontWeight: '600'
        }}>
          {business?.operating_mode === 'owner_supervised' ? 'Supervised Mode' : 'Owner-Managed'}
        </span>
      </div>

      <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{user?.name || 'Prajwal'}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{user?.email || 'prajwal.test@example.com'}</div>
        </div>
        <button
          onClick={logout}
          style={{
            background: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

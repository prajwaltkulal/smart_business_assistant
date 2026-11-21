/**
 * Component: Topbar
 * Purpose: Header bar with shop profile, current user badge, operating mode tag, role badge, and guaranteed logout
 * Owner: Member 1 (Prajwal)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../hooks/useBusiness';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { business } = useBusiness();
  const navigate = useNavigate();

  const role = user?.role || localStorage.getItem('user_role') || 'owner';
  const userName = user?.name || localStorage.getItem('user_name') || (role === 'owner' ? 'Prajwal (Owner)' : 'Store Supervisor');
  const userEmail = user?.email || localStorage.getItem('user_email') || (role === 'owner' ? 'prajwal.test@example.com' : 'supervisor@example.com');

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="topbar">
      <div className="topbar-shop-name" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '18px',
          boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
        }}>
          🏪
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
              {business?.name || 'Smart Retail Store'}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontWeight: '600',
              border: '1px solid #a7f3d0'
            }}>
              ● Active Shop
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {business?.operating_mode === 'owner_supervised' ? 'Owner-Supervised Mode' : 'Owner-Managed Store'}
          </div>
        </div>
      </div>

      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick CSV Import button */}
        <button
          onClick={() => navigate('/reports-imports')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#334155',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        >
          <span>📥</span> Import Daily Sales CSV
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        {/* User Profile Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: role === 'owner' ? '#e0e7ff' : '#fef3c7',
            color: role === 'owner' ? '#4338ca' : '#b45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '14px',
            border: `2px solid ${role === 'owner' ? '#c7d2fe' : '#fde68a'}`
          }}>
            {role === 'owner' ? '👑' : '🛡️'}
          </div>
          <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{userName}</span>
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: role === 'owner' ? '#e0e7ff' : '#fef3c7',
                color: role === 'owner' ? '#4338ca' : '#92400e',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {role}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>{userEmail}</span>
          </div>
        </div>

        {/* Guaranteed Working Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign out of account"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </header>
  );
}

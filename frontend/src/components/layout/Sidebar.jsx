/**
 * Component: Sidebar
 * Purpose: Primary navigation sidebar with active tab highlighting, section grouping, and role-aware navigation
 * Owner: Member 1 (Prajwal)
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import BrandLogo from '../common/BrandLogo';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const role = user?.role || localStorage.getItem('user_role') || 'owner';
  const isOwner = role === 'owner';

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    color: isActive ? '#ffffff' : '#94a3b8',
    backgroundColor: isActive ? '#2563eb' : 'transparent',
    borderRadius: '8px',
    margin: '3px 12px',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '500',
    fontSize: '13.5px',
    transition: 'all 0.15s ease'
  });

  const sectionLabelStyle = {
    padding: '16px 22px 6px 22px',
    fontSize: '10.5px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '20px 20px 18px 20px', borderBottom: '1px solid #1e293b' }}>
        <BrandLogo size="medium" lightMode={false} showSlogan={true} />
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav" style={{ padding: '10px 0', flex: 1, overflowY: 'auto' }}>
        <div style={sectionLabelStyle}>Main Operations</div>
        <NavLink to="/dashboard" style={linkStyle}>
          <span style={{ fontSize: '16px' }}>📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/products" style={linkStyle}>
          <span style={{ fontSize: '16px' }}>📦</span>
          <span>Products Catalog</span>
        </NavLink>
        <NavLink to="/inventory" style={linkStyle}>
          <span style={{ fontSize: '16px' }}>📋</span>
          <span>Stock & Ledger</span>
        </NavLink>
        <NavLink to="/sales-billing" style={linkStyle}>
          <span style={{ fontSize: '16px' }}>📑</span>
          <span>Sales Invoices</span>
        </NavLink>
        <NavLink to="/reports-imports" style={linkStyle}>
          <span style={{ fontSize: '16px' }}>📥</span>
          <span>CSV Imports Center</span>
        </NavLink>

        <div style={sectionLabelStyle}>Intelligence & Restock</div>
        <NavLink to="/insights" style={linkStyle}>
          <span style={{ fontSize: '16px' }}>📈</span>
          <span>Sales & Profit Trends</span>
        </NavLink>
        <NavLink to="/recommendations" style={linkStyle}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <span>Smart Restock Plan</span>
        </NavLink>

        {isOwner && (
          <>
            <div style={sectionLabelStyle}>Store Administration</div>
            <NavLink to="/team" style={linkStyle}>
              <span style={{ fontSize: '16px' }}>👥</span>
              <span>Team & Roles</span>
            </NavLink>
            <NavLink to="/settings" style={linkStyle}>
              <span style={{ fontSize: '16px' }}>⚙️</span>
              <span>Store Settings</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Status & Fast Logout Footer */}
      <div style={{
        padding: '16px',
        backgroundColor: '#090d16',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: role === 'owner' ? '#4f46e5' : '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            {role === 'owner' ? '👑' : '🛡️'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc', textTransform: 'capitalize' }}>
              {role} Account
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              {isOwner ? 'Full Owner Access' : 'Floor Supervisor'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign out of account"
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          🚪
        </button>
      </div>
    </aside>
  );
}

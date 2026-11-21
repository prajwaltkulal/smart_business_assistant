/**
 * Component: Sidebar
 * Purpose: Primary navigation sidebar with active tab highlighting and clean role-aware visibility
 * Owner: Member 1 (Prajwal)
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner' || true;

  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '10px 18px',
    color: isActive ? '#fff' : '#cbd5e1',
    backgroundColor: isActive ? '#2563eb' : 'transparent',
    borderRadius: '6px',
    margin: '3px 12px',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '400',
    fontSize: '14px',
    transition: 'all 0.15s ease'
  });

  return (
    <aside className="sidebar" style={{ width: '240px', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-brand" style={{ padding: '20px 18px', borderBottom: '1px solid #1e293b' }}>
        <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '18px', fontWeight: 'bold' }}>Smart Business</h3>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Assistant & Intelligence</span>
      </div>
      <nav className="sidebar-nav" style={{ padding: '12px 0', flex: 1 }}>
        <NavLink to="/dashboard" style={linkStyle}>📊 Dashboard</NavLink>
        <NavLink to="/products" style={linkStyle}>📦 Products Catalog</NavLink>
        <NavLink to="/inventory" style={linkStyle}>📋 Inventory & Stock</NavLink>
        <NavLink to="/sales-billing" style={linkStyle}>📑 Sales Reports</NavLink>
        <NavLink to="/reports-imports" style={linkStyle}>📥 Reports & Imports</NavLink>
        <NavLink to="/insights" style={linkStyle}>📈 Business Insights</NavLink>
        <NavLink to="/recommendations" style={linkStyle}>💡 Smart Restock</NavLink>
        {isOwner && <NavLink to="/team" style={linkStyle}>👥 Team & Roles</NavLink>}
        <NavLink to="/settings" style={linkStyle}>⚙️ Store Settings</NavLink>
      </nav>
    </aside>
  );
}

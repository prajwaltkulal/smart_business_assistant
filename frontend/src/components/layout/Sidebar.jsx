/**
 * Component: Sidebar
 * Purpose: Primary navigation sidebar for Smart Business Assistant
 * Navigation items:
 *   - Dashboard
 *   - Products
 *   - Inventory
 *   - Sales & Billing
 *   - Business Insights
 *   - Smart Recommendations
 *   - Team Management (hidden for non-owners via role check placeholder)
 *   - Reports & Imports
 *   - Settings
 * Owner: Member 1
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();
  
  // TODO: Replace placeholder role check with final role-based logic
  const isOwner = user?.role === 'owner' || true;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Smart Business</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/inventory">Inventory</NavLink>
        <NavLink to="/sales-billing">Sales & Billing</NavLink>
        <NavLink to="/insights">Business Insights</NavLink>
        <NavLink to="/recommendations">Smart Recommendations</NavLink>
        {isOwner && <NavLink to="/team">Team Management</NavLink>}
        <NavLink to="/reports-imports">Reports & Imports</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </aside>
  );
}

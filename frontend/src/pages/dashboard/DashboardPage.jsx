/**
 * Page: DashboardPage
 * Purpose: Central intelligent dashboard overview integrating live sales, profit analysis, stock health, and restock engine
 * Owner: Member 1 & 2
 * Section: Dashboard
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetupChecklist from './components/SetupChecklist';
import SummaryCards from './components/SummaryCards';
import SalesChart from './components/SalesChart';
import TopProducts from './components/TopProducts';
import StockAlerts from './components/StockAlerts';
import Recommendations from './components/Recommendations';
import RecentActivity from './components/RecentActivity';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page" style={{ paddingBottom: '40px' }}>
      {/* Page Title & Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Store Intelligence Dashboard
            </h1>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontWeight: '700',
              border: '1px solid #a7f3d0'
            }}>
              ● Real-time Sync
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13.5px' }}>
            Continuous inventory movements, sales profit analysis, and AI restock recommendations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/reports-imports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
            }}
          >
            <span>📥</span> Import Daily Sales CSV
          </button>
          <button
            onClick={() => navigate('/inventory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '10px 16px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <span>📦</span> Stock Ledger
          </button>
        </div>
      </div>

      {/* Guided Launch Checklist */}
      <SetupChecklist />

      {/* Primary KPI Summary Cards */}
      <SummaryCards />

      {/* Analytical Grid */}
      <div className="dashboard-grid">
        {/* Row 1: Dual Area Sales & Profit Graph (8 cols) + Top Products Ranking (4 cols) */}
        <SalesChart />
        <TopProducts />

        {/* Row 2: Stock Health Alerts (4 cols) + Restock Engine (4 cols) + Continuous Ledger (4 cols) */}
        <StockAlerts />
        <Recommendations />
        <RecentActivity />
      </div>
    </div>
  );
}
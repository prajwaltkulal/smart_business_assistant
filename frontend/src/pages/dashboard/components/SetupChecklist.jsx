/**
 * Component: SetupChecklist
 * Purpose: Interactive visual onboarding progress tracker for store owners
 * Owner: Member 1 (Prajwal)
 * Section: Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../../api/dashboardApi';

export default function SetupChecklist() {
  const [dismissed, setDismissed] = useState(false);
  const [stats, setStats] = useState({ totalProducts: 0, totalSalesCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await dashboardApi.getSummary();
        if (res.data) {
          setStats({
            totalProducts: res.data.inventory?.totalProducts || 0,
            totalSalesCount: res.data.allTime?.totalSalesCount || 0
          });
        }
      } catch (err) {
        console.error('Setup checklist check:', err);
      }
    }
    checkSetup();
  }, []);

  const steps = [
    { id: 1, title: 'Store Profile Configured', desc: 'Operating mode & shop credentials set', done: true, link: '/settings' },
    { id: 2, title: 'Master Products Catalog', desc: `${stats.totalProducts} products defined with SKU & pricing`, done: stats.totalProducts > 0, link: '/products' },
    { id: 3, title: 'Continuous Inventory Ledger', desc: 'Opening balances & safety stock active', done: stats.totalProducts > 0, link: '/inventory' },
    { id: 4, title: 'Daily Billing Report Ingestion', desc: stats.totalSalesCount > 0 ? `${stats.totalSalesCount} transactions processed` : 'Ready to import external billing register CSV', done: stats.totalSalesCount > 0, link: '/reports-imports' }
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  if (dismissed && progressPct === 100) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)',
      borderRadius: '12px',
      padding: '20px 24px',
      color: '#fff',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🚀</span>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>
              System Readiness & Launch Checklist
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#cbd5e1' }}>
              {completedCount} of {steps.length} milestones active • Continuous inventory & profit engine operational
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            backgroundColor: progressPct === 100 ? '#10b981' : '#4f46e5',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: '12px'
          }}>
            {progressPct}% COMPLETE
          </span>
          <button
            onClick={() => setDismissed(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '2px 6px'
            }}
            title="Dismiss checklist"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{
          width: `${progressPct}%`,
          height: '100%',
          backgroundColor: progressPct === 100 ? '#10b981' : '#6366f1',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Checklist Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {steps.map(step => (
          <div
            key={step.id}
            onClick={() => navigate(step.link)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              borderRadius: '8px',
              padding: '12px 14px',
              cursor: 'pointer',
              border: step.done ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: step.done ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {step.done ? '✓' : step.id}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: step.done ? '#f8fafc' : '#cbd5e1' }}>
                {step.title}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', paddingLeft: '26px' }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
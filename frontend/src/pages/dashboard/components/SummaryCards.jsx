/**
 * Component: SummaryCards
 * Purpose: Enterprise KPI cards for Today's Revenue, Gross Profit, Total Inventory Capital, and Restock Triggers
 * Owner: Member 2
 * Section: Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../../api/dashboardApi';

export default function SummaryCards() {
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    todaySalesCount: 0,
    estimatedProfit: 0,
    profitMargin: 0,
    allTimeRevenue: 0,
    allTimeProfit: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    activeProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await dashboardApi.getSummary();
        if (res.data) {
          setMetrics({
            todayRevenue: res.data.today?.revenue || 0,
            todaySalesCount: res.data.today?.salesCount || 0,
            estimatedProfit: res.data.today?.estimatedProfit || 0,
            profitMargin: res.data.today?.profitMargin || 0,
            allTimeRevenue: res.data.allTime?.totalRevenue || 0,
            allTimeProfit: res.data.allTime?.estimatedProfit || 0,
            totalInventoryValue: res.data.inventory?.totalValuation || 0,
            lowStockCount: res.data.inventory?.lowStockCount || 0,
            outOfStockCount: res.data.inventory?.outOfStockCount || 0,
            activeProducts: res.data.inventory?.totalProducts || 0
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard summary metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const totalUrgentAlerts = metrics.lowStockCount + metrics.outOfStockCount;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      margin: '20px 0'
    }}>
      {/* 1. Today's Revenue Card */}
      <div className="dashboard-card" style={{
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid #4f46e5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Today's Sales Revenue
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#eef2ff',
            color: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px'
          }}>
            💵
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          ₹{metrics.todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: '#059669', fontWeight: '600' }}>
            {metrics.todaySalesCount > 0 ? `✓ ${metrics.todaySalesCount} sales recorded` : 'Awaiting daily report'}
          </span>
          <span style={{ color: '#94a3b8' }}>
            All-time: ₹{Math.round(metrics.allTimeRevenue).toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2. Estimated Gross Profit Card */}
      <div className="dashboard-card" style={{
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid #10b981'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Estimated Gross Profit
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px'
          }}>
            📈
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#059669', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          ₹{metrics.estimatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{
            backgroundColor: '#ecfdf5',
            color: '#047857',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: '700'
          }}>
            {metrics.profitMargin}% Margin
          </span>
          <span style={{ color: '#64748b' }}>
            After inventory costs
          </span>
        </div>
      </div>

      {/* 3. Total Inventory Valuation Card */}
      <div className="dashboard-card" style={{
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid #0284c7'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Inventory Capital Value
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px'
          }}>
            📦
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          ₹{metrics.totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
          <span>{metrics.activeProducts} SKUs registered</span>
          <button
            onClick={() => navigate('/inventory')}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284c7',
              fontWeight: '700',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Ledger →
          </button>
        </div>
      </div>

      {/* 4. Restock Alerts Card */}
      <div className="dashboard-card" style={{
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${totalUrgentAlerts > 0 ? '#ef4444' : '#10b981'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Stock Health Status
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: totalUrgentAlerts > 0 ? '#fef2f2' : '#ecfdf5',
            color: totalUrgentAlerts > 0 ? '#dc2626' : '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px'
          }}>
            {totalUrgentAlerts > 0 ? '⚠️' : '🛡️'}
          </div>
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: '800',
          color: totalUrgentAlerts > 0 ? '#dc2626' : '#059669',
          letterSpacing: '-0.02em',
          marginBottom: '6px'
        }}>
          {totalUrgentAlerts > 0 ? `${totalUrgentAlerts} Needed` : 'Optimal'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: totalUrgentAlerts > 0 ? '#b91c1c' : '#15803d', fontWeight: '600' }}>
            {totalUrgentAlerts > 0 ? `${metrics.outOfStockCount} zero stock, ${metrics.lowStockCount} low` : 'All safe thresholds met'}
          </span>
          <button
            onClick={() => navigate('/recommendations')}
            style={{
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              fontWeight: '700',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Optimize →
          </button>
        </div>
      </div>
    </div>
  );
}
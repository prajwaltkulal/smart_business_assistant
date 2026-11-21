/**
 * Component: SalesChart
 * Purpose: Real database-backed Sales Revenue & Gross Profit Trends Graph with period filters and interactive tooltips
 * Owner: Member 2
 * Section: Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insightsApi } from '../../../api/insightsApi';

export default function SalesChart() {
  const [trends, setTrends] = useState([]);
  const [interval, setInterval] = useState('day');
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrends() {
      try {
        setLoading(true);
        const res = await insightsApi.getTrends(interval);
        setTrends(res.data || []);
      } catch (err) {
        console.error('Failed to load trends data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrends();
  }, [interval]);

  const chartData = trends;

  // Compute summary stats from real database data
  const totalRev = chartData.reduce((acc, curr) => acc + Number(curr.total_revenue || 0), 0);
  const totalProfit = chartData.reduce((acc, curr) => acc + Number(curr.gross_profit || 0), 0);
  const marginPct = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : 0;

  // SVG Chart Dimensions
  const width = 640;
  const height = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...chartData.map(d => Math.max(Number(d.total_revenue || 0), Number(d.gross_profit || 0))), 100) * 1.15;

  const getX = (index) => {
    if (chartData.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (chartData.length - 1)) * graphWidth;
  };

  const getY = (val) => {
    return padding.top + graphHeight - (val / maxVal) * graphHeight;
  };

  const revenuePoints = chartData.map((d, i) => `${getX(i)},${getY(Number(d.total_revenue || 0))}`).join(' ');
  const profitPoints = chartData.map((d, i) => `${getX(i)},${getY(Number(d.gross_profit || 0))}`).join(' ');

  const revenueArea = chartData.length > 0
    ? `${getX(0)},${padding.top + graphHeight} ${revenuePoints} ${getX(chartData.length - 1)},${padding.top + graphHeight}`
    : '';

  const profitArea = chartData.length > 0
    ? `${getX(0)},${padding.top + graphHeight} ${profitPoints} ${getX(chartData.length - 1)},${padding.top + graphHeight}`
    : '';

  return (
    <div className="dashboard-card col-span-8" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '800' }}>
              Sales & Gross Profit Analysis
            </h3>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#eef2ff',
              color: '#2563eb',
              fontWeight: '700'
            }}>
              Live Database Feed
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            Accurate revenue, product cost of goods (COGS), and gross profit margin
          </p>
        </div>

        {/* Period Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '3px', display: 'flex' }}>
            <button
              onClick={() => setInterval('day')}
              style={{
                border: 'none',
                background: interval === 'day' ? '#fff' : 'transparent',
                color: interval === 'day' ? '#2563eb' : '#64748b',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: interval === 'day' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Daily
            </button>
            <button
              onClick={() => setInterval('week')}
              style={{
                border: 'none',
                background: interval === 'week' ? '#fff' : 'transparent',
                color: interval === 'week' ? '#2563eb' : '#64748b',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: interval === 'week' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Weekly
            </button>
            <button
              onClick={() => setInterval('month')}
              style={{
                border: 'none',
                background: interval === 'month' ? '#fff' : 'transparent',
                color: interval === 'month' ? '#2563eb' : '#64748b',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: interval === 'month' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Row */}
      {chartData.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px 18px',
          marginBottom: '18px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>TOTAL PERIOD REVENUE</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>
              ₹{totalRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>TOTAL GROSS PROFIT</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
              ₹{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>GROSS MARGIN</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {marginPct}%
            </div>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          Loading real-time sales & profit analytics...
        </div>
      ) : chartData.length > 0 ? (
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const yVal = padding.top + graphHeight * (1 - pct);
              const label = Math.round(maxVal * pct);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={yVal}
                    x2={width - padding.right}
                    y2={yVal}
                    stroke="#e2e8f0"
                    strokeDasharray={pct === 0 ? '0' : '4 4'}
                  />
                  <text
                    x={padding.left - 10}
                    y={yVal + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#94a3b8"
                  >
                    ₹{label >= 1000 ? `${(label / 1000).toFixed(0)}k` : label}
                  </text>
                </g>
              );
            })}

            {/* Area Fills */}
            {chartData.length > 1 && (
              <>
                <polygon points={revenueArea} fill="url(#revenueGrad)" />
                <polygon points={profitArea} fill="url(#profitGrad)" />
              </>
            )}

            {/* Revenue Line */}
            {chartData.length > 1 && (
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={revenuePoints}
              />
            )}

            {/* Profit Line */}
            {chartData.length > 1 && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={profitPoints}
              />
            )}

            {/* Data Points with Hover */}
            {chartData.map((d, i) => {
              const cx = getX(i);
              const cyRev = getY(Number(d.total_revenue || 0));
              const cyProf = getY(Number(d.gross_profit || 0));
              return (
                <g key={i}>
                  {/* Revenue Point */}
                  <circle
                    cx={cx}
                    cy={cyRev}
                    r={hoveredPoint === i ? 6 : 4}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Profit Point */}
                  <circle
                    cx={cx}
                    cy={cyProf}
                    r={hoveredPoint === i ? 6 : 4}
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth="3"
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* X Axis Labels */}
                  <text
                    x={cx}
                    y={height - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#64748b"
                    fontWeight={hoveredPoint === i ? '700' : '400'}
                  >
                    {d.period ? d.period.slice(5) : `P${i + 1}`}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredPoint !== null && chartData[hoveredPoint] && (
            <div style={{
              position: 'absolute',
              top: '15px',
              left: `${Math.min(Math.max(getX(hoveredPoint) - 90, 10), width - 210)}px`,
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '170px'
            }}>
              <div style={{ fontWeight: '700', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '6px' }}>
                📅 Date: {chartData[hoveredPoint].period}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#93c5fd', margin: '2px 0' }}>
                <span>Sales Revenue:</span>
                <strong>₹{Number(chartData[hoveredPoint].total_revenue).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86efac', margin: '2px 0' }}>
                <span>Gross Profit:</span>
                <strong>₹{Number(chartData[hoveredPoint].gross_profit).toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', margin: '2px 0', fontSize: '11px' }}>
                <span>Orders:</span>
                <span>{chartData[hoveredPoint].order_count || 1} transactions</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2563eb' }} />
              <span>Gross Revenue (Actual Sales)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }} />
              <span>Gross Profit (After Inventory Costs)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Clean Database Empty State */
        <div style={{
          padding: '44px 20px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '10px',
          border: '1px dashed #cbd5e1'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>📊</div>
          <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '16px', fontWeight: '700' }}>
            No Sales Data in Database Yet
          </h4>
          <p style={{ margin: '0 auto 16px auto', color: '#64748b', fontSize: '13px', maxWidth: '420px' }}>
            Import your external billing register CSV report to automatically plot real revenue, COGS, and profit curves.
          </p>
          <button
            onClick={() => navigate('/reports-imports')}
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
            }}
          >
            📥 Import Daily Sales Report
          </button>
        </div>
      )}
    </div>
  );
}
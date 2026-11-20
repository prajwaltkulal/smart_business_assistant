/**
 * Page: InsightsPage
 * Purpose: Visual analytics for sales performance, daily/weekly/monthly trends, top sellers, and slow movers
 * Owner: Member 4
 * Section: Business Insights
 */

import React, { useState } from 'react';
import SalesTrends from './components/SalesTrends';
import TopSellers from './components/TopSellers';
import SlowMovers from './components/SlowMovers';
import Profitability from './components/Profitability';

export default function InsightsPage() {
  const [interval, setInterval] = useState('day'); // 'day', 'week', 'month'

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Business Insights & Trends</h2>
          <p>Analyze sales patterns, identify fast-moving products, and spot dead inventory.</p>
        </div>
        <div className="interval-toggle" style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${interval === 'day' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setInterval('day')}
          >
            Daily
          </button>
          <button
            className={`btn ${interval === 'week' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setInterval('week')}
          >
            Weekly
          </button>
          <button
            className={`btn ${interval === 'month' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setInterval('month')}
          >
            Monthly
          </button>
        </div>
      </div>

      <SalesTrends interval={interval} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <TopSellers />
        <SlowMovers />
      </div>

      <div style={{ marginTop: '20px' }}>
        <Profitability />
      </div>
    </div>
  );
}

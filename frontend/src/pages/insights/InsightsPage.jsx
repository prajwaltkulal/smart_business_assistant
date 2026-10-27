/**
 * Page: InsightsPage
 * Purpose: Business analytics, trends, product velocities, and profitability
 * Owner: Member 4
 * Section: Business Insights
 */

import React from 'react';
import SalesTrends from './components/SalesTrends';
import TopSellers from './components/TopSellers';
import SlowMovers from './components/SlowMovers';
import Profitability from './components/Profitability';

export default function InsightsPage() {
  return (
    <div className="page-container">
      <h2>Business Insights & Analytics</h2>
      <SalesTrends />
      <TopSellers />
      <SlowMovers />
      <Profitability />
    </div>
  );
}

/**
 * Page: DashboardPage
 * Purpose: Main action-oriented dashboard overview
 * Owner: Member 1
 * Section: Dashboard
 */

import React from 'react';
import SummaryCards from './components/SummaryCards';
import SalesChart from './components/SalesChart';
import StockAlerts from './components/StockAlerts';
import Recommendations from './components/Recommendations';
import TopProducts from './components/TopProducts';
import RecentActivity from './components/RecentActivity';
import SetupChecklist from './components/SetupChecklist';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h2>Business Dashboard</h2>
      <SetupChecklist />
      <SummaryCards />
      <div className="dashboard-grid">
        <SalesChart />
        <StockAlerts />
        <Recommendations />
        <TopProducts />
        <RecentActivity />
      </div>
    </div>
  );
}

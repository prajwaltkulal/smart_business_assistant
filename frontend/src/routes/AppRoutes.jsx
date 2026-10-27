/**
 * Central Route Configuration: AppRoutes
 * Purpose: Single central location for all route definitions and route guards.
 * NOTE TO TEAM: Only add one line per page route. Do not edit other routes.
 * Owner: Shared (Member 1 maintains)
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import BusinessSetupPage from '../pages/business-setup/BusinessSetupPage';
import InventoryOnboardingPage from '../pages/inventory-onboarding/InventoryOnboardingPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProductsPage from '../pages/products/ProductsPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import SalesBillingPage from '../pages/sales-billing/SalesBillingPage';
import ReportsImportsPage from '../pages/reports-imports/ReportsImportsPage';
import InsightsPage from '../pages/insights/InsightsPage';
import RecommendationsPage from '../pages/recommendations/RecommendationsPage';
import TeamPage from '../pages/team/TeamPage';
import SettingsPage from '../pages/settings/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Onboarding Routes */}
      <Route path="/setup/business" element={<BusinessSetupPage />} />
      <Route path="/setup/inventory" element={<InventoryOnboardingPage />} />

      {/* Protected App Routes inside Main Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sales-billing" element={<SalesBillingPage />} />
        <Route path="/reports-imports" element={<ReportsImportsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

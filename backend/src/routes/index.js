/**
 * Central API Router Index
 * Purpose: Single central location that mounts all feature module routers.
 * NOTE TO TEAM: Only add one line per feature router. Do not edit other routes.
 * Owner: Shared (Member 2 maintains)
 */

const express = require('express');
const router = express.Router();

// Import Feature Routers
const authRoutes = require('../modules/auth/auth.routes');
const businessRoutes = require('../modules/business/business.routes');
const onboardingRoutes = require('../modules/onboarding/onboarding.routes');
const productsRoutes = require('../modules/products/products.routes');
const inventoryRoutes = require('../modules/inventory/inventory.routes');
const salesRoutes = require('../modules/sales/sales.routes');
const importsRoutes = require('../modules/imports/imports.routes');
const insightsRoutes = require('../modules/insights/insights.routes');
const recommendationsRoutes = require('../modules/recommendations/recommendations.routes');
const teamRoutes = require('../modules/team/team.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const settingsRoutes = require('../modules/settings/settings.routes');

// Mount Feature Routers
router.use('/auth', authRoutes);
router.use('/business', businessRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/products', productsRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/sales', salesRoutes);
router.use('/imports', importsRoutes);
router.use('/insights', insightsRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/team', teamRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;

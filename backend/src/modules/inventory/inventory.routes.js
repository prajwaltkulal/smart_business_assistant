/**
 * Routes: inventory
 * Purpose: Express router for inventory operations, movements, manual additions/adjustments, and stock alerts
 * Owner: Member 1 (Prajwal)
 */

const express = require('express');
const router = express.Router();
const controller = require('./inventory.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

// Protect all inventory routes with JWT auth and multi-tenant business check
router.use(authMiddleware);
router.use(businessAccess());

router.get('/stock', controller.getStockLevels);
router.get('/movements', controller.getStockMovements);
router.get('/alerts', controller.getStockAlerts);
router.post('/adjust', controller.recordAdjustment);
router.post('/add', controller.recordAddition);

module.exports = router;

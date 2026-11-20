/**
 * Routes: inventory
 * Purpose: Express router for inventory operations, movements, manual additions/adjustments, and stock alerts
 * Owner: Member 3
 */

const express = require('express');
const router = express.Router();
const controller = require('./inventory.controller');

router.get('/stock', controller.getStockLevels);
router.get('/movements', controller.getStockMovements);
router.get('/alerts', controller.getStockAlerts);
router.post('/adjust', controller.recordAdjustment);
router.post('/add', controller.recordAddition);

module.exports = router;

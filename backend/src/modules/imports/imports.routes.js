/**
 * Routes: imports
 * Purpose: Express router for dual CSV imports (Initial Inventory & Daily Sales Reports)
 * Owner: Member 4
 */

const express = require('express');
const router = express.Router();
const controller = require('./imports.controller');

// Upload & Validate Preview
router.post('/preview/initial-inventory', controller.previewInitialInventory);
router.post('/preview/daily-sales', controller.previewDailySales);

// Confirm and Commit Import (Continuous inventory update & duplicate check)
router.post('/confirm/:importId', controller.confirmImport);

// Import History & Details
router.get('/history', controller.getImportHistory);
router.get('/:importId', controller.getImportDetails);

module.exports = router;

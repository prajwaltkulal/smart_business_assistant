/**
 * Routes: sales
 * Purpose: Express router for imported sales and daily sales summaries
 * Owner: Member 2
 */

const express = require('express');
const router = express.Router();
const controller = require('./sales.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

router.use(authMiddleware);
router.use(businessAccess());

router.get('/', controller.getSales);
router.get('/daily-summary', controller.getDailySummary);
router.get('/:id', controller.getSaleDetails);

module.exports = router;

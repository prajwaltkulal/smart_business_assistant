/**
 * Routes: sales
 * Purpose: Express router for imported sales and daily sales summaries (no POS checkout)
 * Owner: Member 2
 */

const express = require('express');
const router = express.Router();
const controller = require('./sales.controller');

router.get('/', controller.getSales);
router.get('/daily-summary', controller.getDailySummary);
router.get('/:id', controller.getSaleDetails);

module.exports = router;

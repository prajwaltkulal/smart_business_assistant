/**
 * Routes: insights
 * Purpose: Express router for sales trend analysis, top sellers, and slow movers
 * Owner: Member 4
 */

const express = require('express');
const router = express.Router();
const controller = require('./insights.controller');

router.get('/trends', controller.getSalesTrends);
router.get('/top-sellers', controller.getTopSellers);
router.get('/slow-movers', controller.getSlowMovers);

module.exports = router;

/**
 * Routes: dashboard
 * Purpose: Express router for business dashboard summaries and aggregated performance metrics
 * Owner: Member 3
 */

const express = require('express');
const router = express.Router();
const controller = require('./dashboard.controller');

router.get('/summary', controller.getSummary);

module.exports = router;

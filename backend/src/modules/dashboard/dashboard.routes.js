/**
 * Routes: dashboard
 * Purpose: Express router for business dashboard summaries and aggregated performance metrics
 * Owner: Member 2
 */

const express = require('express');
const router = express.Router();
const controller = require('./dashboard.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

router.use(authMiddleware);
router.use(businessAccess());

router.get('/summary', controller.getSummary);

module.exports = router;

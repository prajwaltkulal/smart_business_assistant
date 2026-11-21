/**
 * Routes: recommendations
 * Purpose: Express router for restocking recommendations and budget-aware purchase plans
 * Owner: Member 2
 */

const express = require('express');
const router = express.Router();
const controller = require('./recommendations.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

router.use(authMiddleware);
router.use(businessAccess());

router.post('/restock', controller.getRestockPlan);

module.exports = router;

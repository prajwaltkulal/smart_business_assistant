/**
 * Routes: recommendations
 * Purpose: Express router for restocking recommendations and budget-aware purchase plans
 * Owner: Member 4
 */

const express = require('express');
const router = express.Router();
const controller = require('./recommendations.controller');

router.post('/restock', controller.getRestockPlan);

module.exports = router;

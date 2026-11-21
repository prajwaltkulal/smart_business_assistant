/**
 * Routes: settings
 * Purpose: Express router for business and user account settings
 * Owner: Member 1 (Prajwal)
 */

const express = require('express');
const router = express.Router();
const controller = require('./settings.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

router.use(authMiddleware);
router.use(businessAccess());

router.get('/', controller.getSettings);
router.put('/', businessAccess('owner'), controller.updateSettings);

module.exports = router;

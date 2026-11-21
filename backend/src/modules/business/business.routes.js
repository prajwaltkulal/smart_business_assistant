/**
 * Routes: business
 * Purpose: Express router for creating and managing shop profiles
 * Owner: Member 2
 */

const express = require('express');
const router = express.Router();
const controller = require('./business.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

// Protected routes (Require JWT auth)
router.use(authMiddleware);

router.post('/', controller.create);
router.get('/:id', businessAccess(), controller.getById);
router.put('/:id', businessAccess('owner'), controller.update);

module.exports = router;

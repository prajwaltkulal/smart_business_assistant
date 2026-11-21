/**
 * Routes: auth
 * Purpose: Express router for user registration, login, and profile verification
 * Owner: Member 2
 */

const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authMiddleware, controller.me);

module.exports = router;

/**
 * Routes: products
 * Purpose: Express router for products CRUD, search, pagination, and categories
 * Owner: Member 1 (Prajwal)
 */

const express = require('express');
const router = express.Router();
const controller = require('./products.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

// All product routes require user to be logged in and part of the business
router.use(authMiddleware);
router.use(businessAccess());

// Routes
router.get('/', controller.getAll);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;

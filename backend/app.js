/**
 * Express Application Configuration
 * Purpose: Setup middlewares, central routes, and error handlers
 * Owner: Member 2
 */

const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler.middleware');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount Central API Routes
app.use('/api', routes);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

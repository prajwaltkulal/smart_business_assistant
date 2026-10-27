/**
 * Environment Variables Configuration
 * Purpose: Load and validate environment variables
 * Owner: Member 2
 */

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

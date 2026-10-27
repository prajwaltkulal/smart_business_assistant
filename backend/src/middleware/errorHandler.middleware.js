/**
 * Global Error Handler Middleware
 * Purpose: Catch and format application errors uniformly
 * Owner: Member 2
 */

module.exports = function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err.message || err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status
    }
  });
};

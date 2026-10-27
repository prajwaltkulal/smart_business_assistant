/**
 * Auth Middleware
 * Purpose: Verify JWT token and attach user to request object
 * Owner: Member 2
 */

module.exports = function authMiddleware(req, res, next) {
  // TODO: Validate JWT token from Authorization header
  next();
};

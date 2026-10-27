/**
 * Business Access Middleware
 * Purpose: Ensure authenticated user has permissions for the specified business
 * Owner: Member 2
 */

module.exports = function businessAccessMiddleware(req, res, next) {
  // TODO: Verify user has active membership in the business
  next();
};

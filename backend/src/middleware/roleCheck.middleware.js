/**
 * Role Check Middleware
 * Purpose: Verify user role (e.g. owner, manager, employee) for protected actions
 * Owner: Member 2
 */

module.exports = function roleCheckMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    // TODO: Verify user role against allowedRoles
    next();
  };
};

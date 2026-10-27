/**
 * Custom Error Classes
 * Purpose: Define standard AppError, NotFoundError, UnauthorizedError, ValidationError
 * Owner: Member 2
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {
  AppError
};

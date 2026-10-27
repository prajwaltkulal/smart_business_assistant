/**
 * Logger Utility
 * Purpose: Formatted application and error logging
 * Owner: Member 2
 */

module.exports = {
  info: (msg, meta = {}) => console.log(`[INFO] ${msg}`, meta),
  warn: (msg, meta = {}) => console.warn(`[WARN] ${msg}`, meta),
  error: (msg, meta = {}) => console.error(`[ERROR] ${msg}`, meta)
};

/**
 * Business Access Middleware
 * Purpose: Ensure authenticated user is an active member of the specified business and attach their role
 * Owner: Member 2
 */

const db = require('../config/db');

module.exports = function businessAccessMiddleware(requiredRole = null) {
  return async (req, res, next) => {
    try {
      const businessId = req.headers['x-business-id'] || req.params.businessId || req.body.businessId || req.query.businessId;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      if (!businessId) {
        return res.status(400).json({ success: false, message: 'businessId is required (as header X-Business-Id or parameter).' });
      }

      const query = `
        SELECT bm.role, bm.permissions, b.id as business_id, b.name as business_name, b.operating_mode
        FROM business_members bm
        JOIN businesses b ON bm.business_id = b.id
        WHERE bm.business_id = $1 AND bm.user_id = $2 AND bm.is_active = TRUE AND b.is_active = TRUE
        LIMIT 1;
      `;
      const result = await db.query(query, [businessId, userId]);

      if (!result.rows || result.rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Access denied: You are not an active member of this business.' });
      }

      const membership = result.rows[0];
      req.businessMembership = membership; // { business_id, role, permissions, business_name, operating_mode }

      // Check role constraint if specified
      if (requiredRole && membership.role !== requiredRole && membership.role !== 'owner') {
        return res.status(403).json({ success: false, message: `Access denied: Requires '${requiredRole}' role.` });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

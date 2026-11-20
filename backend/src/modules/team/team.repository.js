/**
 * Repository: team
 * Purpose: Database access methods for business members and role permissions
 * Owner: Member 2
 */

const db = require('../../config/db');

module.exports = {
  getMembers: async (businessId) => {
    const query = `
      SELECT bm.id, bm.role, bm.permissions, bm.created_at,
             u.id as user_id, u.name, u.email
      FROM business_members bm
      JOIN users u ON bm.user_id = u.id
      WHERE bm.business_id = $1
      ORDER BY bm.id ASC;
    `;
    const res = await db.query(query, [businessId]);
    return res.rows || [];
  },

  createMember: async ({ businessId, email, role, permissions }) => {
    // Check if user exists
    let userQuery = `SELECT id FROM users WHERE email = $1;`;
    let userRes = await db.query(userQuery, [email]);
    let userId = userRes.rows?.[0]?.id;

    if (!userId) {
      const insertUser = `
        INSERT INTO users (email, name, password_hash)
        VALUES ($1, split_part($1, '@', 1), 'invited_placeholder')
        RETURNING id;
      `;
      const newUserRes = await db.query(insertUser, [email]);
      userId = newUserRes.rows?.[0]?.id || 1;
    }

    const memberQuery = `
      INSERT INTO business_members (business_id, user_id, role, permissions)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (business_id, user_id) DO UPDATE
      SET role = EXCLUDED.role, permissions = EXCLUDED.permissions
      RETURNING *;
    `;
    const memberRes = await db.query(memberQuery, [
      businessId,
      userId,
      role,
      JSON.stringify(permissions)
    ]);
    return memberRes.rows?.[0];
  },

  deleteMember: async (memberId) => {
    const query = `DELETE FROM business_members WHERE id = $1 RETURNING id;`;
    const res = await db.query(query, [memberId]);
    return { success: true, deletedId: memberId };
  }
};

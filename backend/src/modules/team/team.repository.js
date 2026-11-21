/**
 * Repository: team
 * Purpose: Database access methods for business members and role permissions
 * Owner: Member 1 (Prajwal)
 */

const db = require('../../config/db');

module.exports = {
  getMembers: async (businessId) => {
    const query = `
      SELECT bm.id, bm.role, bm.permissions, bm.created_at,
             u.id as user_id, u.name, u.email
      FROM business_members bm
      JOIN users u ON bm.user_id = u.id
      WHERE bm.business_id = $1 AND bm.is_active = TRUE
      ORDER BY bm.id ASC;
    `;
    const res = await db.query(query, [businessId]);
    return res.rows || [];
  },

  createMember: async ({ businessId, email, role, permissions }) => {
    const cleanEmail = email.toLowerCase().trim();
    // 1. Check if user exists
    let userQuery = `SELECT id FROM users WHERE email = $1;`;
    let userRes = await db.query(userQuery, [cleanEmail]);
    let userId = userRes.rows?.[0]?.id;

    if (!userId) {
      const username = cleanEmail.split('@')[0];
      const insertUser = `
        INSERT INTO users (email, name, password_hash)
        VALUES ($1, $2, 'invited_placeholder')
        RETURNING id;
      `;
      const newUserRes = await db.query(insertUser, [cleanEmail, username]);
      userId = newUserRes.rows?.[0]?.id;
    }

    // 2. Insert or update membership
    const memberQuery = `
      INSERT INTO business_members (business_id, user_id, role, permissions)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (business_id, user_id) DO UPDATE
      SET role = EXCLUDED.role, permissions = EXCLUDED.permissions, is_active = TRUE
      RETURNING *;
    `;
    const memberRes = await db.query(memberQuery, [
      businessId,
      userId,
      role || 'employee',
      JSON.stringify(permissions || {})
    ]);
    return memberRes.rows?.[0];
  },

  deleteMember: async (memberId) => {
    const query = `
      UPDATE business_members
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id;
    `;
    const res = await db.query(query, [memberId]);
    return { success: true, message: 'Member removed successfully.', deletedId: memberId };
  }
};

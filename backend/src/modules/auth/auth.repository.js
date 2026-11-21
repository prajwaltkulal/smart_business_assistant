/**
 * Repository: auth
 * Purpose: Database access methods for user accounts and credentials
 * Owner: Member 2
 */

const db = require('../../config/db');

module.exports = {
  findByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1 LIMIT 1;`;
    const res = await db.query(query, [email.toLowerCase().trim()]);
    return res.rows?.[0] || null;
  },

  findById: async (id) => {
    const query = `SELECT id, name, email, phone, is_active, created_at FROM users WHERE id = $1 LIMIT 1;`;
    const res = await db.query(query, [id]);
    return res.rows?.[0] || null;
  },

  createUser: async ({ name, email, passwordHash, phone }) => {
    const query = `
      INSERT INTO users (name, email, password_hash, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, phone, is_active, created_at;
    `;
    const res = await db.query(query, [name.trim(), email.toLowerCase().trim(), passwordHash, phone || null]);
    return res.rows[0];
  },

  getUserBusinesses: async (userId) => {
    const query = `
      SELECT b.id, b.name, b.category, b.operating_mode, b.currency, bm.role, bm.permissions
      FROM businesses b
      JOIN business_members bm ON b.id = bm.business_id
      WHERE bm.user_id = $1 AND bm.is_active = TRUE AND b.is_active = TRUE
      ORDER BY b.created_at ASC;
    `;
    const res = await db.query(query, [userId]);
    return res.rows || [];
  }
};

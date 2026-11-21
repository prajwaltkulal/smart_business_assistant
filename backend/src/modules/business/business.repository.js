/**
 * Repository: business
 * Purpose: Database access methods for business profiles and memberships
 * Owner: Member 2
 */

const db = require('../../config/db');

module.exports = {
  createBusinessWithMembership: async ({ name, category, operatingMode, currency, address, phone, email, ownerId }) => {
    // 1. Create Business
    const businessQuery = `
      INSERT INTO businesses (name, category, operating_mode, currency, address, phone, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const bRes = await db.query(businessQuery, [
      name.trim(),
      category || 'Retail',
      operatingMode || 'owner_managed',
      currency || 'INR',
      address || null,
      phone || null,
      email || null
    ]);
    const business = bRes.rows[0];

    // 2. Link User as Owner in business_members
    const memberQuery = `
      INSERT INTO business_members (business_id, user_id, role, permissions)
      VALUES ($1, $2, 'owner', '{"all": true}')
      RETURNING *;
    `;
    const mRes = await db.query(memberQuery, [business.id, ownerId]);

    // 3. Log initial activity
    const activityQuery = `
      INSERT INTO activity_log (business_id, user_id, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'CREATE_BUSINESS', 'business', $1, $3);
    `;
    await db.query(activityQuery, [
      business.id,
      ownerId,
      JSON.stringify({ name: business.name, operatingMode: business.operating_mode })
    ]);

    return {
      business,
      membership: mRes.rows[0]
    };
  },

  findById: async (id) => {
    const query = `SELECT * FROM businesses WHERE id = $1 AND is_active = TRUE;`;
    const res = await db.query(query, [id]);
    return res.rows?.[0] || null;
  },

  updateBusiness: async (id, fields) => {
    const { name, category, operatingMode, currency, address, phone, email, settings } = fields;
    const query = `
      UPDATE businesses
      SET name = COALESCE($2, name),
          category = COALESCE($3, category),
          operating_mode = COALESCE($4, operating_mode),
          currency = COALESCE($5, currency),
          address = COALESCE($6, address),
          phone = COALESCE($7, phone),
          email = COALESCE($8, email),
          settings = COALESCE($9, settings),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND is_active = TRUE
      RETURNING *;
    `;
    const res = await db.query(query, [id, name, category, operatingMode, currency, address, phone, email, settings ? JSON.stringify(settings) : null]);
    return res.rows?.[0] || null;
  }
};

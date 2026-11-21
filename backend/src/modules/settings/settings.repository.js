/**
 * Repository: settings
 * Purpose: Database access methods for shop profile, operating mode, and business settings
 * Owner: Member 1 (Prajwal)
 */

const db = require('../../config/db');

module.exports = {
  getSettings: async (businessId) => {
    const query = `
      SELECT id, name, category, operating_mode, currency, address, phone, email, settings, updated_at
      FROM businesses 
      WHERE id = $1 AND is_active = TRUE;
    `;
    const res = await db.query(query, [businessId]);
    return res.rows?.[0] || null;
  },

  updateSettings: async (businessId, fields) => {
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
      RETURNING id, name, category, operating_mode, currency, address, phone, email, settings, updated_at;
    `;
    const res = await db.query(query, [
      businessId,
      name ? name.trim() : null,
      category ? category.trim() : null,
      operatingMode || null,
      currency || null,
      address !== undefined ? address : null,
      phone !== undefined ? phone : null,
      email !== undefined ? email : null,
      settings ? JSON.stringify(settings) : null
    ]);
    return res.rows?.[0] || null;
  }
};

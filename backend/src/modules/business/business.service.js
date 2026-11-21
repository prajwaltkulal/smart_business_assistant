/**
 * Service: business
 * Purpose: Business logic for creating and updating shop profiles
 * Owner: Member 2
 */

const repository = require('./business.repository');

module.exports = {
  createBusiness: async ({ name, category, operatingMode, currency, address, phone, email, ownerId }) => {
    if (!name || name.trim() === '') {
      throw new Error('Business name is required.');
    }

    const validModes = ['owner_managed', 'owner_supervised'];
    const mode = validModes.includes(operatingMode) ? operatingMode : 'owner_managed';

    return await repository.createBusinessWithMembership({
      name,
      category,
      operatingMode: mode,
      currency: currency || 'INR',
      address,
      phone,
      email,
      ownerId
    });
  },

  getBusinessById: async (id) => {
    const business = await repository.findById(id);
    if (!business) {
      throw new Error('Business not found.');
    }
    return business;
  },

  updateBusiness: async (id, fields) => {
    const updated = await repository.updateBusiness(id, fields);
    if (!updated) {
      throw new Error('Business not found or update failed.');
    }
    return updated;
  }
};

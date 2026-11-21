/**
 * Service: settings
 * Purpose: Business logic for retrieving and updating shop settings and operating modes
 * Owner: Member 1 (Prajwal)
 */

const repository = require('./settings.repository');

module.exports = {
  getSettings: async (businessId) => {
    const settings = await repository.getSettings(businessId);
    if (!settings) throw new Error('Business settings not found.');
    return settings;
  },

  updateSettings: async (businessId, fields) => {
    if (fields.operatingMode) {
      const validModes = ['owner_managed', 'owner_supervised'];
      if (!validModes.includes(fields.operatingMode)) {
        throw new Error("Invalid operating mode. Must be 'owner_managed' or 'owner_supervised'.");
      }
    }
    const updated = await repository.updateSettings(businessId, fields);
    if (!updated) throw new Error('Failed to update business settings.');
    return updated;
  }
};

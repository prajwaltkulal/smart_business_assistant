/**
 * Service: team
 * Purpose: Business logic for simplified team management and role enforcement
 * Owner: Member 2
 */

const repository = require('./team.repository');

module.exports = {
  getTeamMembers: async (businessId) => {
    return await repository.getMembers(businessId);
  },

  inviteMember: async ({ businessId, email, role = 'employee', permissions = {} }) => {
    if (!email) throw new Error('Employee email is required');
    return await repository.createMember({ businessId, email, role, permissions });
  },

  removeMember: async (memberId) => {
    return await repository.deleteMember(memberId);
  }
};

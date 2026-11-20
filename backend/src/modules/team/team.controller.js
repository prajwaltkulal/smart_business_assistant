/**
 * Controller: team
 * Purpose: Handle requests for simplified team management and roles
 * Owner: Member 2
 */

const service = require('./team.service');

module.exports = {
  getTeamMembers: async (req, res, next) => {
    try {
      const { businessId } = req.query;
      const members = await service.getTeamMembers(businessId);
      res.json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  },

  inviteMember: async (req, res, next) => {
    try {
      const { businessId, email, role, permissions } = req.body;
      const result = await service.inviteMember({ businessId, email, role, permissions });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  removeMember: async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const result = await service.removeMember(memberId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
};

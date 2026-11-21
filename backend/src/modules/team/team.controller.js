/**
 * Controller: team
 * Purpose: Handle requests for simplified team management and roles
 * Owner: Member 1 (Prajwal)
 */

const service = require('./team.service');

module.exports = {
  getTeamMembers: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.query.businessId;
      const members = await service.getTeamMembers(businessId);
      res.json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  },

  inviteMember: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.body.businessId;
      const { email, role, permissions } = req.body;
      const result = await service.inviteMember({ businessId, email, role, permissions });
      res.status(201).json({ success: true, message: 'Team member invited successfully', data: result });
    } catch (err) {
      next(err);
    }
  },

  removeMember: async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const result = await service.removeMember(memberId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

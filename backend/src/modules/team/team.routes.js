/**
 * Routes: team
 * Purpose: Express router for team members and role-based permissions
 * Owner: Member 1 (Prajwal)
 */

const express = require('express');
const router = express.Router();
const controller = require('./team.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const businessAccess = require('../../middleware/businessAccess.middleware');

router.use(authMiddleware);
router.use(businessAccess());

router.get('/members', controller.getTeamMembers);
router.post('/invite', businessAccess('owner'), controller.inviteMember);
router.delete('/:memberId', businessAccess('owner'), controller.removeMember);

module.exports = router;

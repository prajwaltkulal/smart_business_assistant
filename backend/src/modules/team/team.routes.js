/**
 * Routes: team
 * Purpose: Express router for team members and role-based permissions
 * Owner: Member 2
 */

const express = require('express');
const router = express.Router();
const controller = require('./team.controller');

router.get('/members', controller.getTeamMembers);
router.post('/invite', controller.inviteMember);
router.delete('/:memberId', controller.removeMember);

module.exports = router;

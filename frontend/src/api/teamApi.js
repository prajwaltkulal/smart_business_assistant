/**
 * API Client: teamApi
 * Purpose: Frontend HTTP methods for team employee listing, invitations, and permissions
 * Owner: Member 1 (Prajwal)
 */

import { apiRequest } from './apiClient';

export const teamApi = {
  getMembers: () => {
    return apiRequest('/team/members');
  },

  inviteMember: (inviteData) => {
    return apiRequest('/team/invite', {
      method: 'POST',
      body: JSON.stringify(inviteData)
    });
  },

  removeMember: (memberId) => {
    return apiRequest(`/team/${memberId}`, {
      method: 'DELETE'
    });
  }
};

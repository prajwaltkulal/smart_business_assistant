/**
 * Page: TeamPage
 * Purpose: Employee roles, permissions, staff invitation, and access controls (Owner-Supervised Mode)
 * Owner: Member 1 (Prajwal)
 * Section: Team Management
 */

import React, { useState, useEffect } from 'react';
import EmployeeList from './components/EmployeeList';
import InviteEmployee from './components/InviteEmployee';
import { teamApi } from '../../api/teamApi';

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getMembers();
      setMembers(res.data || []);
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInvite = async (inviteData) => {
    await teamApi.inviteMember(inviteData);
    setNotification('Staff member invitation sent successfully!');
    fetchMembers();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemove = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await teamApi.removeMember(memberId);
        setNotification('Staff member removed.');
        fetchMembers();
        setTimeout(() => setNotification(null), 3000);
      } catch (err) {
        alert(err.message || 'Failed to remove member.');
      }
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1a202c' }}>Team Management & Access Control</h2>
          <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
            Control user permissions, invite staff or managers, and protect financial business data.
          </p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          style={{
            backgroundColor: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          + Invite Staff Member
        </button>
      </div>

      {notification && (
        <div style={{
          backgroundColor: '#c6f6d5',
          color: '#22543d',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontWeight: '500'
        }}>
          {notification}
        </div>
      )}

      <EmployeeList
        members={members}
        loading={loading}
        onRemove={handleRemove}
      />

      <InviteEmployee
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}

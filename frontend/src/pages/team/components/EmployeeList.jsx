/**
 * Component: EmployeeList
 * Purpose: Display table of registered shop staff, their roles, permissions, and remove options
 * Owner: Member 1 (Prajwal)
 * Section: Team Management
 */

import React from 'react';

export default function EmployeeList({ members, loading, onRemove }) {
  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#2d3748' }}>Active Team Members & Role Assignments</h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
              <th style={{ padding: '12px 8px' }}>Name / User</th>
              <th style={{ padding: '12px 8px' }}>Email</th>
              <th style={{ padding: '12px 8px' }}>Role</th>
              <th style={{ padding: '12px 8px' }}>Permissions</th>
              <th style={{ padding: '12px 8px' }}>Joined Date</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '28px', color: '#718096' }}>
                  Loading team members...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '28px', color: '#718096' }}>
                  No additional staff members. Click "Invite Staff Member" to add cashiers or managers.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 8px' }}><strong>{m.name || 'Invited User'}</strong></td>
                  <td style={{ padding: '12px 8px', color: '#4a5568' }}>{m.email}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      background: m.role === 'owner' ? '#ebf8ff' : m.role === 'manager' ? '#f0fff4' : '#edf2f7',
                      color: m.role === 'owner' ? '#2b6cb0' : m.role === 'manager' ? '#276749' : '#4a5568',
                      padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize'
                    }}>
                      {m.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '12px', color: '#718096' }}>
                    {m.role === 'owner' ? 'Full Administrator Access' : m.role === 'manager' ? 'Stock Adjustments & Products' : 'Sales Import & Stock View'}
                  </td>
                  <td style={{ padding: '12px 8px', color: '#718096' }}>
                    {m.created_at ? new Date(m.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    {m.role !== 'owner' ? (
                      <button
                        onClick={() => onRemove(m.id)}
                        style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Remove
                      </button>
                    ) : (
                      <span style={{ color: '#a0aec0', fontSize: '12px' }}>Primary Owner</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

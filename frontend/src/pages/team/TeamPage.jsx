/**
 * Page: TeamPage
 * Purpose: Employee roles, permissions, invitation, and activity auditing (Owner-Supervised)
 * Owner: Member 2
 * Section: Team Management
 */

import React from 'react';
import EmployeeList from './components/EmployeeList';
import InviteEmployee from './components/InviteEmployee';
import RolePermissions from './components/RolePermissions';
import ActivityHistory from './components/ActivityHistory';

export default function TeamPage() {
  return (
    <div className="page-container">
      <h2>Team Management & Supervised Operations</h2>
      <InviteEmployee />
      <EmployeeList />
      <RolePermissions />
      <ActivityHistory />
    </div>
  );
}

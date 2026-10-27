/**
 * Page: SettingsPage
 * Purpose: Business configuration and user account settings
 * Owner: Member 2
 * Section: Settings
 */

import React from 'react';
import BusinessSettings from './components/BusinessSettings';
import AccountSettings from './components/AccountSettings';

export default function SettingsPage() {
  return (
    <div className="page-container">
      <h2>Settings</h2>
      <BusinessSettings />
      <AccountSettings />
    </div>
  );
}

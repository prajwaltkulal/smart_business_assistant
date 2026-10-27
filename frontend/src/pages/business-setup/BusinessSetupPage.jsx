/**
 * Page: BusinessSetupPage
 * Purpose: Business profile creation and onboarding initiation
 * Owner: Member 1
 * Section: Business Setup
 */

import React from 'react';
import BusinessProfile from './components/BusinessProfile';
import InventorySize from './components/InventorySize';
import OperatingMode from './components/OperatingMode';

export default function BusinessSetupPage() {
  return (
    <div className="page-container">
      <h2>Business Profile Setup</h2>
      <BusinessProfile />
      <InventorySize />
      <OperatingMode />
    </div>
  );
}

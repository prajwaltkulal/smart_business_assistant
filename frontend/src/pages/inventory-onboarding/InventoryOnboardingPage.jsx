/**
 * Page: InventoryOnboardingPage
 * Purpose: Smart Inventory Onboarding flow recommending manual vs CSV entry
 * Owner: Member 1
 * Section: Smart Inventory Onboarding
 */

import React from 'react';
import MethodRecommendation from './components/MethodRecommendation';
import ManualEntry from './components/ManualEntry';
import CsvUpload from './components/CsvUpload';
import ImportPreview from './components/ImportPreview';
import SkipSetup from './components/SkipSetup';

export default function InventoryOnboardingPage() {
  return (
    <div className="page-container">
      <h2>Smart Inventory Onboarding</h2>
      <MethodRecommendation />
      <ManualEntry />
      <CsvUpload />
      <ImportPreview />
      <SkipSetup />
    </div>
  );
}

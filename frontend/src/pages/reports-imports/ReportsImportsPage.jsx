/**
 * Page: ReportsImportsPage
 * Purpose: Audit history of uploaded reports, failed rows, templates, and export tools
 * Owner: Member 4
 * Section: Reports & Imports
 */

import React from 'react';
import ImportHistory from './components/ImportHistory';
import FailedRows from './components/FailedRows';
import Templates from './components/Templates';
import Exports from './components/Exports';

export default function ReportsImportsPage() {
  return (
    <div className="page-container">
      <h2>Reports & Imports Center</h2>
      <Templates />
      <ImportHistory />
      <FailedRows />
      <Exports />
    </div>
  );
}

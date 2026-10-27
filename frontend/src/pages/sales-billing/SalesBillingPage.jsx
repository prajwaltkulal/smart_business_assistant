/**
 * Page: SalesBillingPage
 * Purpose: Sales transaction management (manual counter billing and report upload)
 * Owner: Member 2 & Member 4
 * Section: Sales & Billing
 */

import React from 'react';
import NewSale from './components/NewSale';
import TransactionHistory from './components/TransactionHistory';
import ReportUpload from './components/ReportUpload';
import ColumnMapping from './components/ColumnMapping';
import ImportPreview from './components/ImportPreview';

export default function SalesBillingPage() {
  return (
    <div className="page-container">
      <h2>Sales & Billing</h2>
      <NewSale />
      <ReportUpload />
      <ColumnMapping />
      <ImportPreview />
      <TransactionHistory />
    </div>
  );
}

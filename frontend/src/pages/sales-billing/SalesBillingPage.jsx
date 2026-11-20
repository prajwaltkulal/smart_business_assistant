/**
 * Page: SalesBillingPage (Sales Reports)
 * Purpose: Display imported daily sales records, transactions, and daily summaries
 * Note: POS checkout removed as billing is performed using external billing software.
 * Owner: Member 2
 * Section: Sales Reports
 */

import React from 'react';
import TransactionHistory from './components/TransactionHistory';

export default function SalesBillingPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Sales Reports & Transactions</h2>
        <p>View imported sales records, transactions, and daily summaries from external billing software.</p>
      </div>
      <TransactionHistory />
    </div>
  );
}

/**
 * Page: InventoryPage
 * Purpose: Inventory tracking, adjustments, incoming stock, and reconciliation
 * Owner: Member 3
 * Section: Inventory Management
 */

import React from 'react';
import StockOverview from './components/StockOverview';
import StockMovements from './components/StockMovements';
import AdjustmentForm from './components/AdjustmentForm';
import PurchaseForm from './components/PurchaseForm';
import Reconciliation from './components/Reconciliation';

export default function InventoryPage() {
  return (
    <div className="page-container">
      <h2>Inventory Management</h2>
      <StockOverview />
      <AdjustmentForm />
      <PurchaseForm />
      <Reconciliation />
      <StockMovements />
    </div>
  );
}

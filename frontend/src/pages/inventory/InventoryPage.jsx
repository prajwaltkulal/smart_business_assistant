/**
 * Page: InventoryPage
 * Purpose: Real-time stock levels, inventory valuation, stock adjustments, supplier stock arrivals, and movement audit history
 * Owner: Member 1 (Prajwal)
 * Section: Inventory Management
 */

import React, { useState, useEffect } from 'react';
import StockOverview from './components/StockOverview';
import StockMovements from './components/StockMovements';
import AdjustmentForm from './components/AdjustmentForm';
import PurchaseForm from './components/PurchaseForm';
import { inventoryApi } from '../../api/inventoryApi';
import { productsApi } from '../../api/productsApi';

export default function InventoryPage() {
  const [stockItems, setStockItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getStock({ search, status: statusFilter });
      setStockItems(res.data || []);
    } catch (err) {
      console.error('Failed to load stock levels:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async () => {
    try {
      setMovementsLoading(true);
      const res = await inventoryApi.getMovements({ limit: 50 });
      setMovements(res.movements || []);
    } catch (err) {
      console.error('Failed to load movements:', err);
    } finally {
      setMovementsLoading(false);
    }
  };

  const fetchProductsList = async () => {
    try {
      const res = await productsApi.getAll({ limit: 200 });
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products for dropdowns:', err);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [search, statusFilter]);

  useEffect(() => {
    fetchMovements();
    fetchProductsList();
  }, []);

  const handleRecordAdjustment = async (adjustmentData) => {
    await inventoryApi.recordAdjustment(adjustmentData);
    setNotification('Stock adjustment recorded and continuous ledger updated!');
    fetchStock();
    fetchMovements();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRecordPurchase = async (purchaseData) => {
    await inventoryApi.recordAddition(purchaseData);
    setNotification('Supplier stock arrival recorded and added to inventory!');
    fetchStock();
    fetchMovements();
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#1a202c' }}>Inventory Management & Continuous Stock Ledger</h2>
        <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
          Real-time stock availability, inventory valuation, stock adjustments, and full audit movements.
        </p>
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

      {/* Stock Levels Overview Table */}
      <StockOverview
        stockItems={stockItems}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenAdjustModal={() => setIsAdjustModalOpen(true)}
        onOpenPurchaseModal={() => setIsPurchaseModalOpen(true)}
      />

      {/* Continuous Audit Ledger Table */}
      <StockMovements
        movements={movements}
        loading={movementsLoading}
        onRefresh={fetchMovements}
      />

      {/* Adjustment Modal */}
      <AdjustmentForm
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSave={handleRecordAdjustment}
        products={products}
      />

      {/* Supplier Stock Arrival Modal */}
      <PurchaseForm
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSave={handleRecordPurchase}
        products={products}
      />
    </div>
  );
}

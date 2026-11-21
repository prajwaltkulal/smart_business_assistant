/**
 * Page: ReportsImportsPage
 * Purpose: Two separate import workflows: (1) Daily Sales Report Import & (2) Initial Inventory Import
 * Integrates live client-side CSV parsing, SHA-256 fingerprinting, backend preview, and atomic confirmation.
 * Owner: Member 2
 * Section: Reports & Imports
 */

import React, { useState } from 'react';
import ImportHistory from './components/ImportHistory';
import Templates from './components/Templates';
import FailedRows from './components/FailedRows';
import { importsApi } from '../../api/importsApi';

// Simple CSV text line parser
function parseCsvText(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx];
      });
      rows.push(row);
    }
  }
  return rows;
}

export default function ReportsImportsPage() {
  const [activeTab, setActiveTab] = useState('daily-sales'); // 'daily-sales' or 'initial-inventory'

  const [file, setFile] = useState(null);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [importStatus, setImportStatus] = useState(null);

  const activeBusinessId = localStorage.getItem('active_business_id');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreviewData(null);
      setErrorMsg(null);
      setImportStatus(null);
    }
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const rows = parseCsvText(text);

        if (rows.length === 0) {
          throw new Error('CSV file contains no valid data rows or format is invalid.');
        }

        let res;
        if (activeTab === 'initial-inventory') {
          res = await importsApi.previewInitialInventory({
            businessId: activeBusinessId ? Number(activeBusinessId) : undefined,
            fileName: file.name,
            rows: rows.map(r => ({
              name: r.product_name || r.name || r['product name'] || r.product,
              sku: r.sku || r.product_sku || r['sku code'] || r.barcode,
              category: r.category || 'General',
              cost_price: r.purchase_cost || r.cost_price || r['purchase cost'] || r.cost,
              selling_price: r.selling_price || r.price,
              opening_stock: r.current_stock || r.opening_stock || r.quantity || r.stock,
              min_stock_level: r.min_stock_level || 5,
              unit: r.unit || 'pcs'
            }))
          });
        } else {
          res = await importsApi.previewDailySales({
            businessId: activeBusinessId ? Number(activeBusinessId) : undefined,
            fileName: file.name,
            reportDate,
            rows: rows.map(r => ({
              invoice_number: r.bill_id || r.invoice_number || r['bill id'] || r.invoice || r.bill_no,
              sku: r.product_sku || r.sku || r['sku code'] || r.barcode,
              product_name: r.product_name || r['product name'] || r.name,
              quantity: r.quantity || r['quantity sold'] || r.qty,
              selling_price: r.selling_price || r.price,
              discount: r.discount || 0
            }))
          });
        }

        setPreviewData(res.data);
      } catch (err) {
        setErrorMsg(err.message || 'Validation error while parsing CSV file.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirm = async () => {
    if (!previewData?.importId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await importsApi.confirmImport(previewData.importId);
      setImportStatus(
        activeTab === 'daily-sales'
          ? 'Daily Sales Report processed! Inventory stock has been continuously deducted and sales recorded.'
          : 'Initial Inventory import confirmed! Products catalog and baseline stock levels have been saved.'
      );
      setPreviewData(null);
      setFile(null);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to confirm import.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>CSV Reports & Imports Center</h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
          Import your initial product catalog or daily sales reports from external billing software.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0' }}>
        <button
          style={{
            padding: '12px 24px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'daily-sales' ? '3px solid #2563eb' : 'none',
            background: 'none',
            fontWeight: activeTab === 'daily-sales' ? 'bold' : 'normal',
            color: activeTab === 'daily-sales' ? '#2563eb' : '#64748b',
            fontSize: '15px'
          }}
          onClick={() => { setActiveTab('daily-sales'); setPreviewData(null); setErrorMsg(null); setImportStatus(null); }}
        >
          Daily Sales Report Import
        </button>
        <button
          style={{
            padding: '12px 24px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'initial-inventory' ? '3px solid #2563eb' : 'none',
            background: 'none',
            fontWeight: activeTab === 'initial-inventory' ? 'bold' : 'normal',
            color: activeTab === 'initial-inventory' ? '#2563eb' : '#64748b',
            fontSize: '15px'
          }}
          onClick={() => { setActiveTab('initial-inventory'); setPreviewData(null); setErrorMsg(null); setImportStatus(null); }}
        >
          Initial Inventory CSV Import
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {importStatus && (
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontWeight: 'bold' }}>
          ✓ {importStatus}
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
          {activeTab === 'daily-sales' ? 'Upload Daily Sales CSV Report' : 'Upload Initial Inventory CSV File'}
        </h3>
        <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
          {activeTab === 'daily-sales'
            ? 'Processes transactions exported from your billing machine, auto-deducts stock continuously, and checks for duplicate reports.'
            : 'Populates your master product catalog with purchase costs, selling prices, minimum stock thresholds, and initial opening stock.'}
        </p>

        {activeTab === 'daily-sales' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>Sales Business Date:</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
        )}

        <div style={{
          border: '2px dashed #cbd5e1', padding: '32px', textAlign: 'center', borderRadius: '8px',
          backgroundColor: '#f8fafc', marginBottom: '16px'
        }}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {file && <p style={{ marginTop: '10px', color: '#334155' }}>Selected file: <strong>{file.name}</strong></p>}
        </div>

        {file && !previewData && (
          <button
            onClick={handlePreview}
            disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Validating CSV...' : 'Validate & Preview Import'}
          </button>
        )}

        {/* Preview Card */}
        {previewData && (
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Verification & Duplicate Check Results</h4>
            
            {previewData.dateWarning && (
              <div style={{ background: '#fef3c7', color: '#b45309', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>
                {previewData.dateWarning}
              </div>
            )}

            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', fontSize: '14px' }}>
              <div>Total Records: <strong>{previewData.totalRows}</strong></div>
              <div style={{ color: '#16a34a' }}>Valid Rows: <strong>{previewData.validCount}</strong></div>
              <div style={{ color: '#dc2626' }}>Invalid Rows: <strong>{previewData.errorCount}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleConfirm}
                disabled={loading || previewData.validCount === 0}
                style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {loading ? 'Committing...' : 'Confirm & Commit Import'}
              </button>
              <button
                onClick={() => setPreviewData(null)}
                disabled={loading}
                style={{ backgroundColor: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <Templates />
      <ImportHistory />
      <FailedRows />
    </div>
  );
}

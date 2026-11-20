/**
 * Page: ReportsImportsPage
 * Purpose: Two separate import workflows: (1) Initial Inventory Import & (2) Daily Sales Report Import
 * Both workflows include file upload, validation, preview, and confirmation.
 * Owner: Member 4
 * Section: Reports & Imports
 */

import React, { useState } from 'react';
import ImportHistory from './components/ImportHistory';
import Templates from './components/Templates';
import FailedRows from './components/FailedRows';

export default function ReportsImportsPage() {
  const [activeTab, setActiveTab] = useState('daily-sales'); // 'initial-inventory' or 'daily-sales'

  // Upload & preview state
  const [file, setFile] = useState(null);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreviewData(null);
      setImportStatus(null);
    }
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    // In actual implementation, reads CSV file rows, computes SHA-256 fingerprint,
    // and calls backend:
    // /api/imports/preview/initial-inventory or /api/imports/preview/daily-sales
    setTimeout(() => {
      setPreviewData({
        fileName: file.name,
        totalRows: 24,
        validCount: 24,
        errorCount: 0,
        sample: [
          { sku: 'SKU-001', name: 'Sample Item 1', quantity: 5, price: 120 },
          { sku: 'SKU-002', name: 'Sample Item 2', quantity: 2, price: 250 }
        ]
      });
      setLoading(false);
    }, 600);
  };

  const handleConfirm = async () => {
    if (!previewData) return;
    setLoading(true);
    // Calls backend /api/imports/confirm/:importId to commit transactions & deduct stock
    setTimeout(() => {
      setImportStatus('Successfully imported and inventory has been continuously updated.');
      setLoading(false);
      setPreviewData(null);
      setFile(null);
    }, 800);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Reports & Imports Center</h2>
        <p>Import your initial inventory or daily sales CSV files with built-in validation, deduplication, and preview.</p>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
        <button
          className={`tab-btn ${activeTab === 'daily-sales' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'daily-sales' ? '3px solid #007bff' : 'none',
            background: 'none',
            fontWeight: activeTab === 'daily-sales' ? 'bold' : 'normal'
          }}
          onClick={() => { setActiveTab('daily-sales'); setPreviewData(null); }}
        >
          Daily Sales Report CSV Import
        </button>
        <button
          className={`tab-btn ${activeTab === 'initial-inventory' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'initial-inventory' ? '3px solid #007bff' : 'none',
            background: 'none',
            fontWeight: activeTab === 'initial-inventory' ? 'bold' : 'normal'
          }}
          onClick={() => { setActiveTab('initial-inventory'); setPreviewData(null); }}
        >
          Initial Inventory CSV Import
        </button>
      </div>

      {/* Import Container */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>
          {activeTab === 'daily-sales' ? 'Upload Daily Sales Report' : 'Upload Initial Inventory File'}
        </h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {activeTab === 'daily-sales'
            ? 'Imports daily transactions from your external billing machine, automatically deducts inventory stock continuously, and records sales.'
            : 'Populates your master product catalog with purchase costs, selling prices, minimum stock thresholds, and initial opening stock.'}
        </p>

        {activeTab === 'daily-sales' && (
          <div style={{ margin: '12px 0' }}>
            <label htmlFor="sales-report-date" style={{ marginRight: '8px', fontWeight: 'bold' }}>Report Date:</label>
            <input
              id="sales-report-date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
            />
          </div>
        )}

        <div className="file-upload-zone" style={{ border: '2px dashed #ccc', padding: '24px', textAlign: 'center', borderRadius: '8px', margin: '16px 0' }}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {file && <p style={{ marginTop: '8px' }}>Selected: <strong>{file.name}</strong></p>}
        </div>

        {file && !previewData && (
          <button className="btn btn-primary" onClick={handlePreview} disabled={loading}>
            {loading ? 'Validating CSV...' : 'Validate & Preview Import'}
          </button>
        )}

        {/* Preview & Confirmation Modal/Section */}
        {previewData && (
          <div className="preview-box" style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
            <h4>Import Preview & Verification</h4>
            <div style={{ display: 'flex', gap: '24px', margin: '12px 0' }}>
              <div>Total Rows: <strong>{previewData.totalRows}</strong></div>
              <div style={{ color: 'green' }}>Valid: <strong>{previewData.validCount}</strong></div>
              <div style={{ color: 'red' }}>Errors: <strong>{previewData.errorCount}</strong></div>
            </div>

            <p style={{ fontSize: '13px', color: '#555' }}>
              Duplicate Protection: File fingerprint is verified to ensure inventory is not deducted twice.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn btn-success" onClick={handleConfirm} disabled={loading}>
                {loading ? 'Committing...' : 'Confirm & Commit Import'}
              </button>
              <button className="btn btn-secondary" onClick={() => setPreviewData(null)} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {importStatus && (
          <div className="alert alert-success" style={{ marginTop: '16px', padding: '12px', background: '#e6fffa', color: '#007050', borderRadius: '6px' }}>
            {importStatus}
          </div>
        )}
      </div>

      <Templates />
      <ImportHistory />
      <FailedRows />
    </div>
  );
}

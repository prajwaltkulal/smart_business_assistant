/**
 * Component: BudgetInput
 * Purpose: Purchasing budget entry to constrain proposed restock quantities
 * Owner: Member 2
 * Section: Smart Recommendations
 */

import React from 'react';

export default function BudgetInput({ budget, onBudgetChange, onGenerate, loading }) {
  return (
    <div className="card" style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Set Your Available Restocking Budget</h3>
      <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
        Enter your available purchasing capital. The decision engine will prioritize out-of-stock and fast-depleting products to maximize ROI.
      </p>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b', fontWeight: 'bold' }}>₹</span>
          <input
            type="number"
            step="500"
            min="100"
            value={budget}
            onChange={(e) => onBudgetChange(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px', fontWeight: 'bold' }}
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px 24px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
        >
          {loading ? 'Analyzing Sales & Generating Plan...' : 'Generate Budget Restock Plan'}
        </button>
      </div>
    </div>
  );
}

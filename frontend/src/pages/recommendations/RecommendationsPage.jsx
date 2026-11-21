/**
 * Page: RecommendationsPage
 * Purpose: Smart restocking suggestions with budget constraints, recommended purchase quantities, estimated costs, and explainable reasons
 * Owner: Member 2
 * Section: Smart Recommendations
 */

import React, { useState } from 'react';
import BudgetInput from './components/BudgetInput';
import RestockPlan from './components/RestockPlan';
import { recommendationsApi } from '../../api/recommendationsApi';

export default function RecommendationsPage() {
  const [budget, setBudget] = useState(15000);
  const [restockPlan, setRestockPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleGeneratePlan = async (userBudget) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await recommendationsApi.getRestockPlan({
        budget: Number(userBudget),
        daysHistory: 30,
        targetStockDays: 14
      });
      setRestockPlan(res.data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate restock recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Smart Restocking Decision Support</h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
          Intelligent, budget-aware purchase planner that prioritizes fast-depleting and low-stock items with explainable reasons.
        </p>
      </div>

      {errorMsg && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' }}>
          {errorMsg}
        </div>
      )}

      <BudgetInput
        budget={budget}
        onBudgetChange={setBudget}
        onGenerate={() => handleGeneratePlan(budget)}
        loading={loading}
      />

      {restockPlan && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #2563eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Allocated Budget</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>₹{Number(restockPlan.totalEstimatedCost || 0).toLocaleString()}</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #16a34a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Remaining Budget</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>₹{Number(restockPlan.remainingBudget || 0).toLocaleString()}</div>
            </div>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ea580c', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Products Recommended</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c2410c' }}>{restockPlan.recommendedItemCount || 0} Products</div>
            </div>
          </div>

          <RestockPlan planData={restockPlan} />
        </div>
      )}
    </div>
  );
}

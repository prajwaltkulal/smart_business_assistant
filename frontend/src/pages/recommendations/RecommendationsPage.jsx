/**
 * Page: RecommendationsPage
 * Purpose: Smart restocking suggestions with budget constraints, recommended quantities, estimated costs, and reasons
 * Owner: Member 4
 * Section: Smart Recommendations
 */

import React, { useState } from 'react';
import BudgetInput from './components/BudgetInput';
import RestockPlan from './components/RestockPlan';
import RecommendationCard from './components/RecommendationCard';

export default function RecommendationsPage() {
  const [budget, setBudget] = useState(25000);
  const [restockPlan, setRestockPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async (userBudget) => {
    setLoading(true);
    // In actual implementation, calls backend:
    // POST /api/recommendations/restock with { budget: userBudget }
    setTimeout(() => {
      setRestockPlan({
        availableBudget: userBudget,
        totalEstimatedCost: Math.min(userBudget, 18400),
        remainingBudget: Math.max(0, userBudget - 18400),
        plan: [
          {
            productId: 1,
            name: 'Sample High Velocity Item',
            sku: 'SKU-001',
            currentStock: 2,
            suggestedUnits: 30,
            purchaseCost: 200,
            estimatedCost: 6000,
            urgency: 'critical',
            reason: 'Out of stock risk in 1.5 days based on recent daily sales velocity of 4.2 units/day.'
          },
          {
            productId: 2,
            name: 'Essential Commodity',
            sku: 'SKU-002',
            currentStock: 4,
            suggestedUnits: 25,
            purchaseCost: 150,
            estimatedCost: 3750,
            urgency: 'high',
            reason: 'Below minimum safety threshold (5 units). Daily velocity: 2.1 units/day.'
          }
        ]
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Smart Restocking Recommendations</h2>
        <p>Budget-aware purchase planner that prioritizes fast-moving and low-stock items.</p>
      </div>

      <BudgetInput
        budget={budget}
        onBudgetChange={setBudget}
        onGenerate={() => handleGeneratePlan(budget)}
        loading={loading}
      />

      {restockPlan && (
        <RestockPlan
          planData={restockPlan}
        />
      )}
    </div>
  );
}

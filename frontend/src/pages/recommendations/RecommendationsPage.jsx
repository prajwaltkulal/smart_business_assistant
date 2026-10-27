/**
 * Page: RecommendationsPage
 * Purpose: Explainable, budget-aware restocking recommendation engine
 * Owner: Member 4
 * Section: Smart Recommendations
 */

import React from 'react';
import BudgetInput from './components/BudgetInput';
import RestockPlan from './components/RestockPlan';
import RecommendationCard from './components/RecommendationCard';

export default function RecommendationsPage() {
  return (
    <div className="page-container">
      <h2>Smart Restocking Recommendations</h2>
      <BudgetInput />
      <RecommendationCard />
      <RestockPlan />
    </div>
  );
}

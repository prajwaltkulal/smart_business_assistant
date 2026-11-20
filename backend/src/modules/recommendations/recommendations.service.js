/**
 * Service: recommendations
 * Purpose: Restocking recommendation algorithm prioritizing out-of-stock, high-velocity, and high-margin products within budget
 * Owner: Member 4
 */

const repository = require('./recommendations.repository');

module.exports = {
  generateRestockPlan: async ({ businessId, budget, daysHistory = 30, targetStockDays = 14 }) => {
    // 1. Fetch candidate items with current stock, purchase cost, and recent sales
    const items = await repository.getProductsWithSalesVelocity(businessId, daysHistory);

    const recommendations = [];
    let allocatedBudget = 0;

    for (const item of items) {
      const currentStock = Math.max(0, Number(item.current_stock || 0));
      const unitsSold = Number(item.units_sold || 0);
      const dailyVelocity = unitsSold / daysHistory; // units sold per day
      const targetQuantity = Math.ceil(dailyVelocity * targetStockDays);
      const minStock = Number(item.min_stock_level || 5);
      const purchaseCost = Number(item.purchase_cost || 0);

      // Determine restock urgency
      let urgency = 'none';
      let reason = '';

      if (currentStock <= 0 && dailyVelocity > 0) {
        urgency = 'critical';
        reason = `Out of stock with active daily demand (${dailyVelocity.toFixed(1)} units/day).`;
      } else if (currentStock <= minStock && dailyVelocity > 0) {
        urgency = 'high';
        const daysRemaining = dailyVelocity > 0 ? (currentStock / dailyVelocity).toFixed(1) : 'N/A';
        reason = `Stock below safety threshold (${minStock} units). Projected to stock out in ${daysRemaining} days.`;
      } else if (currentStock < targetQuantity && dailyVelocity > 0) {
        urgency = 'medium';
        reason = `Current stock will not cover the desired ${targetStockDays}-day buffer.`;
      }

      if (urgency !== 'none' && purchaseCost > 0) {
        const neededUnits = Math.max(1, targetQuantity - currentStock);
        const estimatedItemCost = neededUnits * purchaseCost;

        recommendations.push({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          currentStock,
          dailyVelocity: Number(dailyVelocity.toFixed(2)),
          suggestedUnits: neededUnits,
          purchaseCost,
          estimatedCost: estimatedItemCost,
          urgency,
          reason
        });
      }
    }

    // Sort by urgency ('critical' > 'high' > 'medium') then by daily velocity desc
    const priorityWeight = { critical: 3, high: 2, medium: 1, none: 0 };
    recommendations.sort((a, b) => {
      if (priorityWeight[b.urgency] !== priorityWeight[a.urgency]) {
        return priorityWeight[b.urgency] - priorityWeight[a.urgency];
      }
      return b.dailyVelocity - a.dailyVelocity;
    });

    // Fit recommendations into budget
    const budgetedPlan = [];
    for (const rec of recommendations) {
      if (allocatedBudget + rec.estimatedCost <= budget) {
        budgetedPlan.push(rec);
        allocatedBudget += rec.estimatedCost;
      } else {
        // Check if we can buy a partial quantity with remaining budget
        const remainingBudget = budget - allocatedBudget;
        const partialUnits = Math.floor(remainingBudget / rec.purchaseCost);
        if (partialUnits > 0) {
          const partialCost = partialUnits * rec.purchaseCost;
          budgetedPlan.push({
            ...rec,
            suggestedUnits: partialUnits,
            estimatedCost: partialCost,
            reason: `${rec.reason} (Reduced to ${partialUnits} units to fit budget)`
          });
          allocatedBudget += partialCost;
        }
      }
    }

    return {
      availableBudget: budget,
      totalEstimatedCost: allocatedBudget,
      remainingBudget: budget - allocatedBudget,
      recommendedItemCount: budgetedPlan.length,
      plan: budgetedPlan
    };
  }
};

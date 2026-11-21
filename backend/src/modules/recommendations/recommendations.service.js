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
      const minStock = (item.min_stock_level !== null && item.min_stock_level !== undefined && !isNaN(Number(item.min_stock_level)))
        ? Math.max(0, Number(item.min_stock_level))
        : 5;
      const purchaseCost = Number(item.purchase_cost || 0) > 0 
        ? Number(item.purchase_cost) 
        : (Number(item.selling_price || 0) * 0.7 || 50);

      // Determine restock urgency accurately based on actual stock levels and thresholds
      let urgency = 'none';
      let reason = '';
      let neededUnits = 0;

      if (currentStock <= 0) {
        urgency = 'critical';
        if (dailyVelocity > 0) {
          reason = `Out of stock with active daily demand (${dailyVelocity.toFixed(1)} units/day). Urgent replenishment needed.`;
          neededUnits = Math.max(targetQuantity, Math.max(minStock * 2, 5));
        } else {
          reason = `Product is completely out of stock (0 units remaining). Replenish shelf baseline.`;
          neededUnits = Math.max(minStock * 2, 5);
        }
      } else if (currentStock <= minStock) {
        urgency = 'high';
        if (dailyVelocity > 0) {
          const daysRemaining = (currentStock / dailyVelocity).toFixed(1);
          reason = `Stock (${currentStock}) is at or below safety threshold (${minStock} units). Projected to stock out in ${daysRemaining} days.`;
          neededUnits = Math.max(1, targetQuantity - currentStock, (minStock * 2) - currentStock);
        } else {
          reason = `Stock (${currentStock}) has reached minimum safety threshold (${minStock} units). Replenishment recommended.`;
          neededUnits = Math.max(1, (minStock * 2) - currentStock, 5);
        }
      } else if (dailyVelocity > 0 && currentStock < targetQuantity) {
        urgency = 'medium';
        reason = `Current stock (${currentStock}) will not cover the desired ${targetStockDays}-day sales buffer.`;
        neededUnits = Math.max(1, targetQuantity - currentStock);
      }

      if (urgency !== 'none' && neededUnits > 0) {
        const estimatedItemCost = neededUnits * purchaseCost;
        const potentialRevenue = neededUnits * Number(item.selling_price || purchaseCost * 1.3);
        const expectedProfit = potentialRevenue - estimatedItemCost;

        recommendations.push({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          currentStock,
          minStockLevel: minStock,
          dailyVelocity: Number(dailyVelocity.toFixed(2)),
          suggestedUnits: neededUnits,
          purchaseCost,
          estimatedCost: estimatedItemCost,
          expectedProfit,
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
      plan: budgetedPlan,
      recommendations: budgetedPlan
    };
  }
};

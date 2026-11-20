/**
 * Controller: recommendations
 * Purpose: Handle requests for budget-aware restocking suggestions
 * Owner: Member 4
 */

const service = require('./recommendations.service');

module.exports = {
  getRestockPlan: async (req, res, next) => {
    try {
      const { businessId, budget = 10000, daysHistory = 30, targetStockDays = 14 } = req.body;
      const plan = await service.generateRestockPlan({
        businessId,
        budget: Number(budget),
        daysHistory: Number(daysHistory),
        targetStockDays: Number(targetStockDays)
      });
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }
};

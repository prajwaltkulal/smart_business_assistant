/**
 * Controller: recommendations
 * Purpose: Handle requests for budget-aware restocking suggestions
 * Owner: Member 2
 */

const service = require('./recommendations.service');

module.exports = {
  getRestockPlan: async (req, res, next) => {
    try {
      const businessId = req.businessMembership?.business_id || req.body.businessId;
      const { budget = 10000, daysHistory = 30, targetStockDays = 14 } = req.body;
      const plan = await service.generateRestockPlan({
        businessId,
        budget: Number(budget),
        daysHistory: Number(daysHistory),
        targetStockDays: Number(targetStockDays)
      });
      res.json({ success: true, data: plan });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

/**
 * Controller: imports
 * Purpose: Handle requests for Initial Inventory CSV and Daily Sales CSV imports
 * Owner: Member 4
 */

const service = require('./imports.service');

module.exports = {
  previewInitialInventory: async (req, res, next) => {
    try {
      const { businessId, fileName, rows, fileFingerprint } = req.body;
      const preview = await service.validateAndPreviewInventory({
        businessId,
        fileName,
        rows,
        fileFingerprint
      });
      res.json({ success: true, data: preview });
    } catch (err) {
      next(err);
    }
  },

  previewDailySales: async (req, res, next) => {
    try {
      const { businessId, fileName, reportDate, rows, fileFingerprint } = req.body;
      const preview = await service.validateAndPreviewDailySales({
        businessId,
        fileName,
        reportDate,
        rows,
        fileFingerprint
      });
      res.json({ success: true, data: preview });
    } catch (err) {
      next(err);
    }
  },

  confirmImport: async (req, res, next) => {
    try {
      const { importId } = req.params;
      const userId = req.user?.id || req.body.userId;
      const result = await service.confirmImport(importId, userId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  getImportHistory: async (req, res, next) => {
    try {
      const { businessId, importType } = req.query;
      const history = await service.getImportHistory(businessId, importType);
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  },

  getImportDetails: async (req, res, next) => {
    try {
      const { importId } = req.params;
      const details = await service.getImportDetails(importId);
      if (!details) {
        return res.status(404).json({ success: false, message: 'Import not found' });
      }
      res.json({ success: true, data: details });
    } catch (err) {
      next(err);
    }
  }
};

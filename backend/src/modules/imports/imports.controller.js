/**
 * Controller: imports
 * Purpose: Handle requests for Initial Inventory CSV and Daily Sales CSV imports
 * Owner: Member 2
 */

const service = require('./imports.service');
const db = require('../../config/db');

async function resolveBusinessId(req) {
  if (req.businessMembership?.business_id) return req.businessMembership.business_id;
  if (req.body?.businessId && !isNaN(Number(req.body.businessId))) return Number(req.body.businessId);
  if (req.headers['x-business-id'] && !isNaN(Number(req.headers['x-business-id']))) return Number(req.headers['x-business-id']);
  if (req.query?.businessId && !isNaN(Number(req.query.businessId))) return Number(req.query.businessId);
  if (req.user?.id) {
    const res = await db.query(
      "SELECT business_id FROM business_members WHERE user_id = $1 AND is_active = TRUE ORDER BY (role = 'owner') DESC, id ASC LIMIT 1;",
      [req.user.id]
    );
    if (res.rows.length > 0) return res.rows[0].business_id;
  }
  const fallback = await db.query("SELECT id FROM businesses WHERE is_active = TRUE ORDER BY id ASC LIMIT 1;");
  if (fallback.rows.length > 0) return fallback.rows[0].id;
  return 1;
}

module.exports = {
  previewInitialInventory: async (req, res, next) => {
    try {
      const businessId = await resolveBusinessId(req);
      const { fileName, rows, fileFingerprint } = req.body;
      const preview = await service.validateAndPreviewInventory({
        businessId,
        fileName,
        rows,
        fileFingerprint
      });
      res.json({ success: true, data: preview });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  previewDailySales: async (req, res, next) => {
    try {
      const businessId = await resolveBusinessId(req);
      const { fileName, reportDate, rows, fileFingerprint } = req.body;
      const preview = await service.validateAndPreviewDailySales({
        businessId,
        fileName,
        reportDate,
        rows,
        fileFingerprint
      });
      res.json({ success: true, data: preview });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  confirmImport: async (req, res, next) => {
    try {
      const { importId } = req.params;
      const userId = req.user?.id;
      const result = await service.confirmImport(importId, userId);
      res.json({ success: true, message: 'Import confirmed and stock updated successfully', data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getImportHistory: async (req, res, next) => {
    try {
      const businessId = await resolveBusinessId(req);
      const { importType } = req.query;
      const history = await service.getImportHistory(businessId, importType);
      res.json({ success: true, data: history });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
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
      res.status(404).json({ success: false, message: err.message });
    }
  }
};

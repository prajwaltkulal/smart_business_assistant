/**
 * Service: products
 * Purpose: Business logic for products, validations, category aggregation, and opening stock creation
 * Owner: Member 1 (Prajwal)
 */

const repository = require('./products.repository');
const inventoryRepo = require('../inventory/inventory.repository');

module.exports = {
  createProduct: async ({
    businessId,
    name,
    sku,
    barcode,
    category,
    description,
    unit,
    purchaseCost,
    sellingPrice,
    minStockLevel,
    initialStock = 0,
    userId
  }) => {
    if (!name || name.trim() === '') {
      throw new Error('Product name is required.');
    }

    if (purchaseCost !== undefined && Number(purchaseCost) < 0) {
      throw new Error('Purchase cost cannot be negative.');
    }

    if (sellingPrice !== undefined && Number(sellingPrice) < 0) {
      throw new Error('Selling price cannot be negative.');
    }

    // Check SKU uniqueness within this business
    if (sku && sku.trim() !== '') {
      const existing = await repository.findBySku(sku, businessId);
      if (existing) {
        throw new Error(`Product with SKU '${sku}' already exists in your catalog.`);
      }
    }

    const product = await repository.createProduct({
      businessId,
      name,
      sku,
      barcode,
      category,
      description,
      unit,
      purchaseCost: Number(purchaseCost || 0),
      sellingPrice: Number(sellingPrice || 0),
      minStockLevel: Number(minStockLevel || 5)
    });

    // If an initial opening stock was provided during creation, record it in stock_movements
    const openingStock = Number(initialStock || 0);
    if (openingStock > 0) {
      await inventoryRepo.applyStockMovement({
        businessId,
        productId: product.id,
        movementType: 'initial_import',
        quantityDelta: openingStock,
        unitCost: Number(purchaseCost || 0),
        reason: 'Manual Product Addition - Initial Stock',
        referenceType: 'manual',
        referenceId: product.id,
        userId: userId || null
      });
    }

    return product;
  },

  getProducts: async ({ businessId, search, category, page, limit }) => {
    return await repository.findProducts({ businessId, search, category, page, limit });
  },

  getProductById: async (id, businessId) => {
    const product = await repository.findById(id, businessId);
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  },

  updateProduct: async (id, businessId, fields) => {
    // If SKU is being updated, verify it doesn't conflict with another product
    if (fields.sku && fields.sku.trim() !== '') {
      const existing = await repository.findBySku(fields.sku, businessId);
      if (existing && String(existing.id) !== String(id)) {
        throw new Error(`Product with SKU '${fields.sku}' already exists.`);
      }
    }

    const updated = await repository.updateProduct(id, businessId, fields);
    if (!updated) {
      throw new Error('Product not found or update failed.');
    }
    return updated;
  },

  deleteProduct: async (id, businessId) => {
    const deleted = await repository.deleteProduct(id, businessId);
    if (!deleted) {
      throw new Error('Product not found or already deleted.');
    }
    return { success: true, message: 'Product deleted successfully.' };
  },

  getCategories: async (businessId) => {
    return await repository.getCategories(businessId);
  }
};

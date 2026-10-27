# Database Design (PostgreSQL)

## Core Tables and Relationships

1. **users**: System accounts and credentials.
2. **businesses**: Shop profile, operating mode (Owner-Managed vs. Owner-Supervised), currency, and metadata.
3. **business_members**: Junction table associating users with businesses, defining roles (owner, manager, cashier/employee) and granular permissions.
4. **products**: Catalog items belonging to a business (SKU, barcode, name, category, purchase_cost, selling_price, min_stock_level, unit).
5. **sales**: Sales transaction header (business_id, recorded_by, total_amount, source: 'manual' | 'billing_import', transaction_ref, timestamp).
6. **sale_items**: Line items for sales transactions (sale_id, product_id, quantity, unit_price, subtotal).
7. **stock_movements**: Immutable audit log of stock changes (product_id, movement_type: 'opening' | 'sale' | 'purchase' | 'adjustment' | 'damage' | 'return', quantity_delta, previous_stock, new_stock, reason, created_by, timestamp).
8. **imports**: Audit table tracking imported files, report dates, status, row counts, and duplicate hash/fingerprint.
9. **activity_log**: High-level audit log recording critical actions, especially for Owner-Supervised operating mode.

## Data Integrity Rules
- Every sale deduction and stock movement must occur inside an ACID transaction block.
- All product and sales records are partitioned/scoped by `business_id`.
- Deletions are soft (archived) to preserve historical billing integrity.

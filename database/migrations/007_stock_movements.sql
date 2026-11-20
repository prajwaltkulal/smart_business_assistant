-- Migration: 007_stock_movements
-- Purpose: Continuous audit ledger for all stock additions, deductions, and adjustments
-- Tracks movement reason, quantity change, running balance, and links to transactions or imports

CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- 'initial_import', 'sales_deduction', 'stock_addition', 'manual_adjustment', 'damage', 'return'
    quantity_delta NUMERIC(10, 2) NOT NULL, -- Positive for additions, negative for deductions
    previous_stock NUMERIC(10, 2) NOT NULL,
    new_stock NUMERIC(10, 2) NOT NULL,
    unit_cost NUMERIC(12, 2) DEFAULT 0.00,
    reference_type VARCHAR(50), -- 'import', 'sale', 'manual'
    reference_id INTEGER,       -- import_id, sale_id, etc.
    reason TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_business_id ON stock_movements(business_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_ref ON stock_movements(reference_type, reference_id);

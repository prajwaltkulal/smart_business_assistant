-- Migration: 008_imports
-- Purpose: Track CSV imports for both Initial Inventory and Daily Sales Reports
-- Records file metadata, validation results, status, duplicate prevention fingerprint, and row counts

CREATE TABLE IF NOT EXISTS imports (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    import_type VARCHAR(50) NOT NULL, -- 'initial_inventory', 'daily_sales'
    file_name VARCHAR(255) NOT NULL,
    file_fingerprint VARCHAR(64) NOT NULL, -- SHA-256 hash to prevent duplicate file uploads
    report_date DATE,                      -- Applicable for daily sales reports
    status VARCHAR(50) NOT NULL DEFAULT 'previewed', -- 'previewed', 'confirmed', 'failed'
    total_rows INTEGER NOT NULL DEFAULT 0,
    valid_rows INTEGER NOT NULL DEFAULT 0,
    error_rows INTEGER NOT NULL DEFAULT 0,
    validation_summary JSONB,              -- Detailed validation errors & warnings per row
    imported_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_imports_business_id ON imports(business_id);
CREATE INDEX IF NOT EXISTS idx_imports_type ON imports(business_id, import_type);
CREATE INDEX IF NOT EXISTS idx_imports_fingerprint ON imports(business_id, file_fingerprint);
CREATE INDEX IF NOT EXISTS idx_imports_report_date ON imports(business_id, report_date);

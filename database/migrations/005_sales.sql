-- Migration: 005_sales
-- Purpose: Sales records imported from daily sales reports
-- Supports batch imports, external invoice references, daily totals, and duplicate prevention links

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    import_id INTEGER REFERENCES imports(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100),
    sale_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_discount NUMERIC(12, 2) DEFAULT 0.00,
    net_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'cash',
    source VARCHAR(50) NOT NULL DEFAULT 'daily_report_import',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sales_business_id ON sales(business_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_import_id ON sales(import_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_number ON sales(business_id, invoice_number);

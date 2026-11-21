-- Migration: 009_activity_log
-- Purpose: Audit trail of employee and owner actions for accountability and monitoring
-- Owner: Member 1 & Member 2

CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'LOGIN', 'IMPORT_INVENTORY', 'IMPORT_SALES', 'STOCK_ADJUSTMENT', 'INVITE_USER'
    entity_type VARCHAR(50),      -- 'product', 'sale', 'import', 'user', 'inventory'
    entity_id INTEGER,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_log_business ON activity_log(business_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(business_id, action);

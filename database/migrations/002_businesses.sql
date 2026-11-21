-- Migration: 002_businesses
-- Purpose: Store business profiles, operating modes (Owner-Managed / Owner-Supervised), currency, and settings
-- Owner: Member 1 & Member 3

CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Retail',
    operating_mode VARCHAR(50) NOT NULL DEFAULT 'owner_managed', -- 'owner_managed' or 'owner_supervised'
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);

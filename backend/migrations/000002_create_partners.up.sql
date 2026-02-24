-- 002_create_partners.up.sql

CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'hotel', 'flight'
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, IN_REVIEW, APPROVED, REJECTED, SUSPENDED
    commission_rate DECIMAL(10,2) DEFAULT 0,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_deleted_at ON partners(deleted_at);

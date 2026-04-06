-- 002_create_partners.up.sql

CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'hotel', 'flight'
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, IN_REVIEW, APPROVED, REJECTED, SUSPENDED
    commission_rate DECIMAL(10,2) DEFAULT 0,
    approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_deleted_at ON partners(deleted_at);

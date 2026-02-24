-- 009_add_payment_snap_fields.up.sql
ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS snap_token   VARCHAR(512),
    ADD COLUMN IF NOT EXISTS redirect_url VARCHAR(1024);

-- 009_add_payment_snap_fields.down.sql
ALTER TABLE payments
    DROP COLUMN IF EXISTS snap_token,
    DROP COLUMN IF EXISTS redirect_url;

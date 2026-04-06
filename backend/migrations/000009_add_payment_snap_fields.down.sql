-- 009_add_payment_snap_fields.down.sql
ALTER TABLE payments DROP COLUMN snap_token;
ALTER TABLE payments DROP COLUMN redirect_url;

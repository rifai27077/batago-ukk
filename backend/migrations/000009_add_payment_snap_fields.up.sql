-- 009_add_payment_snap_fields.up.sql
ALTER TABLE payments ADD COLUMN snap_token VARCHAR(512);
ALTER TABLE payments ADD COLUMN redirect_url VARCHAR(1024);

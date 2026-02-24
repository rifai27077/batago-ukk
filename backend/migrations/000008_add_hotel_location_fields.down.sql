-- 008_add_hotel_location_fields.down.sql

ALTER TABLE hotels DROP COLUMN IF EXISTS type;
ALTER TABLE hotels DROP COLUMN IF EXISTS base_price;
ALTER TABLE hotels DROP COLUMN IF EXISTS room_count;
ALTER TABLE hotels DROP COLUMN IF EXISTS latitude;
ALTER TABLE hotels DROP COLUMN IF EXISTS longitude;
ALTER TABLE hotels DROP COLUMN IF EXISTS status;
DROP INDEX IF EXISTS idx_hotels_type;
DROP INDEX IF EXISTS idx_hotels_status;

-- 008_add_hotel_location_fields.down.sql

ALTER TABLE hotels DROP COLUMN type;
ALTER TABLE hotels DROP COLUMN base_price;
ALTER TABLE hotels DROP COLUMN room_count;
ALTER TABLE hotels DROP COLUMN latitude;
ALTER TABLE hotels DROP COLUMN longitude;
ALTER TABLE hotels DROP COLUMN status;
DROP INDEX idx_hotels_type ON hotels;
DROP INDEX idx_hotels_status ON hotels;

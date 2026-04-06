-- 008_add_hotel_location_fields.up.sql

ALTER TABLE hotels ADD COLUMN type VARCHAR(50) DEFAULT 'hotel';
ALTER TABLE hotels ADD COLUMN base_price DECIMAL(15,2) DEFAULT 0;
ALTER TABLE hotels ADD COLUMN room_count INT DEFAULT 0;
ALTER TABLE hotels ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE hotels ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE hotels ADD COLUMN status VARCHAR(20) DEFAULT 'active';

CREATE INDEX idx_hotels_type ON hotels(type);
CREATE INDEX idx_hotels_status ON hotels(status);

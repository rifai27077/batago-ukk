-- 005_create_hotels.up.sql

CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    city_id INTEGER REFERENCES cities(id),
    description TEXT,
    address TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS hotel_images (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS hotel_facilities (
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, facility_id)
);

CREATE TABLE IF NOT EXISTS room_types (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    size_m2 INTEGER,
    max_guests INTEGER NOT NULL,
    base_price DECIMAL(15,2) NOT NULL,
    features JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS room_images (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES room_types(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS room_availabilities (
    id SERIAL PRIMARY KEY,
    room_type_id INTEGER REFERENCES room_types(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_rooms INTEGER NOT NULL,
    price_override DECIMAL(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_hotels_partner_id ON hotels(partner_id);
CREATE INDEX idx_hotels_city_id ON hotels(city_id);
CREATE INDEX idx_hotels_deleted_at ON hotels(deleted_at);
CREATE INDEX idx_hotel_images_hotel_id ON hotel_images(hotel_id);
CREATE INDEX idx_hotel_images_deleted_at ON hotel_images(deleted_at);
CREATE INDEX idx_room_types_hotel_id ON room_types(hotel_id);
CREATE INDEX idx_room_types_deleted_at ON room_types(deleted_at);
CREATE INDEX idx_room_images_deleted_at ON room_images(deleted_at);
CREATE INDEX idx_room_avail_room_type ON room_availabilities(room_type_id);
CREATE INDEX idx_room_avail_date ON room_availabilities(date);
CREATE INDEX idx_room_avail_deleted_at ON room_availabilities(deleted_at);

-- 005_create_hotels.up.sql

CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id INT,
    name VARCHAR(255) NOT NULL,
    city_id INT,
    description TEXT,
    address TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS hotel_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    url VARCHAR(255) NOT NULL,
    is_primary TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS hotel_facilities (
    hotel_id INT,
    facility_id INT,
    PRIMARY KEY (hotel_id, facility_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS room_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    size_m2 INT,
    max_guests INT NOT NULL,
    base_price DECIMAL(15,2) NOT NULL,
    features JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS room_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    url VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (room_id) REFERENCES room_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS room_availabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_type_id INT,
    date DATE NOT NULL,
    available_rooms INT NOT NULL,
    price_override DECIMAL(15,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

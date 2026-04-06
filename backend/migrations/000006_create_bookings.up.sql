-- 006_create_bookings.up.sql

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(255) UNIQUE NOT NULL,
    user_id INT,
    partner_id INT,
    type VARCHAR(50) NOT NULL, -- 'flight', 'hotel'
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, FAILED, EXPIRED
    booking_status VARCHAR(50) DEFAULT 'NEW', -- NEW, CONFIRMED, CHECKED_IN, COMPLETED, CANCELLED
    total_amount DECIMAL(15,2) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT UNIQUE,
    gateway VARCHAR(100),
    transaction_id VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED
    paid_at DATETIME,
    raw_response JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS e_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT UNIQUE,
    ticket_number VARCHAR(255) NOT NULL,
    issued_at DATETIME NOT NULL,
    issued_by VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS hotel_vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT UNIQUE,
    voucher_code VARCHAR(255) NOT NULL,
    issued_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS flight_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT UNIQUE,
    flight_id INT,
    class VARCHAR(50) NOT NULL, -- Economy, Business, First
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Adult, Child
    seat_number VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT UNIQUE,
    user_id INT,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_partner_id ON bookings(partner_id);
CREATE INDEX idx_bookings_deleted_at ON bookings(deleted_at);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_deleted_at ON payments(deleted_at);
CREATE INDEX idx_e_tickets_deleted_at ON e_tickets(deleted_at);
CREATE INDEX idx_hotel_vouchers_deleted_at ON hotel_vouchers(deleted_at);
CREATE INDEX idx_flight_bookings_deleted_at ON flight_bookings(deleted_at);
CREATE INDEX idx_passengers_booking_id ON passengers(booking_id);
CREATE INDEX idx_passengers_deleted_at ON passengers(deleted_at);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_deleted_at ON reviews(deleted_at);

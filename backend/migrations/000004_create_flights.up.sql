-- 004_create_flights.up.sql

CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id INT,
    flight_number VARCHAR(50) NOT NULL,
    airline VARCHAR(255) NOT NULL,
    departure_airport_id INT,
    arrival_airport_id INT,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    baggage_allowance_kg INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
    FOREIGN KEY (departure_airport_id) REFERENCES airports(id),
    FOREIGN KEY (arrival_airport_id) REFERENCES airports(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS flight_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    class VARCHAR(50) NOT NULL, -- ECONOMY, BUSINESS, FIRST
    price DECIMAL(15,2) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    features JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE INDEX idx_flights_partner_id ON flights(partner_id);
CREATE INDEX idx_flights_departure_time ON flights(departure_time);
CREATE INDEX idx_flights_deleted_at ON flights(deleted_at);
CREATE INDEX idx_flight_seats_flight_id ON flight_seats(flight_id);
CREATE INDEX idx_flight_seats_deleted_at ON flight_seats(deleted_at);

-- 004_create_flights.up.sql

CREATE TABLE IF NOT EXISTS flights (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    flight_number VARCHAR(50) NOT NULL,
    airline VARCHAR(255) NOT NULL,
    departure_airport_id INTEGER REFERENCES airports(id),
    arrival_airport_id INTEGER REFERENCES airports(id),
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    baggage_allowance_kg INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS flight_seats (
    id SERIAL PRIMARY KEY,
    flight_id INTEGER REFERENCES flights(id) ON DELETE CASCADE,
    class VARCHAR(50) NOT NULL, -- ECONOMY, BUSINESS, FIRST
    price DECIMAL(15,2) NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    features JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_flights_partner_id ON flights(partner_id);
CREATE INDEX idx_flights_departure_time ON flights(departure_time);
CREATE INDEX idx_flights_deleted_at ON flights(deleted_at);
CREATE INDEX idx_flight_seats_flight_id ON flight_seats(flight_id);
CREATE INDEX idx_flight_seats_deleted_at ON flight_seats(deleted_at);

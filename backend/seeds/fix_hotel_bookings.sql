CREATE TABLE IF NOT EXISTS hotel_bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  created_at DATETIME(3) NULL,
  updated_at DATETIME(3) NULL,
  deleted_at DATETIME(3) NULL,
  booking_id BIGINT UNSIGNED NOT NULL,
  room_type_id BIGINT UNSIGNED NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  UNIQUE INDEX idx_hotel_bookings_booking_id (booking_id),
  INDEX idx_hotel_bookings_deleted_at (deleted_at)
);

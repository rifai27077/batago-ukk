Table users {
  id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
  role enum('USER', 'ADMIN')
  phone varchar
  avatar_url varchar
  created_at timestamp
  updated_at timestamp
}

Table partners {
  id int [pk, increment]
  user_id int [unique, ref: > users.id]
  company_name varchar
  type enum('hotel', 'flight')
  status enum('DRAFT', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED')
  commission_rate decimal
  created_at timestamp
  approved_at timestamp [null]
}

Table bookings {
  id int [pk, increment]
  booking_code varchar [unique]
  user_id int [ref: > users.id]
  partner_id int [ref: > partners.id]
  type enum('flight', 'hotel')

  payment_status enum('PENDING', 'PAID', 'FAILED', 'EXPIRED')
  booking_status enum('NEW', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED')

  total_amount decimal
  expires_at timestamp
  created_at timestamp
}

Table payments {
  id int [pk, increment]
  booking_id int [unique, ref: > bookings.id]
  gateway varchar
  transaction_id varchar
  amount decimal
  status enum('PENDING', 'SUCCESS', 'FAILED')
  paid_at timestamp [null]
  raw_response json
  created_at timestamp
}

Table e_tickets {
  id int [pk, increment]
  booking_id int [unique, ref: > bookings.id]
  ticket_number varchar
  issued_at timestamp
  issued_by varchar
}

Table hotel_vouchers {
  id int [pk, increment]
  booking_id int [unique, ref: > bookings.id]
  voucher_code varchar
  issued_at timestamp
}

Table flights {
  id int [pk, increment]
  partner_id int [ref: > partners.id]
  flight_number varchar
  airline varchar
  departure_airport_id int [ref: > airports.id]
  arrival_airport_id int [ref: > airports.id]
  departure_time timestamp
  arrival_time timestamp
  duration int
  baggage_allowance_kg int
}

Table hotels {
  id int [pk, increment]
  partner_id int [ref: > partners.id]
  name varchar
  city_id int [ref: > cities.id]
  description text
  address text
  rating decimal
  total_reviews int
}

Table room_types {
  id int [pk, increment]
  hotel_id int [ref: > hotels.id]
  name varchar
  description text
  size_m2 int
  max_guests int
  base_price decimal
  features json
}

Table room_availability {
  id int [pk, increment]
  room_type_id int [ref: > room_types.id]
  date date
  available_rooms int
  price_override decimal [null]
}

Table flight_bookings {
  id int [pk, increment]
  booking_id int [unique, ref: > bookings.id]
  flight_id int [ref: > flights.id]
  class enum('Economy', 'Business')
}

Table passengers {
  id int [pk, increment]
  booking_id int [ref: > bookings.id]
  name varchar
  type enum('Adult', 'Child')
  seat_number varchar
}

-- New Tables Added
Table airports {
  id int [pk, increment]
  code varchar [unique]
  name varchar
  city varchar
  country varchar
  timezone varchar
}

Table cities {
  id int [pk, increment]
  name varchar
  country varchar
  image_url varchar
  is_popular boolean
}

Table flight_seats {
  id int [pk, increment]
  flight_id int [ref: > flights.id]
  class enum('ECONOMY', 'BUSINESS', 'FIRST')
  price decimal
  total_seats int
  available_seats int
  features json
}

Table facilities {
  id int [pk, increment]
  name varchar
  icon varchar
}

Table hotel_facilities {
  hotel_id int [ref: > hotels.id]
  facility_id int [ref: > facilities.id]
  pk (hotel_id, facility_id)
}

Table hotel_images {
  id int [pk, increment]
  hotel_id int [ref: > hotels.id]
  url varchar
  is_primary boolean
}

Table room_images {
  id int [pk, increment]
  room_id int [ref: > room_types.id]
  url varchar
}

Table reviews {
  id int [pk, increment]
  booking_id int [unique, ref: > bookings.id]
  user_id int [ref: > users.id]
  rating int
  comment text
  created_at timestamp
}


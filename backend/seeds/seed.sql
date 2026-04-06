-- Seed Data for BataGo
-- Run with: cd backend && go run cmd/seed/main.go

-- ======================
-- ADMIN USER
-- Password: password (bcrypt hashed)
-- ======================
INSERT IGNORE INTO users (name, email, password, role, phone, is_verified, created_at, updated_at)
VALUES ('Admin BataGo', 'admin@batago.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', '081234567890', 1, NOW(), NOW());

-- ======================
-- PARTNERS (Airlines & Hotel Chains)
-- ======================
INSERT IGNORE INTO partners (company_name, type, status, created_at, updated_at) VALUES
('Garuda Indonesia', 'airline', 'APPROVED', NOW(), NOW()),
('Lion Air', 'airline', 'APPROVED', NOW(), NOW()),
('Citilink', 'airline', 'APPROVED', NOW(), NOW()),
('Batik Air', 'airline', 'APPROVED', NOW(), NOW()),
('AirAsia Indonesia', 'airline', 'APPROVED', NOW(), NOW()),
('The Mulia Resort', 'hotel', 'APPROVED', NOW(), NOW()),
('AYANA Resort Bali', 'hotel', 'APPROVED', NOW(), NOW()),
('Hotel Indonesia Kempinski', 'hotel', 'APPROVED', NOW(), NOW()),
('Padma Resort Legian', 'hotel', 'APPROVED', NOW(), NOW()),
('Tugu Hotel Malang', 'hotel', 'APPROVED', NOW(), NOW());

-- ======================
-- CITIES
-- ======================
INSERT IGNORE INTO cities (name, country, image_url, is_popular, created_at, updated_at) VALUES
('Jakarta', 'Indonesia', 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800', 1, NOW(), NOW()),
('Bali', 'Indonesia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 1, NOW(), NOW()),
('Yogyakarta', 'Indonesia', 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800', 1, NOW(), NOW()),
('Surabaya', 'Indonesia', 'https://images.unsplash.com/photo-1621274283991-0a60c3100b79?w=800', 1, NOW(), NOW()),
('Bandung', 'Indonesia', 'https://images.unsplash.com/photo-1604310383708-c862f95b3abe?w=800', 1, NOW(), NOW()),
('Malang', 'Indonesia', 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800', 0, NOW(), NOW()),
('Lombok', 'Indonesia', 'https://images.unsplash.com/photo-1570789210967-2cac24ba04c0?w=800', 1, NOW(), NOW()),
('Medan', 'Indonesia', 'https://images.unsplash.com/photo-1609607849457-28fc7f92e8a7?w=800', 0, NOW(), NOW()),
('Makassar', 'Indonesia', 'https://images.unsplash.com/photo-1625736180498-fce7362cdd13?w=800', 0, NOW(), NOW()),
('Semarang', 'Indonesia', 'https://images.unsplash.com/photo-1623492229905-3c9ed2ef396e?w=800', 0, NOW(), NOW());

-- ======================
-- AIRPORTS
-- ======================
INSERT IGNORE INTO airports (code, name, city, country, timezone, created_at, updated_at) VALUES
('CGK', 'Soekarno-Hatta International Airport', 'Jakarta', 'Indonesia', 'Asia/Jakarta', NOW(), NOW()),
('DPS', 'Ngurah Rai International Airport', 'Bali', 'Indonesia', 'Asia/Makassar', NOW(), NOW()),
('JOG', 'Adisucipto International Airport', 'Yogyakarta', 'Indonesia', 'Asia/Jakarta', NOW(), NOW()),
('SUB', 'Juanda International Airport', 'Surabaya', 'Indonesia', 'Asia/Jakarta', NOW(), NOW()),
('BDO', 'Husein Sastranegara Airport', 'Bandung', 'Indonesia', 'Asia/Jakarta', NOW(), NOW()),
('MLG', 'Abdul Rachman Saleh Airport', 'Malang', 'Indonesia', 'Asia/Jakarta', NOW(), NOW()),
('LOP', 'Lombok International Airport', 'Lombok', 'Indonesia', 'Asia/Makassar', NOW(), NOW()),
('KNO', 'Kualanamu International Airport', 'Medan', 'Indonesia', 'Asia/Jakarta', NOW(), NOW()),
('UPG', 'Sultan Hasanuddin International Airport', 'Makassar', 'Indonesia', 'Asia/Makassar', NOW(), NOW()),
('SRG', 'Ahmad Yani International Airport', 'Semarang', 'Indonesia', 'Asia/Jakarta', NOW(), NOW());

-- ======================
-- FACILITIES
-- ======================
INSERT IGNORE INTO facilities (name, icon, created_at, updated_at) VALUES
('Free WiFi', 'wifi', NOW(), NOW()),
('Swimming Pool', 'waves', NOW(), NOW()),
('Fitness Center', 'dumbbell', NOW(), NOW()),
('Restaurant', 'utensils', NOW(), NOW()),
('Spa', 'sparkles', NOW(), NOW()),
('Parking', 'car', NOW(), NOW()),
('Airport Shuttle', 'bus', NOW(), NOW()),
('Room Service', 'bell', NOW(), NOW()),
('Air Conditioning', 'wind', NOW(), NOW()),
('Beach Access', 'umbrella', NOW(), NOW());

-- ======================
-- FLIGHTS (next 30 days, various routes)
-- ======================
INSERT IGNORE INTO flights (partner_id, flight_number, airline, departure_airport_id, arrival_airport_id, departure_time, arrival_time, duration, baggage_allowance_kg, created_at, updated_at) VALUES
-- Garuda Indonesia flights
(1, 'GA-401', 'Garuda Indonesia', 1, 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 6 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR + INTERVAL 50 MINUTE, 110, 30, NOW(), NOW()),
(1, 'GA-402', 'Garuda Indonesia', 2, 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 16 HOUR + INTERVAL 30 MINUTE, 110, 30, NOW(), NOW()),
(1, 'GA-201', 'Garuda Indonesia', 1, 3, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 7 HOUR + INTERVAL 30 MINUTE, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR + INTERVAL 40 MINUTE, 70, 30, NOW(), NOW()),
(1, 'GA-301', 'Garuda Indonesia', 1, 4, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 11 HOUR + INTERVAL 30 MINUTE, 90, 30, NOW(), NOW()),
(1, 'GA-501', 'Garuda Indonesia', 4, 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 8 HOUR, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 90, 30, NOW(), NOW()),
-- Lion Air flights
(2, 'JT-690', 'Lion Air', 1, 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 11 HOUR + INTERVAL 40 MINUTE, 100, 20, NOW(), NOW()),
(2, 'JT-691', 'Lion Air', 2, 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE, 100, 20, NOW(), NOW()),
(2, 'JT-570', 'Lion Air', 1, 4, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 6 HOUR + INTERVAL 30 MINUTE, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 8 HOUR, 90, 20, NOW(), NOW()),
(2, 'JT-580', 'Lion Air', 4, 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 16 HOUR, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 90, 20, NOW(), NOW()),
(2, 'JT-250', 'Lion Air', 1, 3, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 12 HOUR, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 13 HOUR + INTERVAL 10 MINUTE, 70, 20, NOW(), NOW()),
-- Citilink flights
(3, 'QG-800', 'Citilink', 1, 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 5 HOUR + INTERVAL 30 MINUTE, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR + INTERVAL 10 MINUTE, 100, 20, NOW(), NOW()),
(3, 'QG-801', 'Citilink', 2, 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 19 HOUR, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 21 HOUR + INTERVAL 30 MINUTE, 100, 20, NOW(), NOW()),
(3, 'QG-610', 'Citilink', 4, 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 13 HOUR, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 14 HOUR + INTERVAL 30 MINUTE, 90, 20, NOW(), NOW()),
(3, 'QG-340', 'Citilink', 1, 8, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 8 HOUR, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 150, 20, NOW(), NOW()),
-- Batik Air flights
(4, 'ID-6570', 'Batik Air', 1, 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 15 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 40 MINUTE, 100, 30, NOW(), NOW()),
(4, 'ID-6571', 'Batik Air', 2, 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 22 HOUR + INTERVAL 30 MINUTE, 100, 30, NOW(), NOW()),
(4, 'ID-7300', 'Batik Air', 1, 7, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 11 HOUR, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 13 HOUR + INTERVAL 30 MINUTE, 150, 30, NOW(), NOW()),
-- AirAsia flights
(5, 'QZ-7520', 'AirAsia Indonesia', 1, 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 11 HOUR + INTERVAL 30 MINUTE, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 14 HOUR + INTERVAL 10 MINUTE, 100, 15, NOW(), NOW()),
(5, 'QZ-7521', 'AirAsia Indonesia', 2, 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 16 HOUR + INTERVAL 30 MINUTE, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 19 HOUR, 100, 15, NOW(), NOW()),
(5, 'QZ-8400', 'AirAsia Indonesia', 4, 7, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 14 HOUR, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 15 HOUR + INTERVAL 20 MINUTE, 80, 15, NOW(), NOW());

-- ======================
-- FLIGHT SEATS
-- ======================
-- We insert seats for each flight (IDs 1-20)

-- Flight 1: GA-401 CGK→DPS
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(1, 'ECONOMY', 1250000, 150, 142, '["Snack", "Entertainment"]'),
(1, 'BUSINESS', 3500000, 30, 28, '["Full Meal", "Lounge Access", "Priority Boarding"]'),
(1, 'FIRST', 7500000, 8, 8, '["Suite", "Fine Dining", "Lounge", "Chauffeur"]');

-- Flight 2: GA-402 DPS→CGK
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(2, 'ECONOMY', 1250000, 150, 135, '["Snack", "Entertainment"]'),
(2, 'BUSINESS', 3500000, 30, 25, '["Full Meal", "Lounge Access", "Priority Boarding"]');

-- Flight 3: GA-201 CGK→JOG
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(3, 'ECONOMY', 850000, 150, 120, '["Snack"]'),
(3, 'BUSINESS', 2200000, 24, 22, '["Full Meal", "Lounge Access"]');

-- Flight 4: GA-301 CGK→SUB
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(4, 'ECONOMY', 950000, 150, 130, '["Snack", "Entertainment"]'),
(4, 'BUSINESS', 2800000, 24, 20, '["Full Meal", "Lounge Access", "Priority Boarding"]');

-- Flight 5: GA-501 SUB→DPS
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(5, 'ECONOMY', 750000, 150, 110, '["Snack"]'),
(5, 'BUSINESS', 2000000, 24, 22, '["Full Meal", "Lounge Access"]');

-- Flight 6: JT-690 CGK→DPS
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(6, 'ECONOMY', 650000, 180, 165, '["Snack"]'),
(6, 'BUSINESS', 1800000, 12, 10, '["Meal", "Priority Boarding"]');

-- Flight 7: JT-691 DPS→CGK
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(7, 'ECONOMY', 700000, 180, 150, '["Snack"]'),
(7, 'BUSINESS', 1900000, 12, 11, '["Meal", "Priority Boarding"]');

-- Flight 8: JT-570 CGK→SUB
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(8, 'ECONOMY', 550000, 180, 170, '["Snack"]');

-- Flight 9: JT-580 SUB→CGK
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(9, 'ECONOMY', 580000, 180, 160, '["Snack"]');

-- Flight 10: JT-250 CGK→JOG
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(10, 'ECONOMY', 480000, 180, 145, '["Snack"]');

-- Flight 11: QG-800 CGK→DPS
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(11, 'ECONOMY', 550000, 180, 160, '[]');

-- Flight 12: QG-801 DPS→CGK
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(12, 'ECONOMY', 580000, 180, 155, '[]');

-- Flight 13: QG-610 SUB→DPS
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(13, 'ECONOMY', 450000, 180, 170, '[]');

-- Flight 14: QG-340 CGK→KNO
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(14, 'ECONOMY', 980000, 180, 140, '["Snack"]');

-- Flight 15: ID-6570 CGK→DPS
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(15, 'ECONOMY', 1100000, 150, 130, '["Snack", "Entertainment"]'),
(15, 'BUSINESS', 3200000, 24, 20, '["Full Meal", "Lounge Access", "Priority Boarding"]');

-- Flight 16: ID-6571 DPS→CGK
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(16, 'ECONOMY', 1100000, 150, 125, '["Snack", "Entertainment"]'),
(16, 'BUSINESS', 3200000, 24, 22, '["Full Meal", "Lounge Access", "Priority Boarding"]');

-- Flight 17: ID-7300 CGK→LOP
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(17, 'ECONOMY', 1350000, 150, 140, '["Snack", "Entertainment"]'),
(17, 'BUSINESS', 3800000, 24, 23, '["Full Meal", "Lounge Access"]');

-- Flight 18: QZ-7520 CGK→DPS
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(18, 'ECONOMY', 450000, 180, 170, '[]');

-- Flight 19: QZ-7521 DPS→CGK
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(19, 'ECONOMY', 480000, 180, 165, '[]');

-- Flight 20: QZ-8400 SUB→LOP
INSERT IGNORE INTO flight_seats (flight_id, class, price, total_seats, available_seats, features) VALUES
(20, 'ECONOMY', 380000, 180, 175, '[]');

-- ======================
-- HOTELS
-- ======================
INSERT IGNORE INTO hotels (partner_id, name, city_id, description, address, rating, total_reviews, created_at, updated_at) VALUES
(6, 'The Mulia Resort & Villas', 2, 'A luxurious beachfront resort in Nusa Dua, Bali offering world-class amenities, pristine beaches, and exceptional dining experiences.', 'Jl. Raya Nusa Dua Selatan, Nusa Dua, Bali 80363', 4.85, 342, NOW(), NOW()),
(7, 'AYANA Resort Bali', 2, 'Perched above Jimbaran Bay, AYANA offers stunning ocean views, multiple pools, and the iconic Rock Bar for unforgettable sunset cocktails.', 'Jl. Karang Mas Sejahtera, Jimbaran, Bali 80364', 4.72, 528, NOW(), NOW()),
(8, 'Hotel Indonesia Kempinski Jakarta', 1, 'An iconic 5-star hotel in the heart of Jakarta, blending colonial elegance with modern luxury, located at the famous Bundaran HI.', 'Jl. M.H. Thamrin No.1, Jakarta Pusat 10310', 4.65, 891, NOW(), NOW()),
(9, 'Padma Resort Legian', 2, 'A tropical paradise on Legian Beach with lush gardens, infinity pools, and direct beach access for the perfect Bali getaway.', 'Jl. Padma No.1, Legian, Bali 80361', 4.50, 215, NOW(), NOW()),
(10, 'Tugu Hotel Malang', 6, 'A unique heritage hotel showcasing Indonesian art and antiques, offering a journey through the cultural history of Java in elegant surroundings.', 'Jl. Tugu No.3, Malang, Jawa Timur 65119', 4.40, 167, NOW(), NOW()),
(6, 'The Mulia Jakarta', 1, 'An urban luxury hotel in Senayan with spacious rooms, a rooftop bar, and easy access to Jakarta business and shopping districts.', 'Jl. Asia Afrika, Senayan, Jakarta 10270', 4.55, 423, NOW(), NOW()),
(7, 'AYANA Komodo Waecicu Beach', 7, 'An exclusive resort on the shores of Flores with views of the Komodo islands, offering diving, snorkeling, and nature adventures.', 'Waecicu Beach, Labuan Bajo, NTT', 4.78, 89, NOW(), NOW()),
(9, 'Padma Resort Ubud', 2, 'Nestled in the Payangan Valley, this resort offers breathtaking river valley views, infinity pools, and authentic Balinese experiences.', 'Banjar Carik, Desa Puhu, Payangan, Ubud, Bali 80572', 4.68, 312, NOW(), NOW()),
(8, 'Hotel Tentrem Yogyakarta', 3, 'A premier 5-star hotel in the heart of Yogyakarta blending Javanese heritage with modern comfort and exceptional service.', 'Jl. P. Mangkubumi No.72A, Yogyakarta 55233', 4.70, 445, NOW(), NOW()),
(10, 'Plataran Bromo', 4, 'A highland resort near Mount Bromo offering spectacular volcanic views, cool mountain air, and a gateway to adventure in East Java.', 'Desa Ngadiwono, Tosari, Pasuruan, Jawa Timur 67177', 4.35, 98, NOW(), NOW());

-- ======================
-- HOTEL IMAGES
-- ======================
INSERT IGNORE INTO hotel_images (hotel_id, url, is_primary) VALUES
-- The Mulia Resort (id=1)
(1, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 1),
(1, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 0),
(1, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', 0),
-- AYANA Resort (id=2)
(2, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 1),
(2, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 0),
-- Kempinski Jakarta (id=3)
(3, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 1),
(3, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 0),
-- Padma Resort Legian (id=4)
(4, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 1),
(4, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 0),
-- Tugu Hotel Malang (id=5)
(5, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', 1),
-- Mulia Jakarta (id=6)
(6, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 1),
-- AYANA Komodo (id=7)
(7, 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', 1),
-- Padma Ubud (id=8)
(8, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 1),
-- Tentrem Yogya (id=9)
(9, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', 1),
-- Plataran Bromo (id=10)
(10, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800', 1);

-- ======================
-- HOTEL FACILITIES (link table)
-- ======================
INSERT IGNORE INTO hotel_facilities (hotel_id, facility_id) VALUES
-- The Mulia: WiFi, Pool, Fitness, Restaurant, Spa, Parking, Beach
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 10),
-- AYANA: WiFi, Pool, Fitness, Restaurant, Spa, Shuttle, Beach
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 7), (2, 10),
-- Kempinski: WiFi, Pool, Fitness, Restaurant, Spa, Parking, Room Service
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 8),
-- Padma Legian: WiFi, Pool, Restaurant, Spa, Beach
(4, 1), (4, 2), (4, 4), (4, 5), (4, 10),
-- Tugu Malang: WiFi, Restaurant, Spa, Parking, AC
(5, 1), (5, 4), (5, 5), (5, 6), (5, 9),
-- Mulia Jakarta: WiFi, Pool, Fitness, Restaurant, Spa, Parking
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6),
-- AYANA Komodo: WiFi, Pool, Restaurant, Spa, Beach
(7, 1), (7, 2), (7, 4), (7, 5), (7, 10),
-- Padma Ubud: WiFi, Pool, Restaurant, Spa, Shuttle
(8, 1), (8, 2), (8, 4), (8, 5), (8, 7),
-- Tentrem Yogya: WiFi, Pool, Fitness, Restaurant, Spa, Parking
(9, 1), (9, 2), (9, 3), (9, 4), (9, 5), (9, 6),
-- Plataran Bromo: WiFi, Restaurant, Parking, AC
(10, 1), (10, 4), (10, 6), (10, 9);

-- ======================
-- ROOM TYPES
-- ======================
INSERT IGNORE INTO room_types (hotel_id, name, description, size_m2, max_guests, base_price, features, created_at, updated_at) VALUES
-- The Mulia Resort
(1, 'Grandeur Deluxe Room', 'Elegant room with ocean views and premium amenities', 65, 2, 4500000, '["Ocean View", "King Bed", "Rain Shower", "Minibar"]', NOW(), NOW()),
(1, 'Earl Suite', 'Spacious suite with separate living area and butler service', 110, 3, 8500000, '["Ocean View", "Living Room", "Butler Service", "Jacuzzi"]', NOW(), NOW()),
(1, 'The Mulia Villa', 'Private villa with pool and direct beach access', 300, 4, 25000000, '["Private Pool", "Beach Access", "Butler", "Kitchen"]', NOW(), NOW()),
-- AYANA Resort
(2, 'Resort View Room', 'Comfortable room overlooking tropical gardens', 43, 2, 2800000, '["Garden View", "Twin Bed", "Balcony"]', NOW(), NOW()),
(2, 'Ocean View Room', 'Stunning room with panoramic Jimbaran Bay views', 48, 2, 3800000, '["Ocean View", "King Bed", "Balcony", "Minibar"]', NOW(), NOW()),
(2, 'Ocean View Suite', 'Luxurious suite with separate lounge and bay views', 85, 3, 7200000, '["Ocean View", "Living Room", "Bathtub", "Minibar"]', NOW(), NOW()),
-- Kempinski Jakarta
(3, 'Grand Deluxe Room', 'Sophisticated room in the heart of Jakarta', 45, 2, 3200000, '["City View", "King Bed", "Rain Shower"]', NOW(), NOW()),
(3, 'Executive Suite', 'Premium suite with lounge access and city views', 75, 2, 5800000, '["City View", "Lounge Access", "Living Room", "Minibar"]', NOW(), NOW()),
-- Padma Legian
(4, 'Deluxe Room', 'Modern room with garden or pool views', 40, 2, 1800000, '["Garden View", "Twin Bed", "Balcony"]', NOW(), NOW()),
(4, 'Premier Suite', 'Spacious suite with direct pool access', 65, 3, 3500000, '["Pool View", "King Bed", "Living Room", "Bathtub"]', NOW(), NOW()),
-- Tugu Malang
(5, 'Babah Suite', 'Heritage-themed suite with antique furnishings', 50, 2, 1200000, '["Heritage Decor", "King Bed", "Bathtub"]', NOW(), NOW()),
(5, 'Apsara Suite', 'Luxurious suite inspired by Javanese royalty', 80, 2, 2200000, '["Javanese Art", "Living Room", "Bathtub", "Garden"]', NOW(), NOW()),
-- Mulia Jakarta
(6, 'Grandeur Room', 'Elegant room with Senayan views', 55, 2, 3000000, '["City View", "King Bed", "Rain Shower", "Minibar"]', NOW(), NOW()),
-- AYANA Komodo
(7, 'Komodo Ocean View', 'Room with stunning views of the Flores Sea', 40, 2, 3500000, '["Ocean View", "King Bed", "Balcony"]', NOW(), NOW()),
-- Padma Ubud
(8, 'Premier Room', 'Room with breathtaking river valley views', 48, 2, 2500000, '["Valley View", "King Bed", "Balcony", "Minibar"]', NOW(), NOW()),
-- Tentrem Yogya
(9, 'Deluxe Room', 'Modern room with Yogyakarta city views', 42, 2, 2000000, '["City View", "King Bed", "Rain Shower"]', NOW(), NOW()),
(9, 'Attic Suite', 'Top-floor suite with panoramic Merapi views', 90, 3, 5500000, '["Merapi View", "Living Room", "Bathtub", "Butler"]', NOW(), NOW()),
-- Plataran Bromo
(10, 'Highland Room', 'Cozy room with views of the volcanic landscape', 35, 2, 1500000, '["Mountain View", "Queen Bed", "Fireplace"]', NOW(), NOW()),
(10, 'Bromo Suite', 'Premium suite with sunrise viewing terrace', 60, 2, 3000000, '["Volcano View", "Terrace", "Bathtub", "Fireplace"]', NOW(), NOW());

-- ======================
-- ROOM AVAILABILITIES (next 30 days)
-- ======================

-- MySQL doesn't have generate_series or PL/pgSQL blocks.
-- We use a recursive CTE to generate dates and cross join with room_types.
INSERT IGNORE INTO room_availabilities (room_type_id, date, available_rooms, price_override)
WITH RECURSIVE dates AS (
    SELECT CURDATE() AS d
    UNION ALL
    SELECT d + INTERVAL 1 DAY FROM dates WHERE d < CURDATE() + INTERVAL 30 DAY
)
SELECT
    rt.id,
    dates.d,
    FLOOR(RAND() * 5 + 2),
    CASE
        WHEN DAYOFWEEK(dates.d) IN (1, 7) THEN rt.base_price * 1.2
        ELSE NULL
    END
FROM room_types rt
CROSS JOIN dates;

SELECT 'Seed completed!' AS status;

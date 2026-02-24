package database

import (
	"log"
	"os"

	"github.com/rifai27077/batago-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	// pgBouncer does not support prepared statements in transaction mode,
	// so we use PreferSimpleProtocol to avoid issues.
	DB, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	log.Println("Database connected successfully")
}

func Migrate() {
	// 1. Ensure essential tables exist using Migrator (Fail-safe)
	ensureTables := []struct {
		model interface{}
		name  string
	}{
		{&models.Notification{}, "notifications"},
		{&models.Favourite{}, "favourites"},
		{&models.Booking{}, "bookings"},
		{&models.Payment{}, "payments"},
		{&models.FlightBooking{}, "flight_bookings"},
		{&models.HotelBooking{}, "hotel_bookings"},
		{&models.Passenger{}, "passengers"},
	}

	for _, t := range ensureTables {
		if !DB.Migrator().HasTable(t.model) {
			log.Printf("Migrator: Creating %s table...", t.name)
			if err := DB.Migrator().CreateTable(t.model); err != nil {
				log.Printf("Migrator Error: Failed to create %s table: %v", t.name, err)
			} else {
				log.Printf("Migrator: Successfully created %s table", t.name)
			}
		}
	}

	// 2. Manual migration for specific columns or existing tables
	queries := []string{
		"ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;",
		"ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10);",
		"ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code VARCHAR(10);",
		"ALTER TABLE payments ADD COLUMN IF NOT EXISTS snap_token VARCHAR(512);",
		"ALTER TABLE payments ADD COLUMN IF NOT EXISTS redirect_url VARCHAR(1024);",
		"ALTER TABLE promotions ADD COLUMN IF NOT EXISTS code VARCHAR(50);",
		"ALTER TABLE promotions ADD COLUMN IF NOT EXISTS description TEXT;",
		"ALTER TABLE promotions ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);",
	}

	for _, query := range queries {
		if err := DB.Exec(query).Error; err != nil {
			log.Printf("Migration warning (query: %s): %v", query, err)
		} else {
			log.Printf("Migration success (query: %s)", query)
		}
	}
	log.Println("Manual migration executed successfully")
}

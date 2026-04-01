package database

import (
	"log"
	"os"
	"time"

	"github.com/rifai27077/batago-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// TruncateMonthSQL returns the SQL fragment for truncating a date to the month,
// supporting both PostgreSQL (DATE_TRUNC) and SQLite (strftime).
func TruncateMonthSQL(column string) string {
	if DB == nil {
		return "DATE_TRUNC('month', " + column + ")" // Default to Postgres
	}
	
	switch DB.Dialector.Name() {
	case "sqlite":
		return "strftime('%Y-%m-01', " + column + ")"
	default:
		return "DATE_TRUNC('month', " + column + ")"
	}
}

// ToCharMonthSQL returns the SQL fragment for formatting a date to 'Mon' (e.g. Jan, Feb).
func ToCharMonthSQL(column string) string {
	if DB == nil {
		return "TO_CHAR(" + column + ", 'Mon')"
	}

	switch DB.Dialector.Name() {
	case "sqlite":
		// SQLite Mon format isn't as trivial, we'll map digits to Mon in Go if needed,
		// but for simple grouping, YYYY-MM works. To satisfy the Mon expectation:
		return "CASE strftime('%m', " + column + ") " +
			"WHEN '01' THEN 'Jan' WHEN '02' THEN 'Feb' WHEN '03' THEN 'Mar' " +
			"WHEN '04' THEN 'Apr' WHEN '05' THEN 'May' WHEN '06' THEN 'Jun' " +
			"WHEN '07' THEN 'Jul' WHEN '08' THEN 'Aug' WHEN '09' THEN 'Sep' " +
			"WHEN '10' THEN 'Oct' WHEN '11' THEN 'Nov' WHEN '12' THEN 'Dec' END"
	default:
		return "TO_CHAR(" + column + ", 'Mon')"
	}
}

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
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Configure connection pool for optimal performance under load.
	// pgBouncer handles the actual pooling on the server side; these values
	// control the Go-side pool of connections to pgBouncer.
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get underlying sql.DB: ", err)
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)
	sqlDB.SetConnMaxIdleTime(2 * time.Minute)

	log.Println("Database connected successfully with connection pool configured")
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
		{&models.Promotion{}, "promotions"},
		{&models.Partner{}, "partners"},
		{&models.BankAccount{}, "bank_accounts"},
		{&models.PayoutSetting{}, "payout_settings"},
		{&models.Banner{}, "banners"},
		{&models.Article{}, "articles"},
		{&models.AdminActivityLog{}, "admin_activity_logs"},
	}

	for _, t := range ensureTables {
		hasTable := DB.Migrator().HasTable(t.model)
		log.Printf("Migrator: Table %s exists: %v", t.name, hasTable)
		if !hasTable {
			log.Printf("Migrator: Attempting to create %s table...", t.name)
			if err := DB.Migrator().CreateTable(t.model); err != nil {
				log.Printf("Migrator Error: Failed to create %s table: %v. Will try raw SQL...", t.name, err)
				
				// Raw SQL Fallback for promotions specifically
				if t.name == "promotions" {
					createTableSQL := `
						CREATE TABLE IF NOT EXISTS promotions (
							id BIGSERIAL PRIMARY KEY,
							created_at TIMESTAMPTZ,
							updated_at TIMESTAMPTZ,
							deleted_at TIMESTAMPTZ,
							partner_id BIGINT,
							name VARCHAR(255),
							code VARCHAR(50) UNIQUE,
							description TEXT,
							image_url VARCHAR(255),
							type VARCHAR(50),
							discount DECIMAL(5,2),
							status VARCHAR(50) DEFAULT 'active',
							start_date TIMESTAMPTZ,
							end_date TIMESTAMPTZ,
							listings JSONB,
							claims INTEGER DEFAULT 0,
							revenue DECIMAL(15,2) DEFAULT 0
						);
						CREATE INDEX IF NOT EXISTS idx_promotions_deleted_at ON promotions(deleted_at);
						CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
					`
					if err := DB.Exec(createTableSQL).Error; err != nil {
						log.Printf("Raw SQL Error: Failed to create promotions table: %v", err)
					} else {
						log.Printf("Raw SQL: Successfully created promotions table")
					}
				}
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
		"ALTER TABLE promotions ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);",
		"ALTER TABLE hotels ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'hotel';",
		"ALTER TABLE hotels ADD COLUMN IF NOT EXISTS base_price DECIMAL(15,2) DEFAULT 0;",
		"ALTER TABLE hotels ADD COLUMN IF NOT EXISTS room_count INTEGER DEFAULT 0;",
		"ALTER TABLE hotels ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);",
		"ALTER TABLE hotels ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);",
		"ALTER TABLE hotels ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';",
		"ALTER TABLE partners ADD COLUMN IF NOT EXISTS address TEXT;",
		"CREATE INDEX IF NOT EXISTS idx_hotels_type ON hotels(type);",
		"CREATE INDEX IF NOT EXISTS idx_hotels_status ON hotels(status);",
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

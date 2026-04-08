package database

import (
	"log"
	"os"
	"time"

	"github.com/rifai27077/batago-backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// TruncateMonthSQL returns the SQL fragment for truncating a date to the month,
// supporting both MySQL (DATE_FORMAT) and SQLite (strftime).
func TruncateMonthSQL(column string) string {
	if DB == nil {
		return "DATE_FORMAT(" + column + ", '%Y-%m-01')" // Default to MySQL
	}

	switch DB.Dialector.Name() {
	case "sqlite":
		return "strftime('%Y-%m-01', " + column + ")"
	default:
		return "DATE_FORMAT(" + column + ", '%Y-%m-01')"
	}
}

// ToCharMonthSQL returns the SQL fragment for formatting a date to 'Mon' (e.g. Jan, Feb).
func ToCharMonthSQL(column string) string {
	if DB == nil {
		return "DATE_FORMAT(" + column + ", '%b')"
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
		return "DATE_FORMAT(" + column + ", '%b')"
	}
}

func Connect() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Configure connection pool for optimal performance under load.
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
	// Let GORM safely attempt automatic migration first
	// (Skipping BankAccount and PayoutSetting here because GORM cascades FKs 
	// and crashes on legacy `partners` table FK mismatch Error 3780)

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
		{&models.PayoutRequest{}, "payout_requests"},
		{&models.Banner{}, "banners"},
		{&models.Article{}, "articles"},
		{&models.AdminActivityLog{}, "admin_activity_logs"},
		{&models.Aircraft{}, "aircrafts"},
		{&models.Availability{}, "availabilities"},
		{&models.PlatformSetting{}, "platform_settings"},
	}

	for _, t := range ensureTables {
		hasTable := DB.Migrator().HasTable(t.model)
		log.Printf("Migrator: Table %s exists: %v", t.name, hasTable)
		if !hasTable {
			log.Printf("Migrator: Attempting to create %s table...", t.name)
			if err := DB.Migrator().CreateTable(t.model); err != nil {
				log.Printf("Migrator Error: Failed to create %s table: %v. Will try raw SQL...", t.name, err)

				// Raw SQL Fallback for essential tables
				if t.name == "promotions" {
					createTableSQL := `
						CREATE TABLE IF NOT EXISTS promotions (
							id BIGINT AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME,
							updated_at DATETIME,
							deleted_at DATETIME,
							partner_id BIGINT,
							name VARCHAR(255),
							code VARCHAR(50) UNIQUE,
							description TEXT,
							image_url VARCHAR(255),
							type VARCHAR(50),
							discount DECIMAL(5,2),
							status VARCHAR(50) DEFAULT 'active',
							start_date DATETIME,
							end_date DATETIME,
							listings JSON,
							claims INTEGER DEFAULT 0,
							revenue DECIMAL(15,2) DEFAULT 0,
							INDEX idx_promotions_deleted_at (deleted_at),
							INDEX idx_promotions_code (code)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
					`
					DB.Exec(createTableSQL)
				}
				if t.name == "platform_settings" {
					createTableSQL := `
						CREATE TABLE IF NOT EXISTS platform_settings (
							id BIGINT AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME,
							updated_at DATETIME,
							deleted_at DATETIME,
							` + "`key`" + ` VARCHAR(100) UNIQUE,
							value TEXT,
							INDEX idx_settings_key (` + "`key`" + `)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
					`
					DB.Exec(createTableSQL)
				}
				if t.name == "notifications" {
					createTableSQL := `
						CREATE TABLE IF NOT EXISTS notifications (
							id BIGINT AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME,
							updated_at DATETIME,
							deleted_at DATETIME,
							user_id BIGINT,
							type VARCHAR(50) DEFAULT 'info',
							title VARCHAR(255),
							message TEXT,
							` + "`read`" + ` BOOLEAN DEFAULT FALSE,
							link VARCHAR(255),
							INDEX idx_notifications_user_id (user_id),
							INDEX idx_notifications_deleted_at (deleted_at)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
					`
					DB.Exec(createTableSQL)
				}
				if t.name == "favourites" {
					createTableSQL := `
						CREATE TABLE IF NOT EXISTS favourites (
							id BIGINT AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME,
							updated_at DATETIME,
							deleted_at DATETIME,
							user_id BIGINT,
							target_id BIGINT,
							type VARCHAR(50),
							INDEX idx_favourites_user_target (user_id, target_id),
							INDEX idx_favourites_deleted_at (deleted_at)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
					`
					DB.Exec(createTableSQL)
				}
				if t.name == "aircrafts" {
					createTableSQL := `
						CREATE TABLE IF NOT EXISTS aircrafts (
							id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME(3),
							updated_at DATETIME(3),
							deleted_at DATETIME(3),
							partner_id BIGINT UNSIGNED,
							registration VARCHAR(20) UNIQUE,
							model VARCHAR(100),
							capacity INTEGER,
							year_of_manufacture VARCHAR(10),
							status VARCHAR(50) DEFAULT 'active',
							next_maintenance_date DATETIME(3),
							INDEX idx_aircrafts_deleted_at (deleted_at),
							INDEX idx_aircrafts_partner_id (partner_id)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
					`
					DB.Exec(createTableSQL)
				}
				if t.name == "availabilities" {
					createTableSQL := `
						CREATE TABLE IF NOT EXISTS availabilities (
							id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME(3),
							updated_at DATETIME(3),
							deleted_at DATETIME(3),
							partner_id BIGINT UNSIGNED,
							date DATETIME(3),
							status VARCHAR(50),
							price DECIMAL(15,2),
							room_type_id BIGINT UNSIGNED,
							flight_id BIGINT UNSIGNED,
							INDEX idx_availabilities_deleted_at (deleted_at),
							INDEX idx_availabilities_partner_date (partner_id, date)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
					`
					DB.Exec(createTableSQL)
				}
				if t.name == "bank_accounts" {
					DB.Exec(`
						CREATE TABLE IF NOT EXISTS bank_accounts (
							id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME(3),
							updated_at DATETIME(3),
							deleted_at DATETIME(3),
							partner_id BIGINT UNSIGNED,
							bank_name VARCHAR(100),
							account_number VARCHAR(100),
							account_holder_name VARCHAR(255),
							is_primary TINYINT(1) DEFAULT 1,
							INDEX idx_bank_accounts_deleted_at (deleted_at),
							INDEX idx_bank_accounts_partner_id (partner_id)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
					`)
				}
				if t.name == "payout_settings" {
					DB.Exec(`
						CREATE TABLE IF NOT EXISTS payout_settings (
							id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME(3),
							updated_at DATETIME(3),
							deleted_at DATETIME(3),
							partner_id BIGINT UNSIGNED,
							schedule VARCHAR(50) DEFAULT 'Weekly',
							threshold_amount DECIMAL(15,2) DEFAULT 500000.00,
							INDEX idx_payout_settings_deleted_at (deleted_at),
							UNIQUE INDEX idx_payout_settings_partner_id (partner_id)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
					`)
				}
				if t.name == "payout_requests" {
					DB.Exec(`
						CREATE TABLE IF NOT EXISTS payout_requests (
							id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
							created_at DATETIME(3),
							updated_at DATETIME(3),
							deleted_at DATETIME(3),
							partner_id BIGINT UNSIGNED,
							amount DECIMAL(15,2),
							status VARCHAR(50) DEFAULT 'pending',
							bank_account_id BIGINT UNSIGNED,
							requested_at DATETIME(3),
							processed_at DATETIME(3) NULL,
							INDEX idx_payout_requests_deleted_at (deleted_at),
							INDEX idx_payout_requests_partner_id (partner_id)
						) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
					`)
				}
			} else {
				log.Printf("Migrator: Successfully created %s table", t.name)
			}
		}
	}

	// 2. Manual migration for specific columns or existing tables
	// MySQL does not support ADD COLUMN IF NOT EXISTS, so we use a helper
	// that checks information_schema before adding.
	addColumnIfNotExists := func(table, column, colDef string) {
		var count int64
		DB.Raw("SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?", table, column).Scan(&count)
		if count == 0 {
			sql := "ALTER TABLE " + table + " ADD COLUMN " + column + " " + colDef
			if err := DB.Exec(sql).Error; err != nil {
				log.Printf("Migration warning (add column %s.%s): %v", table, column, err)
			} else {
				log.Printf("Migration success: Added column %s.%s", table, column)
			}
		}
	}

	addColumnIfNotExists("users", "is_verified", "TINYINT(1) DEFAULT 0")
	addColumnIfNotExists("users", "verification_code", "VARCHAR(10)")
	addColumnIfNotExists("users", "reset_code", "VARCHAR(10)")
	addColumnIfNotExists("payments", "snap_token", "VARCHAR(512)")
	addColumnIfNotExists("payments", "redirect_url", "VARCHAR(1024)")
	addColumnIfNotExists("payments", "paid_at", "DATETIME(3) NULL")
	
	// Backfill paid_at from updated_at for PAID payments that have it NULL
	DB.Exec("UPDATE payments SET paid_at = updated_at WHERE status = 'PAID' AND paid_at IS NULL")

	addColumnIfNotExists("promotions", "code", "VARCHAR(50)")
	addColumnIfNotExists("promotions", "image_url", "VARCHAR(255)")
	addColumnIfNotExists("hotels", "type", "VARCHAR(50) DEFAULT 'hotel'")
	addColumnIfNotExists("hotels", "base_price", "DECIMAL(15,2) DEFAULT 0")
	addColumnIfNotExists("hotels", "room_count", "INTEGER DEFAULT 0")
	addColumnIfNotExists("hotels", "latitude", "DECIMAL(10, 8)")
	addColumnIfNotExists("hotels", "longitude", "DECIMAL(11, 8)")
	addColumnIfNotExists("hotels", "status", "VARCHAR(20) DEFAULT 'active'")
	addColumnIfNotExists("partners", "address", "TEXT")

	// Create indexes (MySQL uses CREATE INDEX IF NOT EXISTS in 8.0+, but for compatibility we ignore errors)
	indexQueries := []string{
		"CREATE INDEX idx_hotels_type ON hotels(type)",
		"CREATE INDEX idx_hotels_status ON hotels(status)",
	}
	for _, query := range indexQueries {
		if err := DB.Exec(query).Error; err != nil {
			log.Printf("Migration index warning (query: %s): %v", query, err)
		} else {
			log.Printf("Migration index success (query: %s)", query)
		}
	}

	log.Println("Manual migration executed successfully")
}

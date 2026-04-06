package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	seedSQL, err := os.ReadFile("seeds/seed.sql")
	if err != nil {
		log.Fatalf("Failed to read seed file: %v", err)
	}

	log.Println("Running seed...")
	_, err = db.Exec(string(seedSQL))
	if err != nil {
		log.Fatalf("Seed failed: %v", err)
	}

	log.Println("✓ Seed completed successfully!")
}

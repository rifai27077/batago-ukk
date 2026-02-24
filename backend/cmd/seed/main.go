package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	db, err := sql.Open("postgres", dsn)
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

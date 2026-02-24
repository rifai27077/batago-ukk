package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	_ = godotenv.Load()

	action := flag.String("action", "up", "Migration action: up, down, force, version")
	steps := flag.Int("steps", 0, "Number of steps (for up/down with steps)")
	forceV := flag.Int("force-version", -1, "Force set version (for fixing dirty state)")
	flag.Parse()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	m, err := migrate.New("file://migrations", dsn)
	if err != nil {
		log.Fatalf("Failed to create migrate instance: %v", err)
	}

	switch *action {
	case "up":
		if *steps > 0 {
			err = m.Steps(*steps)
		} else {
			err = m.Up()
		}
	case "down":
		if *steps > 0 {
			err = m.Steps(-(*steps))
		} else {
			err = m.Down()
		}
	case "force":
		if *forceV < 0 {
			log.Fatal("Please provide -force-version flag")
		}
		err = m.Force(*forceV)
	case "version":
		version, dirty, verr := m.Version()
		if verr != nil {
			log.Fatalf("Failed to get version: %v", verr)
		}
		fmt.Printf("Version: %d, Dirty: %v\n", version, dirty)
		return
	default:
		log.Fatalf("Unknown action: %s", *action)
	}

	if err != nil {
		if err == migrate.ErrNoChange {
			log.Println("No migration changes to apply")
		} else {
			log.Fatalf("Migration failed: %v", err)
		}
	} else {
		log.Printf("Migration '%s' completed successfully", *action)
	}
}

package db

import (
	"calendario/backend/config"
	"database/sql"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	_ "github.com/lib/pq"
)

// InitDB inicializa la conexión a la base de datos
var DB *gorm.DB

func InitDB(cfg *config.Config) {
	// Crear la base de datos si no existe
	createDB(cfg)

	// Conectar a la base de datos
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Bogota",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBPort,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	DB = db
	log.Println("Database connection established")
}

func createDB(cfg *config.Config) {
	// Conectar a PostgreSQL sin especificar la base de datos
	dsn := fmt.Sprintf("host=%s user=%s password=%s port=%s sslmode=disable TimeZone=America/Bogota",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBPort,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	// Crear la base de datos si no existe
	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE %s", cfg.DBName))
	if err != nil && err.Error() != fmt.Sprintf("pq: database \"%s\" already exists", cfg.DBName) {
		log.Fatalf("Failed to create database: %v", err)
	}

	log.Println("Database created or already exists")
}

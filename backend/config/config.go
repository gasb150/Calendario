package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config estructura para almacenar la configuración de la aplicación
type Config struct {
	CalendarificAPIKey string
	Port               string
	DBHost             string
	DBUser             string
	DBPassword         string
	DBName             string
	DBPort             string
}

// LoadConfig carga la configuración desde el archivo .env
func LoadConfig() *Config {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	config := &Config{
		CalendarificAPIKey: os.Getenv("CALENDARIFIC_API_KEY"),
		Port:               os.Getenv("PORT"),
		DBHost:             os.Getenv("DB_HOST"),
		DBUser:             os.Getenv("DB_USER"),
		DBPassword:         os.Getenv("DB_PASSWORD"),
		DBName:             os.Getenv("DB_NAME"),
		DBPort:             os.Getenv("DB_PORT"),
	}

	return config
}

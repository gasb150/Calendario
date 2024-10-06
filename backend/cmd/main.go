package main

import (
	"calendario/backend/api/routes"
	"calendario/backend/config"
	"calendario/backend/db"
	"calendario/backend/models"
	"log"
	"net/http"
)

func main() {

	cfg := config.LoadConfig()
	db.InitDB(cfg)

	// Migrar el esquema de la base de datos
	db.DB.AutoMigrate(&models.Obligation{})

	router := routes.SetupRoutes()
	log.Printf("Server running on port %s", cfg.Port)

	log.Fatal(http.ListenAndServe(":"+cfg.Port, router))
}

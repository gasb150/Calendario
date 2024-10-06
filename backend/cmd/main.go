package main

import (
	"calendario/backend/api/routes"
	"calendario/backend/config"
	"calendario/backend/db"
	"calendario/backend/models"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {

	cfg := config.LoadConfig()
	db.InitDB(cfg)

	// Migrar el esquema de la base de datos
	db.DB.AutoMigrate(&models.Obligation{})

	router := routes.SetupRoutes()

	// Configurar CORS para permitir solicitudes desde el frontend
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Reemplaza con la URL de tu frontend
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(router)

	log.Printf("Server running on port %s", cfg.Port)

	log.Fatal(http.ListenAndServe(":"+cfg.Port, corsHandler))
}

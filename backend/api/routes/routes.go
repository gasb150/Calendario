package routes

import (
	"calendario/backend/api/handlers"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/calendar", handlers.GetCalendarHandler).Methods("GET")
	router.HandleFunc("/obligations", handlers.GetObligationsHandler).Methods("GET")
	router.HandleFunc("/obligations", handlers.InsertObligationHandler).Methods("POST")

	return router
}

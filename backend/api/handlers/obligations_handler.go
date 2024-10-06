package handlers

import (
	"calendario/backend/internal/calendar"
	"calendario/backend/pkg/utils"
	"encoding/json"
	"net/http"
)

// InsertObligationHandler maneja las solicitudes POST para insertar una nueva obligación
func InsertObligationHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name         string `json:"name"`
		Icon         string `json:"icon"`
		DueDate      string `json:"due_date"`
		StartingDate string `json:"starting_date"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, utils.HandleError(err), http.StatusBadRequest)
		return
	}

	dueDate, err := utils.ParseDate(req.DueDate)
	if err != nil {
		http.Error(w, utils.HandleError(err), http.StatusBadRequest)
		return
	}

	startingDate, err := utils.ParseDate(req.StartingDate)
	if err != nil {
		http.Error(w, utils.HandleError(err), http.StatusBadRequest)
		return
	}

	obligation, err := calendar.InsertObligation(req.Name, req.Icon, startingDate, dueDate)
	if err != nil {
		http.Error(w, utils.HandleError(err), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(obligation)
}

// GetObligationsHandler maneja las solicitudes GET para obtener las obligaciones
func GetObligationsHandler(w http.ResponseWriter, r *http.Request) {
	obligations, err := calendar.GetObligations()

	if err != nil {
		http.Error(w, utils.HandleError(err), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(obligations)
}

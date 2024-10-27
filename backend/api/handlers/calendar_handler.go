package handlers

import (
	"calendario/backend/internal/calendar"
	"encoding/json"
	"net/http"
)

func GetCalendarHandler(w http.ResponseWriter, r *http.Request) {
	calendar, err := calendar.GetCalendar()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(calendar)
}

func GetHolidaysHandler(w http.ResponseWriter, r *http.Request) {
	holidays, err := calendar.GetHolidays()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(holidays)
}

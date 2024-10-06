package utils

import (
	"errors"
	"time"
)

// IsHoliday verifica si una fecha es un día festivo
func IsHoliday(date time.Time, holidays map[time.Time]string) (bool, string) {
	if holidayName, exists := holidays[date]; exists {
		return true, holidayName
	}
	return false, ""
}

// FormatDate formatea una fecha en un string
func FormatDate(date time.Time) string {
	return date.Format("2006-01-02")
}

// ParseDate convierte un string en una fecha
func ParseDate(dateStr string) (time.Time, error) {
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return time.Time{}, errors.New("invalid date format, expected YYYY-MM-DD")
	}
	return date, nil
}

// HandleError maneja errores comunes y devuelve un mensaje de error
func HandleError(err error) string {
	if err != nil {
		return err.Error()
	}
	return "An unknown error occurred"
}

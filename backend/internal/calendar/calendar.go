package calendar

import (
	"calendario/backend/db"
	"calendario/backend/models"
	"calendario/backend/pkg/utils"

	"time"
)

// InsertObligation inserta una nueva obligación en la base de datos
func InsertObligation(name, icon string, startingDate, dueDate time.Time) (*models.Obligation, error) {
	obligation := &models.Obligation{
		Name:         name,
		Icon:         icon,
		StartingDate: startingDate,
		DueDate:      dueDate,
	}

	result := db.DB.Create(obligation)
	if result.Error != nil {
		return nil, result.Error
	}

	return obligation, nil
}

// GetObligations obtiene las obligaciones desde la base de datos
func GetObligations() ([]models.Obligation, error) {
	var obligations []models.Obligation
	result := db.DB.Find(&obligations)
	if result.Error != nil {
		return nil, result.Error
	}

	return obligations, nil
}

// GetCalendar devuelve una lista de días del calendario
func GetCalendar() ([]models.Calendar, error) {
	holidays := GetHolidays()
	calendar := []models.Calendar{}
	holidayMap := make(map[time.Time]string)
	for _, holiday := range holidays {
		holidayMap[holiday.Date] = holiday.Name
	}
	obligations, err := GetObligations()
	if err != nil {
		return nil, err
	}

	for i := 0; i < 365; i++ {
		date := time.Now().AddDate(0, 0, i)

		holiday, holidayName := utils.IsHoliday(date, holidayMap)

		// Filtrar obligaciones para la fecha actual
		dailyObligations := []models.Obligation{}
		for _, obligation := range obligations {
			if obligation.StartingDate.Before(date) && obligation.DueDate.After(date) {
				dailyObligations = append(dailyObligations, obligation)
			}
		}

		calendar = append(calendar, models.Calendar{
			Date:        date,
			Holiday:     holiday,
			HolidayName: holidayName,
			Obligations: dailyObligations,
		})
	}

	return calendar, nil
}

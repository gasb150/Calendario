package calendar

import (
	"calendario/backend/config"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// Holiday representa un día festivo
type Holiday struct {
	Name string
	Date time.Time
}

// CalendarificResponse representa la respuesta de la API de Calendarific
type CalendarificResponse struct {
	Response struct {
		Holidays []struct {
			Name string `json:"name"`
			Date struct {
				Iso string `json:"iso"`
			} `json:"date"`
		} `json:"holidays"`
	} `json:"response"`
}

// GetHolidays devuelve una lista de festivos en Colombia usando la API de Calendarific
func GetHolidays() ([]Holiday, error) {
	apiKey := config.LoadConfig().CalendarificAPIKey
	url := fmt.Sprintf("https://calendarific.com/api/v2/holidays?&api_key=%s&country=CO&year=%d", apiKey, time.Now().Year())

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("Error fetching holidays:", err)
		return []Holiday{}, err
	}
	defer resp.Body.Close()

	var apiResponse CalendarificResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		fmt.Println("Error decoding response:", err)
		return []Holiday{}, err
	}

	var holidays []Holiday
	for _, h := range apiResponse.Response.Holidays {
		date, _ := time.Parse("2006-01-02", h.Date.Iso)
		holidays = append(holidays, Holiday{Name: h.Name, Date: date})
	}

	return holidays, nil
}

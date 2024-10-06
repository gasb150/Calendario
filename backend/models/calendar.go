package models

import (
	"time"
)

// Calendar representa un calendario con obligaciones
type Calendar struct {
	Date        time.Time
	Holiday     bool
	HolidayName string
	Obligations []Obligation
}

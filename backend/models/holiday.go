package models

import "time"

// Holiday representa un día festivo
type Holiday struct {
	Date time.Time
	Name string
}

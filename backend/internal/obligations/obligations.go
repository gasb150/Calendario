package calendar

import (
	"calendario/backend/db"
	"time"

	"gorm.io/gorm"
)

// Obligation representa una obligación
type Obligation struct {
	ID           uint      `gorm:"primaryKey"`
	Name         string    `gorm:"not null"`
	Icon         string    `gorm:"not null"`
	DueDate      time.Time `gorm:"not null"`
	StartingDate time.Time `gorm:"not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}

// InsertObligation inserta una nueva obligación en la base de datos
func InsertObligation(name, icon string, startingDate, dueDate time.Time) (*Obligation, error) {
	obligation := &Obligation{
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

// GetObligations devuelve una lista de obligaciones
func GetObligations() ([]Obligation, error) {
	var obligations []Obligation
	result := db.DB.Find(&obligations)
	if result.Error != nil {
		return nil, result.Error
	}

	return obligations, nil
}

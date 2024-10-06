package models

import (
	"time"

	"gorm.io/gorm"
)

// Obligation representa una obligación
type Obligation struct {
	ID           uint      `gorm:"primaryKey"`
	Name         string    `gorm:"not null"`
	Icon         string    `gorm:"not null"`
	StartingDate time.Time `gorm:"not null"`
	DueDate      time.Time `gorm:"not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}

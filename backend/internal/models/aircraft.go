package models

import (
	"time"

	"gorm.io/gorm"
)

type AircraftStatus string

const (
	AircraftStatusActive      AircraftStatus = "active"
	AircraftStatusMaintenance AircraftStatus = "maintenance"
	AircraftStatusRetired     AircraftStatus = "retired"
)

type Aircraft struct {
	gorm.Model
	PartnerID           uint           `json:"partner_id"`
	Partner             Partner        `gorm:"foreignKey:PartnerID" json:"-"`
	Registration        string         `gorm:"type:varchar(20);uniqueIndex" json:"registration"`
	AircraftModel       string         `gorm:"column:model;type:varchar(100)" json:"model"`
	Capacity            int            `json:"capacity"`
	YearOfManufacture   string         `gorm:"type:varchar(10)" json:"yom"`
	Status              AircraftStatus `gorm:"type:varchar(50);default:'active'" json:"status"`
	NextMaintenanceDate *time.Time     `json:"next_maintenance"`
}

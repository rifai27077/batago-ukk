package models

import (
	"time"

	"gorm.io/gorm"
)

type PartnerRole string

const (
	PartnerRoleOwner   PartnerRole = "OWNER"
	PartnerRoleAdmin   PartnerRole = "ADMIN"
	PartnerRoleManager PartnerRole = "MANAGER"
	PartnerRoleStaff   PartnerRole = "STAFF"
)

type PartnerStaff struct {
	gorm.Model
	PartnerID uint         `json:"partner_id"`
	Partner   Partner      `gorm:"foreignKey:PartnerID" json:"-"`
	UserID    uint         `json:"user_id"`
	User      User         `gorm:"foreignKey:UserID" json:"user"`
	Role      PartnerRole `gorm:"type:varchar(50);default:'STAFF'" json:"role"`
}

type AvailabilityStatus string

const (
	AvailabilityAvailable AvailabilityStatus = "available"
	AvailabilityBooked    AvailabilityStatus = "booked"
	AvailabilityBlocked   AvailabilityStatus = "blocked"
	AvailabilityPending   AvailabilityStatus = "pending"
)

type Availability struct {
	gorm.Model
	PartnerID uint               `json:"partner_id"`
	Partner   Partner            `gorm:"foreignKey:PartnerID" json:"-"`
	Date      time.Time          `json:"date"`
	Status    AvailabilityStatus `gorm:"type:varchar(50)" json:"status"`
	Price     float64            `gorm:"type:decimal(15,2)" json:"price"`
	// For hotels, link to room type
	RoomTypeID *uint     `json:"room_type_id,omitempty"`
	RoomType   *RoomType `gorm:"foreignKey:RoomTypeID" json:"room_type,omitempty"`
	// For airlines, link to flight
	FlightID *uint   `json:"flight_id,omitempty"`
	Flight   *Flight `gorm:"foreignKey:FlightID" json:"flight,omitempty"`
}

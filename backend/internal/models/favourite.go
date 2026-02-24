package models

import (
	"gorm.io/gorm"
)

type FavouriteType string

const (
	FavouriteTypeFlight FavouriteType = "flight"
	FavouriteTypeHotel  FavouriteType = "hotel"
)

type Favourite struct {
	gorm.Model
	UserID   uint          `json:"user_id"`
	User     User          `gorm:"foreignKey:UserID" json:"-"`
	Type     FavouriteType `gorm:"type:varchar(50)" json:"type"`
	FlightID *uint         `json:"flight_id,omitempty"`
	Flight   *Flight       `gorm:"foreignKey:FlightID" json:"flight,omitempty"`
	HotelID  *uint         `json:"hotel_id,omitempty"`
	Hotel    *Hotel        `gorm:"foreignKey:HotelID" json:"hotel,omitempty"`
}

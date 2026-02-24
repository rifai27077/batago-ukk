package models

import (
	"time"

	"gorm.io/gorm"
)

type Airport struct {
	gorm.Model
	Code     string `gorm:"uniqueIndex;type:varchar(10)" json:"code"`
	Name     string `gorm:"type:varchar(255)" json:"name"`
	City     string `gorm:"type:varchar(255)" json:"city"`
	Country  string `gorm:"type:varchar(255)" json:"country"`
	Timezone string `gorm:"type:varchar(50)" json:"timezone"`
}

type Flight struct {
	gorm.Model
	PartnerID          uint      `json:"partner_id"`
	Partner            Partner   `gorm:"foreignKey:PartnerID" json:"partner"`
	FlightNumber       string    `gorm:"type:varchar(50)" json:"flight_number"`
	Airline            string    `gorm:"type:varchar(255)" json:"airline"`
	DepartureAirportID uint      `json:"departure_airport_id"`
	DepartureAirport   Airport   `gorm:"foreignKey:DepartureAirportID" json:"departure_airport"`
	ArrivalAirportID   uint      `json:"arrival_airport_id"`
	ArrivalAirport     Airport   `gorm:"foreignKey:ArrivalAirportID" json:"arrival_airport"`
	DepartureTime      time.Time `json:"departure_time"`
	ArrivalTime        time.Time `json:"arrival_time"`
	Duration           int       `json:"duration"` // in minutes
	BaggageAllowanceKg int       `json:"baggage_allowance_kg"`
}

type FlightClass string

const (
	FlightClassEconomy  FlightClass = "Economy"
	FlightClassBusiness FlightClass = "Business"
	FlightClassFirst    FlightClass = "First"
)

type FlightBooking struct {
	gorm.Model
	BookingID uint        `gorm:"uniqueIndex" json:"booking_id"`
	Booking   Booking     `gorm:"foreignKey:BookingID" json:"booking"`
	FlightID  uint        `json:"flight_id"`
	Flight    Flight      `gorm:"foreignKey:FlightID" json:"flight"`
	Class     FlightClass `gorm:"type:varchar(50)" json:"class"`
}

type FlightSeat struct {
	gorm.Model
	FlightID       uint        `json:"flight_id"`
	Flight         Flight      `gorm:"foreignKey:FlightID" json:"flight"`
	Class          FlightClass `gorm:"type:varchar(50)" json:"class"`
	Price          float64     `gorm:"type:decimal(15,2)" json:"price"`
	TotalSeats     int         `json:"total_seats"`
	AvailableSeats int         `json:"available_seats"`
	Features       string      `gorm:"type:json" json:"features"`
}

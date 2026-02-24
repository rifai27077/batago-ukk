package models

import (
	"time"

	"gorm.io/gorm"
)

type Hotel struct {
	gorm.Model
	PartnerID    uint       `json:"partner_id"`
	Partner      Partner    `gorm:"foreignKey:PartnerID" json:"partner"`
	Name         string     `gorm:"type:varchar(255)" json:"name"`
	CityID       uint       `json:"city_id"`
	City         City       `gorm:"foreignKey:CityID" json:"city"`
	Description  string     `gorm:"type:text" json:"description"`
	Address      string     `gorm:"type:text" json:"address"`
	Type         string     `gorm:"type:varchar(50)" json:"type"`
	BasePrice    float64    `gorm:"type:decimal(15,2)" json:"base_price"`
	RoomCount    int        `json:"room_count"`
	Rating       float64    `gorm:"type:decimal(3,2)" json:"rating"`
	TotalReviews int        `json:"total_reviews"`
	Latitude     *float64   `gorm:"type:decimal(10,8)" json:"latitude"`
	Longitude    *float64   `gorm:"type:decimal(11,8)" json:"longitude"`
	Status       string     `gorm:"type:varchar(20);default:'active'" json:"status"`
	Facilities   []Facility `gorm:"many2many:hotel_facilities;" json:"facilities"`
	Images       []HotelImage `gorm:"foreignKey:HotelID" json:"images"`
}

type HotelImage struct {
	gorm.Model
	HotelID   uint   `json:"hotel_id"`
	URL       string `gorm:"type:varchar(255)" json:"url"`
	IsPrimary bool   `gorm:"default:false" json:"is_primary"`
}

type RoomType struct {
	gorm.Model
	HotelID     uint        `json:"hotel_id"`
	Hotel       Hotel       `gorm:"foreignKey:HotelID" json:"hotel"`
	Name        string      `gorm:"type:varchar(255)" json:"name"`
	Description string      `gorm:"type:text" json:"description"`
	SizeM2      int         `json:"size_m2"`
	MaxGuests   int         `json:"max_guests"`
	BasePrice   float64     `gorm:"type:decimal(15,2)" json:"base_price"`
	Features    string      `gorm:"type:json" json:"features"`
	Images      []RoomImage `gorm:"foreignKey:RoomID" json:"images"`
}

type RoomImage struct {
	gorm.Model
	RoomID uint   `json:"room_id"`
	URL    string `gorm:"type:varchar(255)" json:"url"`
}

type RoomAvailability struct {
	gorm.Model
	RoomTypeID     uint      `json:"room_type_id"`
	RoomType       RoomType  `gorm:"foreignKey:RoomTypeID" json:"room_type"`
	Date           time.Time `gorm:"type:date" json:"date"`
	AvailableRooms int       `json:"available_rooms"`
	PriceOverride  *float64  `gorm:"type:decimal(15,2)" json:"price_override"`
}

type HotelBooking struct {
	gorm.Model
	BookingID  uint      `gorm:"uniqueIndex" json:"booking_id"`
	Booking    Booking   `gorm:"foreignKey:BookingID" json:"-"`
	RoomTypeID uint      `json:"room_type_id"`
	RoomType   RoomType  `gorm:"foreignKey:RoomTypeID" json:"room_type"`
	CheckIn    time.Time `gorm:"type:date" json:"check_in"`
	CheckOut   time.Time `gorm:"type:date" json:"check_out"`
	Guests     int       `json:"guests"`
}

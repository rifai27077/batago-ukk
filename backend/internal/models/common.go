package models

import (
	"gorm.io/gorm"
)

type City struct {
	gorm.Model
	Name      string `gorm:"type:varchar(255)" json:"name"`
	Country   string `gorm:"type:varchar(255)" json:"country"`
	ImageURL  string `gorm:"type:varchar(255)" json:"image_url"`
	IsPopular bool   `gorm:"default:false" json:"is_popular"`
}

type Facility struct {
	gorm.Model
	Name string `gorm:"type:varchar(255)" json:"name"`
	Icon string `gorm:"type:varchar(255)" json:"icon"`
}

type Review struct {
	gorm.Model
	BookingID uint    `gorm:"uniqueIndex" json:"booking_id"`
	Booking   Booking `gorm:"foreignKey:BookingID" json:"booking"`
	UserID    uint    `json:"user_id"`
	User      User    `gorm:"foreignKey:UserID" json:"user"`
	Rating    int     `json:"rating"`
	Comment   string  `gorm:"type:text" json:"comment"`
	Reply     *string `gorm:"type:text" json:"reply"`
}

type PlatformSetting struct {
	gorm.Model
	Key   string `gorm:"type:varchar(100);uniqueIndex" json:"key"`
	Value string `gorm:"type:text" json:"value"`
}

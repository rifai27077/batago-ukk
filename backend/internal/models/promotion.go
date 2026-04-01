package models

import (
	"time"

	"gorm.io/gorm"
)

type PromotionType string

const (
	PromotionFlashSale  PromotionType = "flash_sale"
	PromotionLastMinute PromotionType = "last_minute"
	PromotionEarlyBird  PromotionType = "early_bird"
	PromotionSeasonal   PromotionType = "seasonal"
)

type PromotionStatus string

const (
	PromotionActive    PromotionStatus = "active"
	PromotionScheduled PromotionStatus = "scheduled"
	PromotionPaused    PromotionStatus = "paused"
	PromotionExpired   PromotionStatus = "expired"
)

type Promotion struct {
	gorm.Model
	PartnerID uint            `json:"partner_id"`
	Partner   Partner         `gorm:"foreignKey:PartnerID" json:"partner"`
	Name        string          `gorm:"type:varchar(255)" json:"name"`
	Code        string          `gorm:"type:varchar(50);uniqueIndex" json:"code"`
	Description string          `gorm:"type:text" json:"description"`
	ImageURL    string          `gorm:"type:varchar(255)" json:"image_url"`
	Type        PromotionType   `gorm:"type:varchar(50)" json:"type"`
	Discount  float64         `gorm:"type:decimal(5,2)" json:"discount"`
	Status    PromotionStatus `gorm:"type:varchar(50);default:active" json:"status"`
	StartDate time.Time       `json:"start_date"`
	EndDate   time.Time       `json:"end_date"`
	Listings  []uint          `gorm:"serializer:json" json:"listings"` // List of room/route IDs this promo applies to
	Claims    int             `gorm:"default:0" json:"claims"`
	Revenue   float64         `gorm:"type:decimal(15,2);default:0" json:"revenue"`
}

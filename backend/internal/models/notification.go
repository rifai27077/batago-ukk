package models

import (
	"time"

	"gorm.io/gorm"
)

type NotificationType string

const (
	NotificationTypeInfo    NotificationType = "info"
	NotificationTypePromo   NotificationType = "promo"
	NotificationTypeSuccess NotificationType = "success"
)

type Notification struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	UserID    uint           `json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"-"`
	Type      NotificationType `gorm:"type:varchar(50);default:'info'" json:"type"`
	Title     string           `gorm:"type:varchar(255)" json:"title"`
	Message   string           `gorm:"type:text" json:"message"`
	Read      bool             `gorm:"default:false" json:"read"`
	Link      string           `gorm:"type:varchar(255)" json:"link"`
}

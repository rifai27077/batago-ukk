package models

import (
	"time"

	"gorm.io/gorm"
)

type BannerStatus string

const (
	BannerStatusActive  BannerStatus = "active"
	BannerStatusDraft   BannerStatus = "draft"
	BannerStatusExpired BannerStatus = "expired"
)

type Banner struct {
	gorm.Model
	Title     string       `gorm:"type:varchar(255)" json:"title"`
	Placement string       `gorm:"type:varchar(100)" json:"placement"`
	ImageURL  string       `gorm:"type:varchar(255)" json:"image_url"`
	Status    BannerStatus `gorm:"type:varchar(50);default:'draft'" json:"status"`
	StartDate time.Time    `json:"start_date"`
	EndDate   time.Time    `json:"end_date"`
}

type ArticleStatus string

const (
	ArticleStatusPublished ArticleStatus = "published"
	ArticleStatusDraft     ArticleStatus = "draft"
)

type Article struct {
	gorm.Model
	Title    string        `gorm:"type:varchar(255)" json:"title"`
	Content  string        `gorm:"type:text" json:"content"`
	Author   string        `gorm:"type:varchar(255)" json:"author"`
	ImageURL string        `gorm:"type:varchar(255)" json:"image_url"`
	Status   ArticleStatus `gorm:"type:varchar(50);default:'draft'" json:"status"`
	Views    int           `gorm:"default:0" json:"views"`
}

type AdminActivityLog struct {
	gorm.Model
	AdminID  uint   `json:"admin_id"`
	Admin    User   `gorm:"foreignKey:AdminID" json:"admin"`
	Action   string `gorm:"type:varchar(255)" json:"action"`
	Target   string `gorm:"type:varchar(255)" json:"target"`
	Category string `gorm:"type:varchar(50)" json:"category"` // partner, user, finance, content, system
	Status   string `gorm:"type:varchar(50);default:'success'" json:"status"` // success, warning, error
}

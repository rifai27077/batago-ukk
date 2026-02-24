package models

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleUser    Role = "USER"
	RoleAdmin   Role = "ADMIN"
	RolePartner Role = "PARTNER"
)

type User struct {
	gorm.Model
	Name      string `gorm:"type:varchar(255)" json:"name"`
	Email     string `gorm:"uniqueIndex;type:varchar(255)" json:"email"`
	Password  string `gorm:"type:varchar(255)" json:"-"`
	Role      Role   `gorm:"type:varchar(50);default:'USER'" json:"role"`
	Phone     string `gorm:"type:varchar(20)" json:"phone"`
	AvatarURL        string `gorm:"type:varchar(255)" json:"avatar_url"`
	IsVerified       bool   `gorm:"default:false" json:"is_verified"`
	VerificationCode string `gorm:"type:varchar(10)" json:"-"`
	ResetCode        string `gorm:"type:varchar(10)" json:"-"`
}

type PartnerType string

const (
	PartnerTypeHotel  PartnerType = "hotel"
	PartnerTypeFlight PartnerType = "flight"
)

type PartnerStatus string

const (
	PartnerStatusDraft     PartnerStatus = "DRAFT"
	PartnerStatusInReview  PartnerStatus = "IN_REVIEW"
	PartnerStatusApproved  PartnerStatus = "APPROVED"
	PartnerStatusRejected  PartnerStatus = "REJECTED"
	PartnerStatusSuspended PartnerStatus = "SUSPENDED"
)

type Partner struct {
	gorm.Model
	UserID         uint          `json:"user_id"`
	User           User          `gorm:"foreignKey:UserID" json:"user"`
	CompanyName    string        `gorm:"type:varchar(255)" json:"company_name"`
	Type           PartnerType   `gorm:"type:varchar(50)" json:"type"`
	Status         PartnerStatus `gorm:"type:varchar(50);default:'DRAFT'" json:"status"`
	CommissionRate float64       `gorm:"type:decimal(10,2)" json:"commission_rate"`
	ApprovedAt     *time.Time    `json:"approved_at"`
	// Relationships
	Staff          []PartnerStaff `gorm:"foreignKey:PartnerID" json:"staff,omitempty"`
	Availabilities []Availability `gorm:"foreignKey:PartnerID" json:"availabilities,omitempty"`
}

// AfterSave hook to sync user role when partner is approved
func (p *Partner) AfterSave(tx *gorm.DB) (err error) {
	if p.Status == PartnerStatusApproved {
		// Update user role to PARTNER
		if err := tx.Model(&User{}).Where("id = ?", p.UserID).Update("role", RolePartner).Error; err != nil {
			return err
		}
	} else if p.Status == PartnerStatusRejected || p.Status == PartnerStatusSuspended {
		// Revert to USER if rejected or suspended (optional, safe bet)
		if err := tx.Model(&User{}).Where("id = ?", p.UserID).Update("role", RoleUser).Error; err != nil {
			return err
		}
	}
	return nil
}

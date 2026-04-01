package models

import (
	"time"

	"gorm.io/gorm"
)

type BankAccount struct {
	gorm.Model
	PartnerID         uint   `json:"partner_id"`
	Partner           Partner `gorm:"foreignKey:PartnerID" json:"-"`
	BankName          string `gorm:"type:varchar(100)" json:"bank_name"`
	AccountNumber     string `gorm:"type:varchar(100)" json:"account_number"`
	AccountHolderName string `gorm:"type:varchar(255)" json:"account_holder_name"`
	IsPrimary         bool   `gorm:"default:true" json:"is_primary"`
}

type PayoutSetting struct {
	gorm.Model
	PartnerID       uint    `gorm:"uniqueIndex" json:"partner_id"`
	Partner         Partner `gorm:"foreignKey:PartnerID" json:"-"`
	Schedule        string  `gorm:"type:varchar(50);default:'Weekly'" json:"schedule"` // Weekly, Monthly, Threshold
	ThresholdAmount float64 `gorm:"type:decimal(15,2);default:500000" json:"threshold_amount"`
}

type PayoutRequest struct {
	gorm.Model
	PartnerID     uint         `json:"partner_id"`
	Partner       Partner      `gorm:"foreignKey:PartnerID" json:"-"`
	Amount        float64      `gorm:"type:decimal(15,2)" json:"amount"`
	Status        string       `gorm:"type:varchar(50);default:'pending'" json:"status"` // pending, processing, completed, failed
	BankAccountID uint         `json:"bank_account_id"`
	BankAccount   BankAccount  `gorm:"foreignKey:BankAccountID" json:"-"`
	RequestedAt   time.Time    `json:"requested_at"`
	ProcessedAt   *time.Time   `json:"processed_at"`
}

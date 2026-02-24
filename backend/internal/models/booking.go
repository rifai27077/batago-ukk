package models

import (
	"time"

	"gorm.io/gorm"
)

type BookingType string

const (
	BookingTypeFlight BookingType = "flight"
	BookingTypeHotel  BookingType = "hotel"
)

type PaymentStatus string

const (
	PaymentStatusPending PaymentStatus = "PENDING"
	PaymentStatusPaid    PaymentStatus = "PAID"
	PaymentStatusFailed  PaymentStatus = "FAILED"
	PaymentStatusExpired PaymentStatus = "EXPIRED"
)

type BookingStatus string

const (
	BookingStatusNew       BookingStatus = "NEW"
	BookingStatusConfirmed BookingStatus = "CONFIRMED"
	BookingStatusCheckedIn BookingStatus = "CHECKED_IN"
	BookingStatusCompleted BookingStatus = "COMPLETED"
	BookingStatusCancelled BookingStatus = "CANCELLED"
)

type Booking struct {
	gorm.Model
	BookingCode   string        `gorm:"uniqueIndex;type:varchar(255)" json:"booking_code"`
	UserID        uint          `json:"user_id"`
	User          User          `gorm:"foreignKey:UserID" json:"user"`
	PartnerID     uint          `json:"partner_id"`
	Partner       Partner       `gorm:"foreignKey:PartnerID" json:"partner"`
	Type          BookingType   `gorm:"type:varchar(50)" json:"type"`
	PaymentStatus PaymentStatus `gorm:"type:varchar(50);default:'PENDING'" json:"payment_status"`
	BookingStatus BookingStatus `gorm:"type:varchar(50);default:'NEW'" json:"booking_status"`
	TotalAmount   float64       `gorm:"type:decimal(15,2)" json:"total_amount"`
	ExpiresAt     time.Time     `json:"expires_at"`
	Passengers    []Passenger   `gorm:"foreignKey:BookingID" json:"passengers"`
}

type Payment struct {
	gorm.Model
	BookingID     uint          `gorm:"uniqueIndex" json:"booking_id"`
	Booking       Booking       `gorm:"foreignKey:BookingID" json:"booking"`
	Gateway       string        `gorm:"type:varchar(100)" json:"gateway"`
	TransactionID string        `gorm:"type:varchar(255)" json:"transaction_id"`
	Amount        float64       `gorm:"type:decimal(15,2)" json:"amount"`
	Status        PaymentStatus `gorm:"type:varchar(50);default:'PENDING'" json:"status"`
	PaidAt        *time.Time    `json:"paid_at"`
	RawResponse   string        `gorm:"type:jsonb" json:"raw_response"`
	SnapToken     string        `gorm:"type:varchar(512)" json:"snap_token"`
	RedirectURL   string        `gorm:"type:varchar(1024)" json:"redirect_url"`
}

type ETicket struct {
	gorm.Model
	BookingID    uint      `gorm:"uniqueIndex" json:"booking_id"`
	Booking      Booking   `gorm:"foreignKey:BookingID" json:"booking"`
	TicketNumber string    `gorm:"type:varchar(255)" json:"ticket_number"`
	IssuedAt     time.Time `json:"issued_at"`
	IssuedBy     string    `gorm:"type:varchar(255)" json:"issued_by"`
}

type HotelVoucher struct {
	gorm.Model
	BookingID   uint      `gorm:"uniqueIndex" json:"booking_id"`
	Booking     Booking   `gorm:"foreignKey:BookingID" json:"booking"`
	VoucherCode string    `gorm:"type:varchar(255)" json:"voucher_code"`
	IssuedAt    time.Time `json:"issued_at"`
}

type PassengerType string

const (
	PassengerTypeAdult PassengerType = "Adult"
	PassengerTypeChild PassengerType = "Child"
)

type Passenger struct {
	gorm.Model
	BookingID  uint          `json:"booking_id"`
	Booking    Booking       `gorm:"foreignKey:BookingID" json:"booking"`
	Name       string        `gorm:"type:varchar(255)" json:"name"`
	Type       PassengerType `gorm:"type:varchar(50)" json:"type"`
	SeatNumber string        `gorm:"type:varchar(50)" json:"seat_number"`
}

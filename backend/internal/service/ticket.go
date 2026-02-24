package service

import (
	"fmt"
	"time"

	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

// GenerateTicketRecords creates ETicket or HotelVoucher records for a paid booking
func GenerateTicketRecords(bookingID uint) error {
	var booking models.Booking
	if err := database.DB.Preload("User").First(&booking, bookingID).Error; err != nil {
		return err
	}

	if booking.Type == models.BookingTypeFlight {
		// Create ETicket if not exists
		var ticket models.ETicket
		if err := database.DB.Where("booking_id = ?", booking.ID).First(&ticket).Error; err != nil {
			ticket = models.ETicket{
				BookingID:    booking.ID,
				TicketNumber: fmt.Sprintf("ET-%d-%d", time.Now().Unix(), booking.ID),
				IssuedAt:     time.Now(),
				IssuedBy:     "BataGo System",
			}
			if err := database.DB.Create(&ticket).Error; err != nil {
				return err
			}
		}
	} else if booking.Type == models.BookingTypeHotel {
		// Create HotelVoucher if not exists
		var voucher models.HotelVoucher
		if err := database.DB.Where("booking_id = ?", booking.ID).First(&voucher).Error; err != nil {
			voucher = models.HotelVoucher{
				BookingID:   booking.ID,
				VoucherCode: fmt.Sprintf("VC-%d-%d", time.Now().Unix(), booking.ID),
				IssuedAt:    time.Now(),
			}
			if err := database.DB.Create(&voucher).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

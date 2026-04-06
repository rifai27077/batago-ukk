package handlers

import (
	"crypto/sha512"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/service"
)

// midtransSnapClient returns a configured official Midtrans Snap client.
func midtransSnapClient() snap.Client {
	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	env := midtrans.Sandbox
	if strings.ToLower(os.Getenv("MIDTRANS_ENV")) == "production" {
		env = midtrans.Production
	}

	var client snap.Client
	client.New(serverKey, env)
	return client
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /v1/payments/token  (protected — requires JWT)
// ─────────────────────────────────────────────────────────────────────────────

type CreateTokenInput struct {
	BookingID uint `json:"booking_id" binding:"required"`
}

// CreatePaymentToken calls Midtrans Snap to generate a payment token for a
// booking that belongs to the authenticated user and is still PENDING + unexpired.
func CreatePaymentToken(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)

	var input CreateTokenInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Fetch booking — must belong to this user
	var booking models.Booking
	if err := database.DB.Where("id = ? AND user_id = ?", input.BookingID, uid).
		First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// 2. Guard: only PENDING bookings can get a token
	if booking.PaymentStatus != models.PaymentStatusPending {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Booking payment status is already '%s'", booking.PaymentStatus),
		})
		return
	}

	// 3. Guard: booking must not be expired
	if time.Now().After(booking.ExpiresAt) {
		database.DB.Model(&booking).Update("payment_status", models.PaymentStatusExpired)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Booking has expired"})
		return
	}

	// 4. Fetch user for customer details
	var user models.User
	if err := database.DB.First(&user, uid).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch user"})
		return
	}

	// 5. Build official Midtrans Snap request
	snapClient := midtransSnapClient()

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  booking.BookingCode,
			GrossAmt: int64(booking.TotalAmount),
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: user.Name,
			Email: user.Email,
			Phone: user.Phone,
		},
	}

	// 6. Call Midtrans — CreateTransaction returns (SnapResponse, *midtrans.Error)
	snapResp, midErr := snapClient.CreateTransaction(req)
	if midErr != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error":   "Failed to create Midtrans payment token",
			"details": midErr.GetMessage(),
		})
		return
	}

	// 7. Upsert Payment row
	now := time.Now()
	var existing models.Payment
	result := database.DB.Where("booking_id = ?", booking.ID).First(&existing)

	if result.Error != nil {
		// Insert new payment row
		payment := models.Payment{
			BookingID:     booking.ID,
			Gateway:       "midtrans",
			TransactionID: booking.BookingCode,
			Amount:        booking.TotalAmount,
			Status:        models.PaymentStatusPending,
			RawResponse:   "{}",
			SnapToken:     snapResp.Token,
			RedirectURL:   snapResp.RedirectURL,
		}
		if err := database.DB.Create(&payment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment record"})
			return
		}
	} else {
		// Refresh token on existing row (e.g. user refreshing expired Snap session)
		if err := database.DB.Model(&existing).Updates(map[string]interface{}{
			"snap_token":   snapResp.Token,
			"redirect_url": snapResp.RedirectURL,
			"updated_at":   now,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment record"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"snap_token":   snapResp.Token,
		"redirect_url": snapResp.RedirectURL,
		"booking_code": booking.BookingCode,
		"amount":       booking.TotalAmount,
		"expires_at":   booking.ExpiresAt,
	})
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /v1/payments/webhook  (public — called by Midtrans servers)
// ─────────────────────────────────────────────────────────────────────────────

// MidtransNotification mirrors the Midtrans payment notification payload.
type MidtransNotification struct {
	OrderID           string `json:"order_id"`
	StatusCode        string `json:"status_code"`
	GrossAmount       string `json:"gross_amount"`
	TransactionStatus string `json:"transaction_status"`
	FraudStatus       string `json:"fraud_status"`
	PaymentType       string `json:"payment_type"`
	SignatureKey      string `json:"signature_key"`
	TransactionTime   string `json:"transaction_time"`
	TransactionID     string `json:"transaction_id"`
}

// MidtransWebhook handles incoming payment notifications from Midtrans.
// Status is ONLY updated here — never from any client-side call.
func MidtransWebhook(c *gin.Context) {
	var notif MidtransNotification
	if err := c.ShouldBindJSON(&notif); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notification payload"})
		return
	}

	// ── Signature verification ─────────────────────────────────────────────
	// SHA512(order_id + status_code + gross_amount + server_key)
	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	raw := notif.OrderID + notif.StatusCode + notif.GrossAmount + serverKey
	hash := sha512.Sum512([]byte(raw))
	expected := fmt.Sprintf("%x", hash)

	if !strings.EqualFold(expected, notif.SignatureKey) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid signature"})
		return
	}

	// ── Look up the Payment row ────────────────────────────────────────────
	var payment models.Payment
	if err := database.DB.Where("transaction_id = ?", notif.OrderID).
		First(&payment).Error; err != nil {
		// Return 200 so Midtrans doesn't keep retrying for unknown orders
		c.JSON(http.StatusOK, gin.H{"message": "payment not found, ignoring"})
		return
	}

	// ── Map Midtrans status → internal status ─────────────────────────────
	status := strings.ToLower(notif.TransactionStatus)
	fraud := strings.ToLower(notif.FraudStatus)

	var newPaymentStatus models.PaymentStatus
	var newBookingStatus models.BookingStatus

	switch {
	case status == "capture" && fraud == "accept":
		newPaymentStatus = models.PaymentStatusPaid
		newBookingStatus = models.BookingStatusConfirmed
	case status == "settlement":
		newPaymentStatus = models.PaymentStatusPaid
		newBookingStatus = models.BookingStatusConfirmed
	case status == "deny", status == "cancel", status == "expire", status == "failure":
		newPaymentStatus = models.PaymentStatusFailed
	default:
		// pending / authorize — nothing to update yet
		c.JSON(http.StatusOK, gin.H{"message": "no status change for: " + status})
		return
	}

	// ── Persist in a DB transaction ────────────────────────────────────────
	now := time.Now()
	rawBytes, _ := json.Marshal(notif)

	tx := database.DB.Begin()

	paymentUpdates := map[string]interface{}{
		"status":       newPaymentStatus,
		"raw_response": string(rawBytes),
		"updated_at":   now,
	}
	if newPaymentStatus == models.PaymentStatusPaid {
		paymentUpdates["paid_at"] = now
	}
	if err := tx.Model(&payment).Updates(paymentUpdates).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment"})
		return
	}

	bookingUpdates := map[string]interface{}{
		"payment_status": newPaymentStatus,
		"updated_at":     now,
	}
	if newBookingStatus != "" {
		bookingUpdates["booking_status"] = newBookingStatus
	}
	if err := tx.Model(&models.Booking{}).Where("id = ?", payment.BookingID).
		Updates(bookingUpdates).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}

	tx.Commit()

	// ── Trigger Notifications ──────────────────
	var booking models.Booking
	if err := database.DB.First(&booking, payment.BookingID).Error; err == nil {
		if newPaymentStatus == models.PaymentStatusPaid {
			service.CreateBookingNotification(booking.UserID, booking.BookingCode, "paid")
		} else if newPaymentStatus == models.PaymentStatusFailed {
			service.CreateBookingNotification(booking.UserID, booking.BookingCode, "failed")
		}
	}

	// ── Post-payment actions (Email & Ticket Generation) ──────────────────
	if newPaymentStatus == models.PaymentStatusPaid {
		// 1. Generate E-Ticket or Voucher record
		if err := service.GenerateTicketRecords(payment.BookingID); err != nil {
			fmt.Printf("Error generating ticket records: %v\n", err)
		}

		// 2. Fetch full booking details for PDF
		var booking models.Booking
		if err := database.DB.Preload("User").Preload("Partner").Preload("Passengers").
			First(&booking, payment.BookingID).Error; err == nil {
			
			var detail interface{}
			if booking.Type == models.BookingTypeFlight {
				var fb models.FlightBooking
				database.DB.Preload("Flight.DepartureAirport").
					Preload("Flight.ArrivalAirport").
					Where("booking_id = ?", booking.ID).
					First(&fb)
				detail = &fb
			} else {
				var hb models.HotelBooking
				database.DB.Preload("RoomType.Hotel.Images").Where("booking_id = ?", booking.ID).First(&hb)
				detail = &hb
			}

			// 3. Generate PDF
			pdfData, err := service.GenerateTicketPDF(booking, detail)
			if err != nil {
				fmt.Printf("Error generating PDF for email: %v\n", err)
			} else {
				// 4. Send Email with Attachment
				emailService := service.NewEmailService()
				subject := fmt.Sprintf("BataGo Booking Confirmed - %s", booking.BookingCode)
				body := fmt.Sprintf(`
					<h1>Booking Confirmed!</h1>
					<p>Dear %s,</p>
					<p>Your booking <b>%s</b> has been successfully paid and confirmed.</p>
					<p>Please find your e-ticket/voucher attached to this email.</p>
					<p>Thank you for choosing BataGo!</p>
				`, booking.User.Name, booking.BookingCode)
				
				filename := fmt.Sprintf("BataGo_Ticket_%s.pdf", booking.BookingCode)
				emailService.SendEmailWithAttachment(booking.User.Email, subject, body, pdfData, filename)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "notification processed"})
}

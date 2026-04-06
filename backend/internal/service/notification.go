package service

import (
	"fmt"

	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

// CreateNotification sends a standard notification to a user
func CreateNotification(userID uint, notifType models.NotificationType, title, message, link string) error {
	notification := models.Notification{
		UserID:  userID,
		Type:    notifType,
		Title:   title,
		Message: message,
		Link:    link,
		Read:    false,
	}

	return database.DB.Create(&notification).Error
}

// CreateBookingNotification triggers notifications for booking related events
func CreateBookingNotification(userID uint, bookingCode string, eventType string) error {
	var title, message, link string
	var notifType models.NotificationType = models.NotificationTypeInfo

	link = fmt.Sprintf("/my-bookings/%s", bookingCode)

	switch eventType {
	case "created":
		title = "Booking Created"
		message = fmt.Sprintf("Your booking %s has been created. Please complete the payment before it expires.", bookingCode)
	case "paid":
		notifType = models.NotificationTypeSuccess
		title = "Payment Successful"
		message = fmt.Sprintf("Great news! Your payment for booking %s was successful. Your ticket is now ready.", bookingCode)
	case "failed":
		title = "Payment Failed"
		message = fmt.Sprintf("We couldn't process your payment for booking %s. Please try again.", bookingCode)
	case "cancelled":
		title = "Booking Cancelled"
		message = fmt.Sprintf("Booking %s has been successfully cancelled.", bookingCode)
	case "expired":
		title = "Payment Expired"
		message = fmt.Sprintf("The payment window for booking %s has expired.", bookingCode)
	}

	return CreateNotification(userID, notifType, title, message, link)
}

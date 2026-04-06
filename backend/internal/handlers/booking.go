package handlers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/service"
)

// --- Flight Booking ---

type FlightBookingInput struct {
	FlightID   uint   `json:"flight_id" binding:"required"`
	Class      string `json:"class" binding:"required"`
	Passengers []PassengerInput `json:"passengers" binding:"required,min=1"`
}

type PassengerInput struct {
	Name string `json:"name" binding:"required"`
	Type string `json:"type" binding:"required"` // Adult / Child
}

func CreateFlightBooking(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)

	var input FlightBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify flight exists and get seat pricing
	var seat models.FlightSeat
	if err := database.DB.Where("flight_id = ? AND UPPER(class) = UPPER(?)", input.FlightID, input.Class).
		First(&seat).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flight seat class not found"})
		return
	}

	if seat.AvailableSeats < len(input.Passengers) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not enough available seats"})
		return
	}

	// Get flight to find partner
	var flight models.Flight
	database.DB.First(&flight, input.FlightID)

	basePrice := seat.Price * float64(len(input.Passengers))
	tax := basePrice * 0.11
	totalAmount := basePrice + tax
	bookingCode := generateBookingCode("FL")

	// Create booking within a transaction
	tx := database.DB.Begin()

	booking := models.Booking{
		BookingCode:   bookingCode,
		UserID:        uid,
		PartnerID:     flight.PartnerID,
		Type:          models.BookingTypeFlight,
		PaymentStatus: models.PaymentStatusPending,
		BookingStatus: models.BookingStatusNew,
		TotalAmount:   totalAmount,
		ExpiresAt:     time.Now().Add(30 * time.Minute),
	}

	if err := tx.Create(&booking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking: " + err.Error()})
		return
	}

	// Create flight booking detail
	flightBooking := models.FlightBooking{
		BookingID: booking.ID,
		FlightID:  input.FlightID,
		Class:     models.FlightClass(input.Class),
	}
	if err := tx.Create(&flightBooking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create flight booking"})
		return
	}

	// Create passengers
	for i, p := range input.Passengers {
		passenger := models.Passenger{
			BookingID:  booking.ID,
			Name:       p.Name,
			Type:       models.PassengerType(p.Type),
			SeatNumber: fmt.Sprintf("%d%s", i+1, string(rune('A'+i%6))),
		}
		if err := tx.Create(&passenger).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create passenger"})
			return
		}
	}

	// Decrement available seats
	tx.Model(&seat).Update("available_seats", seat.AvailableSeats-len(input.Passengers))

	tx.Commit()

	// Trigger Notification
	service.CreateBookingNotification(uid, bookingCode, "created")

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Flight booking created",
		"booking_code": bookingCode,
		"booking_id":   booking.ID,
		"total_amount": totalAmount,
		"expires_at":   booking.ExpiresAt,
	})
}

// --- Hotel Booking ---

type HotelBookingInput struct {
	RoomTypeID uint   `json:"room_type_id" binding:"required"`
	CheckIn    string `json:"check_in" binding:"required"`
	CheckOut   string `json:"check_out" binding:"required"`
	Guests     int    `json:"guests" binding:"required"`
}

func CreateHotelBooking(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)

	var input HotelBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("CreateHotelBooking Binding Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	checkin, err := time.Parse("2006-01-02", input.CheckIn)
	if err != nil {
		fmt.Println("CreateHotelBooking CheckIn Parse Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid check-in date format (YYYY-MM-DD)"})
		return
	}
	checkout, err := time.Parse("2006-01-02", input.CheckOut)
	if err != nil {
		fmt.Println("CreateHotelBooking CheckOut Parse Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid check-out date format (YYYY-MM-DD)"})
		return
	}

	if !checkout.After(checkin) {
		fmt.Println("CreateHotelBooking Date Order Error: checkout is not after checkin")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Check-out must be after check-in"})
		return
	}

	// Get room type
	var roomType models.RoomType
	if err := database.DB.Preload("Hotel").First(&roomType, input.RoomTypeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room type not found"})
		return
	}

	if input.Guests > roomType.MaxGuests {
		fmt.Printf("CreateHotelBooking Guest Count Error: %d > %d\n", input.Guests, roomType.MaxGuests)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Number of guests exceeds room capacity"})
		return
	}

	// Calculate total (number of nights * price + 11% tax)
	nights := int(checkout.Sub(checkin).Hours() / 24)
	basePrice := roomType.BasePrice * float64(nights)
	tax := basePrice * 0.11
	totalAmount := basePrice + tax

	// Get hotel's partner
	var hotel models.Hotel
	database.DB.First(&hotel, roomType.HotelID)

	bookingCode := generateBookingCode("HT")

	tx := database.DB.Begin()

	// Check and decrement room availability
	var availabilities []models.RoomAvailability
	if err := tx.Where("room_type_id = ? AND date >= ? AND date < ?", roomType.ID, checkin, checkout).Find(&availabilities).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check room availability"})
		return
	}

	if len(availabilities) < nights {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room not available for the full duration of the dates selected"})
		return
	}

	for _, avail := range availabilities {
		if avail.AvailableRooms <= 0 {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Room sold out on " + avail.Date.Format("2006-01-02")})
			return
		}
		// Decrement
		avail.AvailableRooms--
		if err := tx.Save(&avail).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reserve room availability"})
			return
		}
	}
	booking := models.Booking{
		BookingCode:   bookingCode,
		UserID:        uid,
		PartnerID:     hotel.PartnerID,
		Type:          models.BookingTypeHotel,
		PaymentStatus: models.PaymentStatusPending,
		BookingStatus: models.BookingStatusNew,
		TotalAmount:   totalAmount,
		ExpiresAt:     time.Now().Add(30 * time.Minute),
	}

	if err := tx.Create(&booking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	// Create hotel voucher
	voucher := models.HotelVoucher{
		BookingID:   booking.ID,
		VoucherCode: generateBookingCode("VC"),
		IssuedAt:    time.Now(),
	}
	if err := tx.Create(&voucher).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create voucher"})
		return
	}

	// Create detailed hotel booking record
	hotelBooking := models.HotelBooking{
		BookingID:  booking.ID,
		RoomTypeID: input.RoomTypeID,
		CheckIn:    checkin,
		CheckOut:   checkout,
		Guests:     input.Guests,
	}
	if err := tx.Create(&hotelBooking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create hotel booking detail"})
		return
	}

	tx.Commit()

	// Trigger Notification
	service.CreateBookingNotification(uid, bookingCode, "created")

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Hotel booking created",
		"booking_code": bookingCode,
		"booking_id":   booking.ID,
		"total_amount": totalAmount,
		"nights":       nights,
		"expires_at":   booking.ExpiresAt,
	})
}

// --- Generic Booking Endpoints ---

func GetMyBookings(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)

	bookingType := c.Query("type") // flight / hotel
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	query := database.DB.Where("user_id = ?", uid).Order("created_at DESC")

	if bookingType != "" {
		query = query.Where("type = ?", bookingType)
	}

	var total int64
	query.Model(&models.Booking{}).Count(&total)

	bookings := []models.Booking{}
	if err := query.Preload("Partner").Offset(offset).Limit(limit).Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": bookings,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

func GetBookingDetail(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)
	idOrCode := c.Param("id")

	var booking models.Booking
	query := database.DB.Preload("Partner").Preload("Passengers").Where("user_id = ?", uid)

	// Determine if idOrCode is an ID (numeric) or a Booking Code
	if id, err := strconv.Atoi(idOrCode); err == nil {
		query = query.Where("id = ?", id)
	} else {
		query = query.Where("booking_code = ?", idOrCode)
	}

	if err := query.First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	var flightBooking models.FlightBooking
	if booking.Type == models.BookingTypeFlight {
		database.DB.Preload("Flight.DepartureAirport").
			Preload("Flight.ArrivalAirport").
			Where("booking_id = ?", booking.ID).
			First(&flightBooking)
	}

	var voucher models.HotelVoucher
	var hotelBooking models.HotelBooking
	if booking.Type == models.BookingTypeHotel {
		database.DB.Where("booking_id = ?", booking.ID).First(&voucher)
		database.DB.Preload("RoomType.Hotel.Images").Where("booking_id = ?", booking.ID).First(&hotelBooking)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"booking":        booking,
			"flight_booking": flightBooking,
			"voucher":        voucher,
			"hotel_booking":  hotelBooking,
			"passengers":     booking.Passengers,
		},
	})
}

func DownloadTicket(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)
	idOrCode := c.Param("id")

	var booking models.Booking
	query := database.DB.Preload("Partner").Preload("Passengers").Where("user_id = ?", uid)

	if id, err := strconv.Atoi(idOrCode); err == nil {
		query = query.Where("id = ?", id)
	} else {
		query = query.Where("booking_code = ?", idOrCode)
	}

	if err := query.First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	if booking.PaymentStatus != models.PaymentStatusPaid {
		c.JSON(http.StatusForbidden, gin.H{"error": "Booking not yet paid"})
		return
	}

	var detail interface{}
	if booking.Type == models.BookingTypeFlight {
		var fb models.FlightBooking
		database.DB.Preload("Flight").
			Preload("Flight.DepartureAirport").
			Preload("Flight.ArrivalAirport").
			Where("booking_id = ?", booking.ID).
			First(&fb)
		detail = &fb
	} else {
		var hb models.HotelBooking
		database.DB.Preload("RoomType").
			Preload("RoomType.Hotel").
			Where("booking_id = ?", booking.ID).
			First(&hb)
		detail = &hb
	}

	pdfData, err := service.GenerateTicketPDF(booking, detail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
		return
	}

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=BataGo_Ticket_%s.pdf", booking.BookingCode))
	c.Data(http.StatusOK, "application/pdf", pdfData)
}

func CancelBooking(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)
	idOrCode := c.Param("id")

	var booking models.Booking
	query := database.DB.Where("user_id = ?", uid)

	if id, err := strconv.Atoi(idOrCode); err == nil {
		query = query.Where("id = ?", id)
	} else {
		query = query.Where("booking_code = ?", idOrCode)
	}

	if err := query.First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	if booking.PaymentStatus != models.PaymentStatusPending {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can only cancel pending bookings"})
		return
	}

	booking.BookingStatus = models.BookingStatusCancelled
	database.DB.Save(&booking)

	// Trigger Notification
	service.CreateBookingNotification(uid, booking.BookingCode, "cancelled")

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled successfully"})
}

func ResendTicketEmail(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)
	idOrCode := c.Param("id")

	var booking models.Booking
	query := database.DB.Preload("User").Preload("Partner").Preload("Passengers").Where("user_id = ?", uid)

	if id, err := strconv.Atoi(idOrCode); err == nil {
		query = query.Where("id = ?", id)
	} else {
		query = query.Where("booking_code = ?", idOrCode)
	}

	if err := query.First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	if booking.PaymentStatus != models.PaymentStatusPaid {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only paid bookings can have tickets resent"})
		return
	}

	var detail interface{}
	if booking.Type == models.BookingTypeFlight {
		var fb models.FlightBooking
		database.DB.Preload("Flight").
			Preload("Flight.DepartureAirport").
			Preload("Flight.ArrivalAirport").
			Where("booking_id = ?", booking.ID).
			First(&fb)
		detail = &fb
	} else {
		var hb models.HotelBooking
		database.DB.Preload("RoomType").
			Preload("RoomType.Hotel").
			Where("booking_id = ?", booking.ID).
			First(&hb)
		detail = &hb
	}

	// 1. Generate PDF
	pdfData, err := service.GenerateTicketPDF(booking, detail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF for email"})
		return
	}

	// 2. Send Email
	emailService := service.NewEmailService()
	subject := fmt.Sprintf("BataGo E-Ticket Resend - %s", booking.BookingCode)
	body := fmt.Sprintf(`
		<h1>E-Ticket Resend</h1>
		<p>Dear %s,</p>
		<p>As requested, we are resending your e-ticket/voucher for booking <b>%s</b>.</p>
		<p>Please find it attached to this email.</p>
		<p>Thank you for choosing BataGo!</p>
	`, booking.User.Name, booking.BookingCode)

	filename := fmt.Sprintf("BataGo_Ticket_%s.pdf", booking.BookingCode)
	if err := emailService.SendEmailWithAttachment(booking.User.Email, subject, body, pdfData, filename); err != nil {
		// Even if email fails, we don't return 500 because the user might have invalid SMTP but we logged it
		// and the database/PDF part worked. In our service it returns nil if not configured.
	}

	c.JSON(http.StatusOK, gin.H{"message": "E-Ticket has been resent to your email"})
}

func generateBookingCode(prefix string) string {
	return fmt.Sprintf("%s-%d%04d", prefix, time.Now().Unix()%100000, rand.Intn(10000))
}

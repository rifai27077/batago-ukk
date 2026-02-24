package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

func GetPartnerAvailability(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	availability := []models.Availability{}
	database.DB.Where("partner_id = ?", partner.ID).
		Preload("RoomType").Preload("Flight").
		Find(&availability)

	// Also get bookings for the calendar
	bookingQuery := database.DB.Where("partner_id = ? AND booking_status != 'cancelled'", partner.ID)
	
	roomTypeID := c.Query("room_type_id")
	flightID := c.Query("flight_id")
	
	if roomTypeID != "" {
		bookingQuery = bookingQuery.Where("room_type_id = ?", roomTypeID)
	}
	if flightID != "" {
		bookingQuery = bookingQuery.Where("flight_id = ?", flightID)
	}

	bookings := []models.Booking{}
	bookingQuery.Preload("User").Find(&bookings)

	// Fetch listings for the filters
	var rooms []models.RoomType
	if partner.Type == models.PartnerTypeHotel {
		var hotels []models.Hotel
		database.DB.Where("partner_id = ?", partner.ID).Find(&hotels)
		hotelIDs := []uint{}
		for _, h := range hotels {
			hotelIDs = append(hotelIDs, h.ID)
		}
		if len(hotelIDs) > 0 {
			database.DB.Where("hotel_id IN ?", hotelIDs).Find(&rooms)
		}
	}

	var flights []models.Flight
	if partner.Type == models.PartnerTypeFlight {
		database.DB.Where("partner_id = ?", partner.ID).Find(&flights)
	}

	c.JSON(http.StatusOK, gin.H{
		"availability": availability,
		"bookings":     bookings,
		"rooms":        rooms,
		"flights":      flights,
	})
}

type BlockDatesInput struct {
	StartDate  string  `json:"start_date" binding:"required"`
	EndDate    string  `json:"end_date" binding:"required"`
	Action     string  `json:"action"` // "block", "unblock", or "price"
	Price      float64 `json:"price"`
	RoomTypeID *uint   `json:"room_type_id,omitempty"`
	FlightID   *uint   `json:"flight_id,omitempty"`
}

func BlockPartnerDates(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var input BlockDatesInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	start, err1 := time.Parse("2006-01-02", input.StartDate)
	end, err2 := time.Parse("2006-01-02", input.EndDate)
	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Base query for existing availability
	baseQuery := database.DB.Where("partner_id = ? AND date BETWEEN ? AND ?", partner.ID, start, end)
	if input.RoomTypeID != nil {
		baseQuery = baseQuery.Where("room_type_id = ?", *input.RoomTypeID)
	} else if input.FlightID != nil {
		baseQuery = baseQuery.Where("flight_id = ?", *input.FlightID)
	}

	if input.Action == "unblock" {
		baseQuery.Delete(&models.Availability{})
		c.JSON(http.StatusOK, gin.H{"message": "Dates unblocked"})
		return
	}

	// Block or Price update logic
	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		var existing models.Availability
		q := database.DB.Where("partner_id = ? AND date = ?", partner.ID, d)
		if input.RoomTypeID != nil {
			q = q.Where("room_type_id = ?", *input.RoomTypeID)
		} else if input.FlightID != nil {
			q = q.Where("flight_id = ?", *input.FlightID)
		}
		
		err := q.First(&existing).Error
		
		if err != nil {
			// Not exist, create
			avail := models.Availability{
				PartnerID:  partner.ID,
				Date:       d,
				Status:     models.AvailabilityAvailable,
				RoomTypeID: input.RoomTypeID,
				FlightID:   input.FlightID,
			}
			if input.Action == "block" {
				avail.Status = models.AvailabilityBlocked
			}
			if input.Action == "price" && input.Price > 0 {
				avail.Price = input.Price
			}
			database.DB.Create(&avail)
		} else {
			// Update existing
			if input.Action == "block" {
				existing.Status = models.AvailabilityBlocked
			} else if input.Action == "price" && input.Price > 0 {
				existing.Price = input.Price
				if existing.Status == models.AvailabilityBlocked {
					existing.Status = models.AvailabilityAvailable
				}
			}
			database.DB.Save(&existing)
		}
	}

	message := "Dates updated successfully"
	if input.Action == "block" {
		message = "Dates blocked successfully"
	} else if input.Action == "price" {
		message = "Rates updated successfully"
	}

	c.JSON(http.StatusOK, gin.H{"message": message})
}

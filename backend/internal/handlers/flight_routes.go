package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

// ==================== PARTNER ROUTES (Flight Routes) ====================

// GetPartnerRoutes returns all flight routes for the authenticated partner
// GET /v1/partner/routes
func GetPartnerRoutes(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")
	region := c.Query("region") // "domestic" or "international"
	offset := (page - 1) * limit

	query := database.DB.Where("partner_id = ?", partner.ID)
	if search != "" {
		query = query.Where("flight_number LIKE ? OR airline LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	var total int64
	query.Model(&models.Flight{}).Count(&total)

	flights := []models.Flight{}
	q := query.Preload("DepartureAirport").Preload("ArrivalAirport").
		Order("created_at DESC").Offset(offset).Limit(limit)
	q.Find(&flights)

	// Build response
	type ClassResponse struct {
		Class    string  `json:"class"`
		Price    float64 `json:"price"`
		Capacity int     `json:"capacity"`
	}
	type RouteResponse struct {
		ID           uint            `json:"id"`
		Origin       string          `json:"origin"`
		OriginCity   string          `json:"origin_city"`
		Destination  string          `json:"destination"`
		DestCity     string          `json:"destination_city"`
		FlightNumber string          `json:"flight_number"`
		Duration     string          `json:"duration"`
		Aircraft     string          `json:"aircraft"`
		Schedule     interface{}     `json:"schedule"`
		BasePrice    float64         `json:"base_price"`
		Classes      []ClassResponse `json:"classes"`
		Status       string          `json:"status"`
	}

	results := []RouteResponse{}
	for _, f := range flights {
		// Filter by region if specified
		if region != "" && region != "all" {
			isDomestic := f.DepartureAirport.Country == f.ArrivalAirport.Country
			if region == "domestic" && !isDomestic {
				continue
			}
			if region == "international" && isDomestic {
				continue
			}
		}

		durationStr := ""
		hours := f.Duration / 60
		mins := f.Duration % 60
		if hours > 0 {
			durationStr = strconv.Itoa(hours) + "h "
		}
		durationStr += strconv.Itoa(mins) + "m"

		// Try to find assigned aircraft
		aircraftModel := f.Airline
		var aircraft models.Aircraft
		if err := database.DB.Where("partner_id = ? AND status = ?", partner.ID, models.AircraftStatusActive).First(&aircraft).Error; err == nil {
			aircraftModel = aircraft.AircraftModel
		}

		var flightSeats []models.FlightSeat
		database.DB.Where("flight_id = ?", f.ID).Find(&flightSeats)

		var basePrice float64
		var classResp []ClassResponse

		for _, seat := range flightSeats {
			classResp = append(classResp, ClassResponse{
				Class:    string(seat.Class),
				Price:    seat.Price,
				Capacity: seat.TotalSeats,
			})
			if basePrice == 0 || seat.Price < basePrice {
				basePrice = seat.Price
			}
		}

		var scheds []string
		if f.Schedule != "" && f.Schedule != "null" {
			json.Unmarshal([]byte(f.Schedule), &scheds)
		}

		results = append(results, RouteResponse{
			ID:           f.ID,
			Origin:       f.DepartureAirport.Code,
			OriginCity:   f.DepartureAirport.City,
			Destination:  f.ArrivalAirport.Code,
			DestCity:     f.ArrivalAirport.City,
			FlightNumber: f.FlightNumber,
			Duration:     durationStr,
			Aircraft:     aircraftModel,
			Schedule:     scheds,
			BasePrice:    basePrice,
			Classes:      classResp,
			Status:       "active",
		})
	}

	// Stats
	var dailyFlights int64
	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.AddDate(0, 0, 1)
	database.DB.Model(&models.Flight{}).Where(
		"partner_id = ? AND departure_time >= ? AND departure_time < ?",
		partner.ID, today, tomorrow,
	).Count(&dailyFlights)
	if dailyFlights == 0 {
		dailyFlights = total // fallback: all routes count as daily if no date-specific flights
	}

	c.JSON(http.StatusOK, gin.H{
		"data": results,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
		"stats": gin.H{
			"active_routes":       total,
			"daily_flights":       dailyFlights,
			"on_time_performance": 98.2, // Mock — requires real flight tracking data
		},
	})
}

type ClassInput struct {
	Class    string  `json:"class"`
	Price    float64 `json:"price"`
	Capacity int     `json:"capacity"`
}

type CreateRouteInput struct {
	Origin       string       `json:"origin" binding:"required"`
	Destination  string       `json:"destination" binding:"required"`
	FlightNumber string       `json:"flight_number" binding:"required"`
	Duration     string       `json:"duration"`
	Aircraft     string       `json:"aircraft"`
	BasePrice    float64      `json:"base_price"` // fallback
	Classes      []ClassInput `json:"classes"`
	Schedule     []string     `json:"schedule"`
}

// CreatePartnerRoute creates a new flight route
// POST /v1/partner/routes
func CreatePartnerRoute(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var input CreateRouteInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Resolve airports (auto-create if not exists)
	var depAirport models.Airport
	if err := database.DB.Where("code = ?", input.Origin).First(&depAirport).Error; err != nil {
		depAirport = models.Airport{
			Code:     input.Origin,
			Name:     input.Origin + " Airport",
			City:     input.Origin,
			Country:  "Global",
			Timezone: "UTC",
		}
		database.DB.Create(&depAirport)
	}

	var arrAirport models.Airport
	if err := database.DB.Where("code = ?", input.Destination).First(&arrAirport).Error; err != nil {
		arrAirport = models.Airport{
			Code:     input.Destination,
			Name:     input.Destination + " Airport",
			City:     input.Destination,
			Country:  "Global",
			Timezone: "UTC",
		}
		database.DB.Create(&arrAirport)
	}

	// Parse duration string to minutes
	durationMinutes := parseDuration(input.Duration)

	// Set a default departure time (today + 1 day at 08:00)
	defaultDeparture := time.Now().AddDate(0, 0, 1).Truncate(24*time.Hour).Add(8 * time.Hour)
	defaultArrival := defaultDeparture.Add(time.Duration(durationMinutes) * time.Minute)

	schedBytes, _ := json.Marshal(input.Schedule)

	flight := models.Flight{
		PartnerID:          partner.ID,
		FlightNumber:       input.FlightNumber,
		Airline:            partner.CompanyName,
		DepartureAirportID: depAirport.ID,
		ArrivalAirportID:   arrAirport.ID,
		DepartureTime:      defaultDeparture,
		ArrivalTime:        defaultArrival,
		Duration:           durationMinutes,
		BaggageAllowanceKg: 20,
		Schedule:           string(schedBytes),
	}

	if err := database.DB.Create(&flight).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create route"})
		return
	}

	// Create classes
	if len(input.Classes) > 0 {
		for _, cls := range input.Classes {
			seat := models.FlightSeat{
				FlightID:       flight.ID,
				Class:          models.FlightClass(cls.Class),
				Price:          cls.Price,
				TotalSeats:     cls.Capacity,
				AvailableSeats: cls.Capacity,
				Features:       `["Standard seat","Snack box"]`, // Simplified
			}
			database.DB.Create(&seat)
		}
	} else if input.BasePrice > 0 {
		// Fallback to default economy if no classes array is provided
		seat := models.FlightSeat{
			FlightID:       flight.ID,
			Class:          models.FlightClassEconomy,
			Price:          input.BasePrice,
			TotalSeats:     180,
			AvailableSeats: 180,
			Features:       `["Standard seat","Snack box"]`,
		}
		database.DB.Create(&seat)
	}

	// Load associations for response
	database.DB.Preload("DepartureAirport").Preload("ArrivalAirport").First(&flight, flight.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Route created",
		"data": gin.H{
			"id":            flight.ID,
			"origin":        flight.DepartureAirport.Code,
			"destination":   flight.ArrivalAirport.Code,
			"flight_number": flight.FlightNumber,
			"duration":      input.Duration,
			"aircraft":      input.Aircraft,
			"status":        "active",
		},
	})
}

// DeletePartnerRoute deletes a flight route
// DELETE /v1/partner/routes/:id
func DeletePartnerRoute(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	routeID := c.Param("id")

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var flight models.Flight
	if err := database.DB.Where("id = ? AND partner_id = ?", routeID, partner.ID).First(&flight).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Route not found"})
		return
	}

	// Delete associated seats first
	database.DB.Where("flight_id = ?", flight.ID).Delete(&models.FlightSeat{})

	if err := database.DB.Delete(&flight).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete route"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Route deleted"})
}

// UpdatePartnerRoute updates a flight route
// PUT /v1/partner/routes/:id
func UpdatePartnerRoute(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	routeID := c.Param("id")

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var flight models.Flight
	if err := database.DB.Where("id = ? AND partner_id = ?", routeID, partner.ID).First(&flight).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Route not found"})
		return
	}

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}

	if flightNum, ok := input["flight_number"].(string); ok {
		updates["flight_number"] = flightNum
	}

	if dur, ok := input["duration"].(string); ok {
		updates["duration"] = parseDuration(dur)
	} else if durFloat, ok := input["duration"].(float64); ok {
		updates["duration"] = int(durFloat)
	}

	if sched, ok := input["schedule"].([]interface{}); ok {
		schedBytes, _ := json.Marshal(sched)
		updates["schedule"] = string(schedBytes)
	}

	if originCode, ok := input["origin"].(string); ok && originCode != "" {
		var depAirport models.Airport
		if database.DB.Where("code = ?", originCode).First(&depAirport).Error != nil {
			depAirport = models.Airport{
				Code:     originCode,
				Name:     originCode + " Airport",
				City:     originCode,
				Country:  "Global",
				Timezone: "UTC",
			}
			database.DB.Create(&depAirport)
		}
		updates["departure_airport_id"] = depAirport.ID
	}

	if destCode, ok := input["destination"].(string); ok && destCode != "" {
		var arrAirport models.Airport
		if database.DB.Where("code = ?", destCode).First(&arrAirport).Error != nil {
			arrAirport = models.Airport{
				Code:     destCode,
				Name:     destCode + " Airport",
				City:     destCode,
				Country:  "Global",
				Timezone: "UTC",
			}
			database.DB.Create(&arrAirport)
		}
		updates["arrival_airport_id"] = arrAirport.ID
	}

	if err := database.DB.Model(&flight).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update route"})
		return
	}

	if classesInter, ok := input["classes"].([]interface{}); ok {
		database.DB.Where("flight_id = ?", flight.ID).Delete(&models.FlightSeat{})
		for _, clsInt := range classesInter {
			if clsMap, ok := clsInt.(map[string]interface{}); ok {
				clsName, _ := clsMap["class"].(string)
				price, _ := clsMap["price"].(float64)
				capFloat, _ := clsMap["capacity"].(float64)
				cap := int(capFloat)

				if clsName != "" && price > 0 {
					database.DB.Create(&models.FlightSeat{
						FlightID:       flight.ID,
						Class:          models.FlightClass(clsName),
						Price:          price,
						TotalSeats:     cap,
						AvailableSeats: cap,
						Features:       `["Standard seat","Snack box"]`,
					})
				}
			}
		}
	} else if basePrice, ok := input["base_price"].(float64); ok {
		database.DB.Model(&models.FlightSeat{}).Where("flight_id = ?", flight.ID).Update("price", basePrice)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Route updated", "data": flight})
}

// parseDuration converts "1h 45m" or "2h 30m" to minutes
func parseDuration(s string) int {
	hours := 0
	mins := 0

	// Try parsing "Xh Ym" format
	n, err := strconv.Atoi(s)
	if err == nil {
		return n // already in minutes
	}

	// Parse manually
	current := ""
	for _, ch := range s {
		if ch >= '0' && ch <= '9' {
			current += string(ch)
		} else if ch == 'h' || ch == 'H' {
			hours, _ = strconv.Atoi(current)
			current = ""
		} else if ch == 'm' || ch == 'M' {
			mins, _ = strconv.Atoi(current)
			current = ""
		}
	}

	total := hours*60 + mins
	if total == 0 {
		total = 120 // default 2 hours
	}
	return total
}

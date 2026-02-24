package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

// SearchFlights godoc
// GET /v1/flights?from=CGK&to=DPS&date=2026-03-01&class=Economy&passengers=1
func SearchFlights(c *gin.Context) {
	from := c.Query("from")       // airport code
	to := c.Query("to")           // airport code
	dateStr := c.Query("date")    // YYYY-MM-DD
	class := c.Query("class")     // Economy, Business, First
	passStr := c.Query("passengers")

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	query := database.DB.Model(&models.Flight{}).
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		Preload("Partner")

	// Filter by departure airport
	if from != "" {
		var depAirport models.Airport
		if err := database.DB.Where("code = ?", from).First(&depAirport).Error; err == nil {
			query = query.Where("departure_airport_id = ?", depAirport.ID)
		}
	}

	// Filter by arrival airport
	if to != "" {
		var arrAirport models.Airport
		if err := database.DB.Where("code = ?", to).First(&arrAirport).Error; err == nil {
			query = query.Where("arrival_airport_id = ?", arrAirport.ID)
		}
	}

	// Filter by date
	if dateStr != "" {
		date, err := time.Parse("2006-01-02", dateStr)
		if err == nil {
			nextDay := date.AddDate(0, 0, 1)
			query = query.Where("departure_time >= ? AND departure_time < ?", date, nextDay)
		}
	}

	// Count total for pagination
	var total int64
	query.Count(&total)

	flights := []models.Flight{}
	if err := query.Offset(offset).Limit(limit).Find(&flights).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search flights"})
		return
	}

	// Build response with seat info
	type FlightResponse struct {
		models.Flight
		Seats []models.FlightSeat `json:"seats"`
	}

	results := []FlightResponse{}
	for _, f := range flights {
		seats := []models.FlightSeat{}
		seatQuery := database.DB.Where("flight_id = ?", f.ID)
		if class != "" {
			seatQuery = seatQuery.Where("class = ?", class)
		}

		passengers, _ := strconv.Atoi(passStr)
		if passengers > 0 {
			seatQuery = seatQuery.Where("available_seats >= ?", passengers)
		}

		seatQuery.Find(&seats)

		if len(seats) > 0 || (class == "" && passStr == "") {
			results = append(results, FlightResponse{
				Flight: f,
				Seats:  seats,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data": results,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

// GetFlightDetail godoc
// GET /v1/flights/:id
func GetFlightDetail(c *gin.Context) {
	id := c.Param("id")

	var flight models.Flight
	if err := database.DB.
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		Preload("Partner").
		First(&flight, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flight not found"})
		return
	}

	seats := []models.FlightSeat{}
	database.DB.Where("flight_id = ?", flight.ID).Find(&seats)

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"flight": flight,
			"seats":  seats,
		},
	})
}

// GetAirports godoc
// GET /v1/airports?q=Jakarta
func GetAirports(c *gin.Context) {
	q := c.Query("q")

	airports := []models.Airport{}
	query := database.DB.Model(&models.Airport{})

	if q != "" {
		search := "%" + q + "%"
		query = query.Where("name ILIKE ? OR code ILIKE ? OR city ILIKE ?", search, search, search)
	}

	if err := query.Limit(20).Find(&airports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch airports"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": airports})
}

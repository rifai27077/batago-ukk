package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

func SearchFlights(c *gin.Context) {
	from := c.Query("from")       // airport code
	to := c.Query("to")           // airport code
	dateStr := c.Query("date")    // YYYY-MM-DD
	class := c.Query("class")     // Economy, Business, First
	passStr := c.Query("passengers")

	// Pagination with cap
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	query := database.DB.Model(&models.Flight{}).
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		Preload("Partner")

	// Single query for departure airport lookup
	if from != "" {
		var depAirport models.Airport
		if err := database.DB.Where("code = ?", from).First(&depAirport).Error; err == nil {
			query = query.Where("departure_airport_id = ?", depAirport.ID)
		}
	}

	// Single query for arrival airport lookup
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

	if len(flights) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": []interface{}{}, "meta": gin.H{"page": page, "limit": limit, "total": total}})
		return
	}

	// Batch fetch all seats for the returned flights in ONE query (eliminates N+1)
	flightIDs := make([]uint, len(flights))
	for i, f := range flights {
		flightIDs[i] = f.ID
	}

	passengers, _ := strconv.Atoi(passStr)
	seatQuery := database.DB.Where("flight_id IN ?", flightIDs)
	if class != "" {
		seatQuery = seatQuery.Where("class = ?", class)
	}
	if passengers > 0 {
		seatQuery = seatQuery.Where("available_seats >= ?", passengers)
	}
	var allSeats []models.FlightSeat
	seatQuery.Find(&allSeats)

	// Build map: flight_id -> []FlightSeat (O(1) lookup)
	seatMap := make(map[uint][]models.FlightSeat)
	for _, s := range allSeats {
		seatMap[s.FlightID] = append(seatMap[s.FlightID], s)
	}

	type FlightResponse struct {
		models.Flight
		Seats []models.FlightSeat `json:"seats"`
	}

	results := []FlightResponse{}
	for _, f := range flights {
		seats := seatMap[f.ID]
		if len(seats) > 0 || (class == "" && passStr == "") {
			if seats == nil {
				seats = []models.FlightSeat{}
			}
			results = append(results, FlightResponse{Flight: f, Seats: seats})
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

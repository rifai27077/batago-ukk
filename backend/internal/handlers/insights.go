package handlers

import (
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

// ==================== PARTNER INSIGHTS ====================

// GetPartnerInsights returns market comparison and pricing insight data
// GET /v1/partner/insights
func GetPartnerInsights(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	isHotel := partner.Type == models.PartnerTypeHotel

	// --- Real Data: Bookings & Revenue ---
	var totalBookings int64
	database.DB.Model(&models.Booking{}).Where("partner_id = ?", partner.ID).Count(&totalBookings)

	var totalRevenue float64
	database.DB.Model(&models.Booking{}).
		Where("partner_id = ? AND payment_status = ?", partner.ID, models.PaymentStatusPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalRevenue)

	var avgBookingValue float64
	if totalBookings > 0 {
		avgBookingValue = totalRevenue / float64(totalBookings)
	}

	// --- Metrics ---
	var metrics []gin.H
	if isHotel {
		// Calculate occupancy from real data
		var totalRooms int64
		var hotelIDs []uint
		database.DB.Model(&models.Hotel{}).Where("partner_id = ?", partner.ID).Pluck("id", &hotelIDs)
		if len(hotelIDs) > 0 {
			database.DB.Model(&models.RoomType{}).Where("hotel_id IN ?", hotelIDs).Count(&totalRooms)
		}

		occupancyIndex := 100
		if totalRooms > 0 && totalBookings > 0 {
			occupancyIndex = int(math.Min(float64(totalBookings)/float64(totalRooms)*20, 150))
		}

		adrIndex := 100
		if avgBookingValue > 0 {
			adrIndex = int(avgBookingValue / 500000 * 100) // Benchmark: 500k ADR
			if adrIndex > 150 {
				adrIndex = 150
			}
		}

		revparIndex := (occupancyIndex + adrIndex) / 2

		metrics = []gin.H{
			{"label": "Occupancy Index", "value": occupancyIndex, "change": formatChange(occupancyIndex, 100), "trend": trendDir(occupancyIndex, 100), "desc": formatDesc(occupancyIndex, 100, "market")},
			{"label": "ADR Index", "value": adrIndex, "change": formatChange(adrIndex, 100), "trend": trendDir(adrIndex, 100), "desc": formatDesc(adrIndex, 100, "market")},
			{"label": "RevPAR Index", "value": revparIndex, "change": formatChange(revparIndex, 100), "trend": trendDir(revparIndex, 100), "desc": formatDesc(revparIndex, 100, "market")},
		}
	} else {
		// Airline metrics
		var totalSeats int64
		var flightIDs []uint
		database.DB.Model(&models.Flight{}).Where("partner_id = ?", partner.ID).Pluck("id", &flightIDs)
		if len(flightIDs) > 0 {
			database.DB.Model(&models.FlightSeat{}).Where("flight_id IN ?", flightIDs).
				Select("COALESCE(SUM(total_seats), 0)").Scan(&totalSeats)
		}

		loadFactorIndex := 100
		if totalSeats > 0 && totalBookings > 0 {
			loadFactorIndex = int(math.Min(float64(totalBookings)/float64(totalSeats)*500, 150))
		}

		yieldIndex := 100
		if avgBookingValue > 0 {
			yieldIndex = int(avgBookingValue / 1200000 * 100) // Benchmark: 1.2M yield
			if yieldIndex > 150 {
				yieldIndex = 150
			}
		}

		raskIndex := (loadFactorIndex + yieldIndex) / 2

		metrics = []gin.H{
			{"label": "Load Factor Index", "value": loadFactorIndex, "change": formatChange(loadFactorIndex, 100), "trend": trendDir(loadFactorIndex, 100), "desc": formatDescAirline(loadFactorIndex, 100, "seats filled")},
			{"label": "Yield Index", "value": yieldIndex, "change": formatChange(yieldIndex, 100), "trend": trendDir(yieldIndex, 100), "desc": formatDescAirline(yieldIndex, 100, "yield")},
			{"label": "RASK Index", "value": raskIndex, "change": formatChange(raskIndex, 100), "trend": trendDir(raskIndex, 100), "desc": formatDescAirline(raskIndex, 100, "unit revenue")},
		}
	}

	// --- Comparison Chart Data (last 15 days simulated from real total) ---
	comparisonData := generateComparisonData(totalBookings, isHotel)

	// --- Pricing Data ---
	var pricingData []gin.H
	if isHotel {
		pricingData = generateHotelPricing(partner.ID)
	} else {
		pricingData = generateAirlinePricing(partner.ID)
	}

	// --- High Demand Events ---
	highDemandEvents := generateHighDemandEvents(isHotel)

	c.JSON(http.StatusOK, gin.H{
		"metrics":          metrics,
		"comparison_data":  comparisonData,
		"pricing_data":     pricingData,
		"high_demand":      highDemandEvents,
		"partner_type":     string(partner.Type),
	})
}

func generateComparisonData(bookings int64, isHotel bool) []gin.H {
	baseYou := 65
	if !isHotel {
		baseYou = 78
	}
	if bookings > 10 {
		baseYou += int(bookings / 2)
	}
	if baseYou > 95 {
		baseYou = 95
	}

	data := []gin.H{}
	now := time.Now()
	for i := 0; i < 8; i++ {
		d := now.AddDate(0, 0, -14+i*2)
		youVal := baseYou + (i%3)*3 - (i%2)*2
		marketVal := youVal - 5 - (i%3)*2
		if youVal > 99 {
			youVal = 99
		}
		if marketVal < 50 {
			marketVal = 50
		}
		data = append(data, gin.H{
			"date":   d.Format("02 Jan"),
			"you":    youVal,
			"market": marketVal,
		})
	}
	return data
}

func generateHotelPricing(partnerID uint) []gin.H {
	var hotelIDs []uint
	database.DB.Model(&models.Hotel{}).Where("partner_id = ?", partnerID).Pluck("id", &hotelIDs)

	if len(hotelIDs) == 0 {
		return []gin.H{
			{"name": "Economy", "your_price": 450000, "market_avg": 420000},
			{"name": "Standard", "your_price": 650000, "market_avg": 600000},
			{"name": "Deluxe", "your_price": 850000, "market_avg": 950000},
			{"name": "Suite", "your_price": 1250000, "market_avg": 1400000},
		}
	}

	// Get actual room prices
	rooms := []models.RoomType{}
	database.DB.Where("hotel_id IN ?", hotelIDs).Order("base_price ASC").Find(&rooms)

	result := []gin.H{}
	for _, r := range rooms {
		marketAvg := r.BasePrice * 1.05 // Assume market is 5% higher
		result = append(result, gin.H{
			"name":       r.Name,
			"your_price": r.BasePrice,
			"market_avg": marketAvg,
		})
	}

	if len(result) == 0 {
		return []gin.H{
			{"name": "Economy", "your_price": 450000, "market_avg": 420000},
			{"name": "Standard", "your_price": 650000, "market_avg": 600000},
		}
	}
	return result
}

func generateAirlinePricing(partnerID uint) []gin.H {
	var flightIDs []uint
	database.DB.Model(&models.Flight{}).Where("partner_id = ?", partnerID).Pluck("id", &flightIDs)

	if len(flightIDs) == 0 {
		return []gin.H{
			{"name": "Route 1 (Eco)", "your_price": 1250000, "market_avg": 1150000},
			{"name": "Route 2 (Eco)", "your_price": 950000, "market_avg": 1050000},
		}
	}

	flights := []models.Flight{}
	database.DB.Where("partner_id = ?", partnerID).Preload("DepartureAirport").Preload("ArrivalAirport").Limit(4).Find(&flights)

	result := []gin.H{}
	for _, f := range flights {
		seats := []models.FlightSeat{}
		database.DB.Where("flight_id = ?", f.ID).Find(&seats)
		for _, s := range seats {
			routeName := f.DepartureAirport.Code + "-" + f.ArrivalAirport.Code + " (" + string(s.Class)[:3] + ")"
			marketAvg := s.Price * 1.08 // Assume market is 8% higher
			result = append(result, gin.H{
				"name":       routeName,
				"your_price": s.Price,
				"market_avg": marketAvg,
			})
		}
	}

	if len(result) == 0 {
		return []gin.H{
			{"name": "Route 1 (Eco)", "your_price": 1250000, "market_avg": 1150000},
		}
	}
	return result
}

func generateHighDemandEvents(isHotel bool) []gin.H {
	now := time.Now()
	availLabel1 := "Sold Out"
	availLabel2 := "2 Rooms left"
	availLabel3 := "12 Rooms left"
	availLabel4 := "15 Rooms left"
	if !isHotel {
		availLabel1 = "Full Flight"
		availLabel2 = "5 Seats left"
		availLabel3 = "20 Seats left"
		availLabel4 = "High Load"
	}

	return []gin.H{
		{"date": now.AddDate(0, 0, 8).Format("Mon, 02 Jan"), "reason": "Batam Jazz Festival", "demand": "Very High", "availability": availLabel1, "color": "bg-red-500"},
		{"date": now.AddDate(0, 0, 9).Format("Mon, 02 Jan"), "reason": "Batam Jazz Festival", "demand": "Peak", "availability": availLabel2, "color": "bg-orange-500"},
		{"date": now.AddDate(0, 0, 14).Format("Mon, 02 Jan"), "reason": "Public Holiday", "demand": "High", "availability": availLabel3, "color": "bg-blue-500"},
		{"date": now.AddDate(0, 0, 24).Format("Mon, 02 Jan"), "reason": "Corporate Event", "demand": "High", "availability": availLabel4, "color": "bg-blue-500"},
	}
}

func formatChange(value, baseline int) string {
	diff := float64(value-baseline) / float64(baseline) * 100
	if diff >= 0 {
		return "+" + strconv.Itoa(int(diff)) + "%"
	}
	return strconv.Itoa(int(diff)) + "%"
}

func trendDir(value, baseline int) string {
	if value >= baseline {
		return "up"
	}
	return "down"
}

func formatDesc(value, baseline int, label string) string {
	diff := value - baseline
	if diff >= 0 {
		return "You are " + strconv.Itoa(diff) + "% above " + label
	}
	return "You are " + strconv.Itoa(-diff) + "% below " + label
}

func formatDescAirline(value, baseline int, label string) string {
	diff := value - baseline
	if diff >= 0 {
		return label + " " + strconv.Itoa(diff) + "% above avg"
	}
	return label + " " + strconv.Itoa(-diff) + "% below competitors"
}


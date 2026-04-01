package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

// SearchHotels godoc
// GET /v1/hotels?city=Bali&checkin=2026-03-01&checkout=2026-03-05&guests=2
func SearchHotels(c *gin.Context) {
	cityName := c.Query("city")
	checkinStr := c.Query("checkin")
	checkoutStr := c.Query("checkout")
	guestsStr := c.Query("guests")
	guests, _ := strconv.Atoi(guestsStr)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	query := database.DB.Model(&models.Hotel{}).
		Preload("City").
		Preload("Partner").
		Preload("Facilities").
		Preload("Images")

	// Filter by city — single lookup
	if cityName != "" {
		var city models.City
		if err := database.DB.Where("name ILIKE ?", "%"+cityName+"%").First(&city).Error; err == nil {
			query = query.Where("city_id = ?", city.ID)
		}
	}
	if guests > 0 {
		query = query.Where("room_count > 0")
	}

	// Count total
	var total int64
	query.Count(&total)

	var hotels []models.Hotel
	if err := query.Offset(offset).Limit(limit).Find(&hotels).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search hotels"})
		return
	}

	if len(hotels) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": []interface{}{}, "meta": gin.H{"page": page, "limit": limit, "total": total}})
		return
	}

	// Collect hotel IDs for batch queries
	hotelIDs := make([]uint, len(hotels))
	for i, h := range hotels {
		hotelIDs[i] = h.ID
	}

	// Batch fetch all room types for all hotels in ONE query (eliminates N+1)
	roomsQuery := database.DB.Where("hotel_id IN ?", hotelIDs)
	if guests > 0 {
		roomsQuery = roomsQuery.Where("max_guests >= ?", guests)
	}
	var allRooms []models.RoomType
	roomsQuery.Find(&allRooms)

	// Build rooms map: hotel_id -> []RoomType
	roomMap := make(map[uint][]models.RoomType)
	for _, r := range allRooms {
		roomMap[r.HotelID] = append(roomMap[r.HotelID], r)
	}

	// If date range provided, batch fetch availability in ONE query
	var availMap map[uint]models.RoomAvailability // room_type_id -> cheapest avail
	if checkinStr != "" && checkoutStr != "" {
		checkin, err1 := time.Parse("2006-01-02", checkinStr)
		checkout, err2 := time.Parse("2006-01-02", checkoutStr)
		if err1 == nil && err2 == nil && checkout.After(checkin) {
			// Collect all room type IDs
			var roomTypeIDs []uint
			for _, r := range allRooms {
				roomTypeIDs = append(roomTypeIDs, r.ID)
			}
			if len(roomTypeIDs) > 0 {
				var avails []models.RoomAvailability
				database.DB.Where(
					"room_type_id IN ? AND date >= ? AND date < ? AND available_rooms > 0",
					roomTypeIDs, checkin, checkout,
				).Order("price_override ASC NULLS LAST").Find(&avails)

				// Keep only the cheapest availability per room_type_id
				availMap = make(map[uint]models.RoomAvailability)
				for _, a := range avails {
					if _, seen := availMap[a.RoomTypeID]; !seen {
						availMap[a.RoomTypeID] = a
					}
				}
			}
		}
	}

	type HotelResponse struct {
		models.Hotel
		LowestPrice float64 `json:"lowest_price"`
	}

	results := []HotelResponse{}
	for _, h := range hotels {
		rooms := roomMap[h.ID]
		lowestPrice := 0.0
		for _, room := range rooms {
			price := room.BasePrice
			if availMap != nil {
				if avail, ok := availMap[room.ID]; ok {
					if avail.PriceOverride != nil && *avail.PriceOverride > 0 {
						price = *avail.PriceOverride
					}
				}
			}
			if lowestPrice == 0 || price < lowestPrice {
				lowestPrice = price
			}
		}
		results = append(results, HotelResponse{Hotel: h, LowestPrice: lowestPrice})
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


// GetHotelDetail godoc
// GET /v1/hotels/:id
func GetHotelDetail(c *gin.Context) {
	id := c.Param("id")

	var hotel models.Hotel
	if err := database.DB.
		Preload("City").
		Preload("Partner").
		Preload("Facilities").
		Preload("Images").
		First(&hotel, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hotel not found"})
		return
	}

	// Get room types with images
	rooms := []models.RoomType{}
	database.DB.Where("hotel_id = ?", hotel.ID).Preload("Images").Find(&rooms)

	// Get reviews
	reviews := []models.Review{}
	database.DB.Where("booking_id IN (?)",
		database.DB.Model(&models.Booking{}).Select("id").
			Where("partner_id = ? AND type = ?", hotel.PartnerID, models.BookingTypeHotel),
	).Preload("User").Find(&reviews)

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"hotel":   hotel,
			"rooms":   rooms,
			"reviews": reviews,
		},
	})
}

// GetCities godoc
// GET /v1/cities?popular=true&q=Bali
func GetCities(c *gin.Context) {
	popular := c.Query("popular")
	q := c.Query("q")

	query := database.DB.Model(&models.City{})

	if popular == "true" {
		query = query.Where("is_popular = ?", true)
	}

	if q != "" {
		query = query.Where("name ILIKE ?", "%"+q+"%")
	}

	cities := []models.City{}
	if err := query.Limit(20).Find(&cities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cities"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cities})
}

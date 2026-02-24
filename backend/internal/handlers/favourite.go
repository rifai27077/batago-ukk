package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

type ToggleFavouriteInput struct {
	Type     models.FavouriteType `json:"type" binding:"required"`
	FlightID uint                 `json:"flight_id"`
	HotelID  uint                 `json:"hotel_id"`
}

func ToggleFavourite(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var input ToggleFavouriteInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var fav models.Favourite
	query := database.DB.Where("user_id = ? AND type = ?", userID, input.Type)
	
	if input.Type == models.FavouriteTypeFlight {
		if input.FlightID == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "flight_id is required for type flight"})
			return
		}
		query = query.Where("flight_id = ?", input.FlightID)
	} else if input.Type == models.FavouriteTypeHotel {
		if input.HotelID == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "hotel_id is required for type hotel"})
			return
		}
		query = query.Where("hotel_id = ?", input.HotelID)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid type"})
		return
	}

	result := query.First(&fav)
	if result.Error == nil {
		// Already exists, so delete (Untoggle)
		database.DB.Unscoped().Delete(&fav)
		c.JSON(http.StatusOK, gin.H{"message": "Removed from favourites", "is_favourite": false})
		return
	}

	// Create new favourite
	newFav := models.Favourite{
		UserID: userID,
		Type:   input.Type,
	}

	if input.Type == models.FavouriteTypeFlight {
		newFav.FlightID = &input.FlightID
	} else {
		newFav.HotelID = &input.HotelID
	}

	if err := database.DB.Create(&newFav).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save favourite"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Added to favourites", "is_favourite": true})
}

func GetFavourites(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	favType := c.Query("type") // flight or hotel

	var favourites []models.Favourite
	query := database.DB.Where("user_id = ?", userID)

	if favType != "" {
		query = query.Where("type = ?", favType)
	}

	// Preload based on type or just preload both
	err := query.Preload("Flight").Preload("Hotel").Preload("Hotel.City").Preload("Hotel.Images").Find(&favourites).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch favourites"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": favourites})
}

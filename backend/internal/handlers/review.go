package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

type ReviewInput struct {
	BookingID uint   `json:"booking_id" binding:"required"`
	Rating    int    `json:"rating" binding:"required,min=1,max=5"`
	Comment   string `json:"comment"`
}

func CreateReview(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(uint)

	var input ReviewInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify booking belongs to user and is completed
	var booking models.Booking
	if err := database.DB.Where("id = ? AND user_id = ?", input.BookingID, uid).
		First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	if booking.BookingStatus != models.BookingStatusCompleted {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can only review completed bookings"})
		return
	}

	// Check if review already exists
	var existing models.Review
	if err := database.DB.Where("booking_id = ?", input.BookingID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Review already exists for this booking"})
		return
	}

	review := models.Review{
		BookingID: input.BookingID,
		UserID:    uid,
		Rating:    input.Rating,
		Comment:   input.Comment,
	}

	if err := database.DB.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Review submitted successfully",
		"data":    review,
	})
}

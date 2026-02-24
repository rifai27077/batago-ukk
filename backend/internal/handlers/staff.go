package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

func GetPartnerStaff(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	staff := []models.PartnerStaff{}
	database.DB.Where("partner_id = ?", partner.ID).Preload("User").Find(&staff)

	c.JSON(http.StatusOK, gin.H{"data": staff})
}

type AddStaffInput struct {
	Email string `json:"email" binding:"required,email"`
	Role  string `json:"role" binding:"required"`
}

func AddPartnerStaff(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var input AddStaffInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User with this email not found. They must register first."})
		return
	}

	// Check if already staff
	var existing models.PartnerStaff
	if err := database.DB.Where("partner_id = ? AND user_id = ?", partner.ID, user.ID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User is already a staff member"})
		return
	}

	staff := models.PartnerStaff{
		PartnerID: partner.ID,
		UserID:    user.ID,
		Role:      models.PartnerRole(input.Role),
	}

	if err := database.DB.Create(&staff).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add staff"})
		return
	}

	database.DB.Preload("User").First(&staff, staff.ID)

	c.JSON(http.StatusCreated, gin.H{"message": "Staff added successfully", "data": staff})
}

func RemovePartnerStaff(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	staffID := c.Param("id")

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var staff models.PartnerStaff
	if err := database.DB.Where("id = ? AND partner_id = ?", staffID, partner.ID).First(&staff).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Staff member not found"})
		return
	}

	if err := database.DB.Delete(&staff).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove staff"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Staff member removed"})
}

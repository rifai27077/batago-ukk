package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

// ==================== PARTNER FLEET ====================

// GetPartnerFleet returns all aircraft for the authenticated partner
// GET /v1/partner/fleet
func GetPartnerFleet(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")
	offset := (page - 1) * limit

	query := database.DB.Where("partner_id = ?", partner.ID)
	if search != "" {
		query = query.Where("registration LIKE ? OR model LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	var total int64
	query.Model(&models.Aircraft{}).Count(&total)

	aircraft := []models.Aircraft{}
	query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&aircraft)

	// Calculate stats
	var maintenanceCount int64
	database.DB.Model(&models.Aircraft{}).Where("partner_id = ? AND status = ?", partner.ID, models.AircraftStatusMaintenance).Count(&maintenanceCount)

	var activeCount int64
	database.DB.Model(&models.Aircraft{}).Where("partner_id = ? AND status = ?", partner.ID, models.AircraftStatusActive).Count(&activeCount)

	utilization := 0.0
	if total > 0 {
		utilization = float64(activeCount) / float64(total) * 100
	}

	c.JSON(http.StatusOK, gin.H{
		"data": aircraft,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
		"stats": gin.H{
			"total":       total,
			"maintenance": maintenanceCount,
			"utilization": int(utilization),
		},
	})
}

type CreateAircraftInput struct {
	Registration      string `json:"registration" binding:"required"`
	Model             string `json:"model" binding:"required"`
	Capacity          int    `json:"capacity" binding:"required"`
	YearOfManufacture string `json:"yom"`
	Status            string `json:"status"`
}

// CreateAircraft adds a new aircraft to the partner's fleet
// POST /v1/partner/fleet
func CreateAircraft(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var input CreateAircraftInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	status := models.AircraftStatusActive
	if input.Status == "maintenance" {
		status = models.AircraftStatusMaintenance
	}

	aircraft := models.Aircraft{
		PartnerID:         partner.ID,
		Registration:      input.Registration,
		AircraftModel:     input.Model,
		Capacity:          input.Capacity,
		YearOfManufacture: input.YearOfManufacture,
		Status:            status,
	}

	if err := database.DB.Create(&aircraft).Error; err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "An aircraft with this registration number already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create aircraft"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Aircraft added", "data": aircraft})
}

// UpdateAircraft updates an aircraft belonging to the partner
// PUT /v1/partner/fleet/:id
func UpdateAircraft(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	aircraftID := c.Param("id")

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var aircraft models.Aircraft
	if err := database.DB.Where("id = ? AND partner_id = ?", aircraftID, partner.ID).First(&aircraft).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aircraft not found"})
		return
	}

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Map generic JSON keys to correct SQL column names
	if yom, exists := input["yom"]; exists {
		input["year_of_manufacture"] = yom
		delete(input, "yom")
	}

	if err := database.DB.Model(&aircraft).Updates(input).Error; err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "An aircraft with this registration number already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update aircraft"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Aircraft updated", "data": aircraft})
}

// DeleteAircraft removes an aircraft from the partner's fleet
// DELETE /v1/partner/fleet/:id
func DeleteAircraft(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	aircraftID := c.Param("id")

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var aircraft models.Aircraft
	if err := database.DB.Where("id = ? AND partner_id = ?", aircraftID, partner.ID).First(&aircraft).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aircraft not found"})
		return
	}

	if err := database.DB.Delete(&aircraft).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete aircraft"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Aircraft deleted"})
}

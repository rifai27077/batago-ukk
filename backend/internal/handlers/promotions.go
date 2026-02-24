package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
)

func parseDate(s string) (time.Time, error) {
	if s == "" {
		return time.Time{}, nil
	}
	return time.Parse("2006-01-02", s)
}

func GetPublicPromotions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "12"))
	promoType := c.Query("type")
	search := c.Query("search")
	offset := (page - 1) * limit

	query := database.DB.Model(&models.Promotion{}).
		Where("status = ?", models.PromotionActive).
		Where("start_date <= ?", time.Now()).
		Where("end_date >= ?", time.Now())

	if promoType != "" && promoType != "all" {
		query = query.Where("type = ?", promoType)
	}
	if search != "" {
		query = query.Where("name ILIKE ? OR code ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	var total int64
	query.Count(&total)

	promotions := []models.Promotion{}
	query.Preload("Partner").Order("discount DESC").Offset(offset).Limit(limit).Find(&promotions)

	c.JSON(http.StatusOK, gin.H{
		"data": promotions,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

func ValidatePromoCode(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Promo code is required"})
		return
	}

	var promotion models.Promotion
	err := database.DB.Where("code = ? AND status = ?", code, models.PromotionActive).
		Where("start_date <= ? AND end_date >= ?", time.Now(), time.Now()).
		First(&promotion).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invalid or expired promo code"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Promo code is valid",
		"discount": promotion.Discount,
		"type":     promotion.Type,
		"name":     promotion.Name,
	})
}

func GetPartnerPromotions(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")
	search := c.Query("search")
	offset := (page - 1) * limit

	query := database.DB.Where("partner_id = ?", partner.ID)
	if status != "" && status != "all" {
		query = query.Where("status = ?", status)
	}
	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%")
	}

	var total int64
	query.Model(&models.Promotion{}).Count(&total)

	promotions := []models.Promotion{}
	query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&promotions)

	// Calculate stats
	var totalActive int64
	database.DB.Model(&models.Promotion{}).Where("partner_id = ? AND status = ?", partner.ID, models.PromotionActive).Count(&totalActive)

	var totalClaims int64
	database.DB.Model(&models.Promotion{}).Where("partner_id = ?", partner.ID).Select("COALESCE(SUM(claims), 0)").Scan(&totalClaims)

	var totalRevenue float64
	database.DB.Model(&models.Promotion{}).Where("partner_id = ?", partner.ID).Select("COALESCE(SUM(revenue), 0)").Scan(&totalRevenue)

	c.JSON(http.StatusOK, gin.H{
		"data": promotions,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
			"stats": gin.H{
				"total_active":  totalActive,
				"total_claims":  totalClaims,
				"total_revenue": totalRevenue,
			},
		},
	})
}

type CreatePromotionInput struct {
	Name        string  `json:"name" binding:"required"`
	Code        string  `json:"code" binding:"required"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	Type        string  `json:"type" binding:"required"`
	Discount    float64 `json:"discount" binding:"required"`
	Status      string  `json:"status"`
	StartDate   string  `json:"start_date" binding:"required"`
	EndDate     string  `json:"end_date" binding:"required"`
	Listings    []uint  `json:"listings"`
}

func CreatePartnerPromotion(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var input CreatePromotionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse dates
	startDate, err := parseDate(input.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format. Use YYYY-MM-DD"})
		return
	}
	endDate, err := parseDate(input.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end_date format. Use YYYY-MM-DD"})
		return
	}

	status := models.PromotionActive
	if input.Status != "" {
		status = models.PromotionStatus(input.Status)
	}

	promotion := models.Promotion{
		PartnerID:   partner.ID,
		Name:        input.Name,
		Code:        input.Code,
		Description: input.Description,
		ImageURL:    input.ImageURL,
		Type:        models.PromotionType(input.Type),
		Discount:    input.Discount,
		Status:      status,
		StartDate:   startDate,
		EndDate:     endDate,
		Listings:    input.Listings,
	}

	if err := database.DB.Create(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create promotion"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Promotion created", "data": promotion})
}

func UpdatePartnerPromotion(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	promoID := c.Param("id")

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var promotion models.Promotion
	if err := database.DB.Where("id = ? AND partner_id = ?", promoID, partner.ID).First(&promotion).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		return
	}

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Model(&promotion).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion updated", "data": promotion})
}

func DeletePartnerPromotion(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	promoID := c.Param("id")

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var promotion models.Promotion
	if err := database.DB.Where("id = ? AND partner_id = ?", promoID, partner.ID).First(&promotion).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		return
	}

	if err := database.DB.Delete(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion deleted"})
}

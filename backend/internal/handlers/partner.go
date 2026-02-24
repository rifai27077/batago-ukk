package handlers

import (
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func formatTimeAgo(t time.Time) string {
	diff := time.Since(t)
	switch {
	case diff < time.Minute:
		return "Baru saja"
	case diff < time.Hour:
		return fmt.Sprintf("%d menit lalu", int(diff.Minutes()))
	case diff < 24*time.Hour:
		return fmt.Sprintf("%d jam lalu", int(diff.Hours()))
	default:
		return fmt.Sprintf("%d hari lalu", int(diff.Hours()/24))
	}
}

func formatAmount(v float64) string {
	if v >= 1_000_000 {
		return fmt.Sprintf("%.1fjt", v/1_000_000)
	}
	return fmt.Sprintf("%.0f", math.Round(v))
}

type RegisterPartnerInput struct {
	Name        string             `json:"name" binding:"required"`
	Email       string             `json:"email" binding:"required,email"`
	Password    string             `json:"password" binding:"required,min=6"`
	Phone       string             `json:"phone"`
	CompanyName string             `json:"company_name" binding:"required"`
	Type        models.PartnerType `json:"type" binding:"required"`
	Address     string             `json:"address" binding:"required"`
}

func RegisterPartner(c *gin.Context) {
	var input RegisterPartnerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start transaction
	tx := database.DB.Begin()

	// 1. Check if email exists
	var existingUser models.User
	if err := tx.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		tx.Rollback()
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// 2. Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// 3. Create User
	verificationCode := GenerateVerificationCode() 
	user := models.User{
		Name:             input.Name,
		Email:            input.Email,
		Password:         string(hashedPassword),
		Role:             models.RoleUser,
		Phone:            input.Phone,
		IsVerified:       false,
		VerificationCode: verificationCode,
	}

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// 4. Create Partner record
	partner := models.Partner{
		UserID:      user.ID,
		CompanyName: input.CompanyName,
		Type:        input.Type,
		Status:      models.PartnerStatusInReview,
	}

	if err := tx.Create(&partner).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create partner record"})
		return
	}

	tx.Commit()

	// Simulate email sending
	println("==================================================")
	println("PARTNER VERIFICATION CODE FOR " + user.Email + ": " + verificationCode)
	println("==================================================")

	c.JSON(http.StatusCreated, gin.H{
		"message": "Partner registration successful. Please verify your email.",
		"email":   user.Email,
	})
}

type BecomePartnerInput struct {
	CompanyName string             `json:"company_name" binding:"required"`
	Type        models.PartnerType `json:"type" binding:"required"`
	Address     string             `json:"address" binding:"required"`
}

func BecomePartner(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var input BecomePartnerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user is already a partner
	var existingPartner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&existingPartner).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You are already registered as a partner"})
		return
	}

	// Create partner record
	partner := models.Partner{
		UserID:      userID,
		CompanyName: input.CompanyName,
		Type:        input.Type,
		Status:      models.PartnerStatusInReview,
	}

	if err := database.DB.Create(&partner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create partner record"})
		return
	}

	// User remains with RoleUser until Approved.
	// The AfterSave hook or GetProfile fail-safe will handle the transition once Status is APPROVED.

	c.JSON(http.StatusCreated, gin.H{
		"message": "Partner application submitted successfully. It is now in review.",
		"partner": partner,
	})
}

func GetDashboardStats(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{
			"bookings":        gin.H{"total": 0, "trend": 0},
			"revenue":         gin.H{"total": 0, "trend": 0},
			"occupancy":       gin.H{"rate": 0, "trend": 0},
			"rating":          gin.H{"average": 0, "count": 0, "trend": 0},
			"recent_activity": []gin.H{},
		}})
		return
	}

	// Total bookings
	var totalBookings int64
	database.DB.Model(&models.Booking{}).Where("partner_id = ?", partner.ID).Count(&totalBookings)

	// Total revenue (from paid bookings)
	var totalRevenue float64
	database.DB.Model(&models.Booking{}).
		Where("partner_id = ? AND payment_status = ?", partner.ID, models.PaymentStatusPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalRevenue)

	// Rating: average + count from reviews linked to partner bookings
	var bookingIDs []uint
	database.DB.Model(&models.Booking{}).Where("partner_id = ?", partner.ID).Pluck("id", &bookingIDs)

	var avgRating float64
	var reviewCount int64
	if len(bookingIDs) > 0 {
		database.DB.Model(&models.Review{}).Where("booking_id IN ?", bookingIDs).Count(&reviewCount)
		database.DB.Model(&models.Review{}).Where("booking_id IN ?", bookingIDs).
			Select("COALESCE(AVG(rating), 0)").Scan(&avgRating)
	}

	// Occupancy: count of active/confirmed bookings vs total listings
	var confirmedBookings int64
	database.DB.Model(&models.Booking{}).
		Where("partner_id = ? AND booking_status IN ?", partner.ID, []string{"CONFIRMED", "CHECKED_IN"}).
		Count(&confirmedBookings)

	var totalListings int64
	database.DB.Model(&models.Hotel{}).Where("partner_id = ?", partner.ID).Count(&totalListings)

	occupancyRate := 0.0
	if totalListings > 0 {
		occupancyRate = float64(confirmedBookings) / float64(totalListings) * 100
		if occupancyRate > 100 {
			occupancyRate = 100
		}
	}

	// Recent activity: latest 5 bookings
	recentBookings := []models.Booking{}
	database.DB.Where("partner_id = ?", partner.ID).
		Preload("User").Order("created_at DESC").Limit(5).Find(&recentBookings)

	recentActivity := []gin.H{}
	for _, b := range recentBookings {
		guestName := "Guest"
		if b.User.Name != "" {
			guestName = b.User.Name
		}

		timeAgo := formatTimeAgo(b.CreatedAt)

		actType := "booking"
		title := "Booking baru"
		desc := guestName + " — " + b.BookingCode

		if b.PaymentStatus == models.PaymentStatusPaid {
			actType = "payment"
			title = "Pembayaran diterima"
			desc = "Rp " + formatAmount(b.TotalAmount) + " dari " + guestName
		}

		recentActivity = append(recentActivity, gin.H{
			"title": title,
			"desc":  desc,
			"time":  timeAgo,
			"type":  actType,
		})
	}

	stats := gin.H{
		"bookings": gin.H{
			"total": totalBookings,
			"trend": 0,
		},
		"revenue": gin.H{
			"total": totalRevenue,
			"trend": 0,
		},
		"occupancy": gin.H{
			"rate":  int(occupancyRate),
			"trend": 0,
		},
		"rating": gin.H{
			"average": float64(int(avgRating*10)) / 10, // round to 1 decimal
			"count":   reviewCount,
			"trend":   0,
		},
		"recent_activity": recentActivity,
	}

	c.JSON(http.StatusOK, gin.H{"data": stats})
}

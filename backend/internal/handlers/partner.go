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
	if err := database.DB.Preload("User").Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{
			"bookings":        gin.H{"total": 0, "trend": 0},
			"revenue":         gin.H{"total": 0, "trend": 0},
			"occupancy":       gin.H{"rate": 0, "trend": 0},
			"rating":          gin.H{"average": 0, "count": 0, "trend": 0},
			"recent_activity": []gin.H{},
			"onboarding":      []gin.H{},
		}})
		return
	}

	// 1. Bookings Statistics & Trend
	var totalBookings int64
	database.DB.Model(&models.Booking{}).Where("partner_id = ?", partner.ID).Count(&totalBookings)

	now := time.Now()
	thirtyDaysAgo := now.AddDate(0, 0, -30)
	sixtyDaysAgo := now.AddDate(0, 0, -60)

	var last30DaysBookings int64
	database.DB.Model(&models.Booking{}).Where("partner_id = ? AND created_at >= ?", partner.ID, thirtyDaysAgo).Count(&last30DaysBookings)

	var prev30DaysBookings int64
	database.DB.Model(&models.Booking{}).Where("partner_id = ? AND created_at >= ? AND created_at < ?", partner.ID, sixtyDaysAgo, thirtyDaysAgo).Count(&prev30DaysBookings)

	bookingTrend := 0.0
	if prev30DaysBookings > 0 {
		bookingTrend = math.Round(float64(last30DaysBookings-prev30DaysBookings)/float64(prev30DaysBookings)*1000) / 10
	} else if last30DaysBookings > 0 {
		bookingTrend = 100
	}

	// 2. Revenue Statistics & Trend
	var totalRevenue float64
	database.DB.Model(&models.Booking{}).
		Where("partner_id = ? AND payment_status = ?", partner.ID, models.PaymentStatusPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalRevenue)

	var last30DaysRevenue float64
	database.DB.Model(&models.Booking{}).
		Where("partner_id = ? AND payment_status = ? AND created_at >= ?", partner.ID, models.PaymentStatusPaid, thirtyDaysAgo).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&last30DaysRevenue)

	var prev30DaysRevenue float64
	database.DB.Model(&models.Booking{}).
		Where("partner_id = ? AND payment_status = ? AND created_at >= ? AND created_at < ?", partner.ID, models.PaymentStatusPaid, sixtyDaysAgo, thirtyDaysAgo).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&prev30DaysRevenue)

	revenueTrend := 0.0
	if prev30DaysRevenue > 0 {
		revenueTrend = math.Round((last30DaysRevenue-prev30DaysRevenue)/prev30DaysRevenue*1000) / 10
	} else if last30DaysRevenue > 0 {
		revenueTrend = 100
	}

	// 3. Rating & Reviews
	var bookingIDs []uint
	database.DB.Model(&models.Booking{}).Where("partner_id = ?", partner.ID).Pluck("id", &bookingIDs)

	var avgRating float64
	var reviewCount int64
	if len(bookingIDs) > 0 {
		database.DB.Model(&models.Review{}).Where("booking_id IN ?", bookingIDs).Count(&reviewCount)
		database.DB.Model(&models.Review{}).Where("booking_id IN ?", bookingIDs).
			Select("COALESCE(AVG(rating), 0)").Scan(&avgRating)
	}

	// 4. Occupancy Rate
	var confirmedBookings int64
	database.DB.Model(&models.Booking{}).
		Where("partner_id = ? AND booking_status IN ?", partner.ID, []string{"CONFIRMED", "CHECKED_IN"}).
		Count(&confirmedBookings)

	var totalListings int64
	if partner.Type == "airline" {
		database.DB.Model(&models.Flight{}).Where("partner_id = ?", partner.ID).Count(&totalListings)
	} else {
		database.DB.Model(&models.Hotel{}).Where("partner_id = ?", partner.ID).Count(&totalListings)
	}

	occupancyRate := 0.0
	if totalListings > 0 {
		occupancyRate = float64(confirmedBookings) / float64(totalListings) * 100
		if occupancyRate > 100 {
			occupancyRate = 100
		}
	}

	// 5. Recent Activity
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
		title := "New booking"
		desc := guestName + " — " + b.BookingCode

		if b.PaymentStatus == models.PaymentStatusPaid {
			actType = "payment"
			title = "Payment received"
			desc = "Rp " + formatAmount(b.TotalAmount) + " from " + guestName
		}

		recentActivity = append(recentActivity, gin.H{
			"title": title,
			"desc":  desc,
			"time":  timeAgo,
			"type":  actType,
		})
	}

	// 6. Onboarding Steps
	onboarding := []gin.H{}

	// Step 1: Complete Profile
	// Check if User.Name and CompanyName are filled
	profileStatus := "current"
	if partner.User.Name != "" && partner.CompanyName != "" {
		profileStatus = "completed"
	}
	onboarding = append(onboarding, gin.H{
		"id":     1,
		"title":  "Complete Profile",
		"status": profileStatus,
	})

	// Step 2: Verify Identity
	// Check if Partner.Status is approved
	identityStatus := "pending"
	if profileStatus == "completed" {
		if partner.Status == models.PartnerStatusApproved {
			identityStatus = "completed"
		} else if partner.Status == models.PartnerStatusInReview {
			identityStatus = "in_review"
		} else {
			identityStatus = "current"
		}
	}
	onboarding = append(onboarding, gin.H{
		"id":     2,
		"title":  "Verify Identity",
		"status": identityStatus,
	})

	// Check Bank Account
	var bankAccount models.BankAccount
	if err := database.DB.Where("partner_id = ?", partner.ID).First(&bankAccount).Error; err == nil {
		onboarding = append(onboarding, gin.H{"id": 3, "title": "Add Bank Account", "status": "completed"})
	} else {
		onboarding = append(onboarding, gin.H{"id": 3, "title": "Add Bank Account", "status": "current"})
	}

	// Check First Listing
	if totalListings > 0 {
		onboarding = append(onboarding, gin.H{"id": 4, "title": "List First Property/Route", "status": "completed"})
	} else {
		onboarding = append(onboarding, gin.H{"id": 4, "title": "List First Property/Route", "status": "pending"})
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"bookings": gin.H{
				"total": totalBookings,
				"trend": bookingTrend,
			},
			"revenue": gin.H{
				"total": totalRevenue,
				"trend": revenueTrend,
			},
			"occupancy": gin.H{
				"rate":  int(occupancyRate),
				"trend": 0,
			},
			"rating": gin.H{
				"average": float64(int(avgRating*10)) / 10,
				"count":   reviewCount,
				"trend":   0,
			},
			"recent_activity": recentActivity,
			"onboarding":      onboarding,
		},
	})
}

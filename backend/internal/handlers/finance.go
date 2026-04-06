package handlers

import (
	"strconv"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"

	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetPayoutSettings(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var account models.BankAccount
	// Try fetching the primary bank account
	errAcc := database.DB.Where("partner_id = ? AND is_primary = ?", partner.ID, true).First(&account).Error

	var setting models.PayoutSetting
	errSet := database.DB.Where("partner_id = ?", partner.ID).First(&setting).Error

	response := gin.H{}

	if errAcc == nil {
		response["bank_account"] = account
	} else {
		response["bank_account"] = nil
	}

	if errSet == nil {
		response["settings"] = setting
	} else {
		// Default settings
		response["settings"] = gin.H{
			"schedule":         "Weekly",
			"threshold_amount": 500000,
		}
	}

	c.JSON(http.StatusOK, response)
}

func UpdatePayoutSettings(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var req struct {
		BankName          string  `json:"bank_name"`
		AccountNumber     string  `json:"account_number"`
		AccountHolderName string  `json:"account_holder_name"`
		Schedule          string  `json:"schedule"`
		ThresholdAmount   float64 `json:"threshold_amount"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Upsert Bank Account
	var account models.BankAccount
	if err := database.DB.Where("partner_id = ? AND is_primary = ?", partner.ID, true).First(&account).Error; err != nil {
		account = models.BankAccount{
			PartnerID:         partner.ID,
			IsPrimary:         true,
			BankName:          req.BankName,
			AccountNumber:     req.AccountNumber,
			AccountHolderName: req.AccountHolderName,
		}
		if err := database.DB.Create(&account).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create bank account: " + err.Error()})
			return
		}
	} else {
		account.BankName = req.BankName
		account.AccountNumber = req.AccountNumber
		account.AccountHolderName = req.AccountHolderName
		if err := database.DB.Save(&account).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update bank account: " + err.Error()})
			return
		}
	}

	// Upsert Settings
	var setting models.PayoutSetting
	if err := database.DB.Where("partner_id = ?", partner.ID).First(&setting).Error; err != nil {
		setting = models.PayoutSetting{
			PartnerID:       partner.ID,
			Schedule:        req.Schedule,
			ThresholdAmount: req.ThresholdAmount,
		}
		if err := database.DB.Create(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payout settings: " + err.Error()})
			return
		}
	} else {
		setting.Schedule = req.Schedule
		setting.ThresholdAmount = req.ThresholdAmount
		if err := database.DB.Save(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payout settings: " + err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Payout settings updated successfully",
		"bank_account": account,
		"settings":     setting,
	})
}

func RequestEarlyPayout(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	var partner models.Partner
	if err := database.DB.Where("user_id = ?", userID).First(&partner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	var req struct {
		Amount float64 `json:"amount" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate bank account exists
	var account models.BankAccount
	if err := database.DB.Where("partner_id = ? AND is_primary = ?", partner.ID, true).First(&account).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No primary bank account configured. Please setup your payout settings first."})
		return
	}

	// Mocking balance validation
	// Ideally, calculate: Total Earnings - Total Paid - Pending requests
	
	// Create payout request
	request := models.PayoutRequest{
		PartnerID:     partner.ID,
		Amount:        req.Amount,
		Status:        "pending",
		BankAccountID: account.ID,
		RequestedAt:   time.Now(),
	}

	if err := database.DB.Create(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payout request"})
		return
	}

	// Notify Partner
	importStrconv := strconv.FormatFloat(req.Amount, 'f', 0, 64) // need to assure strconv is imported
	database.DB.Create(&models.Notification{
		UserID:  userID,
		Type:    models.NotificationTypeInfo,
		Title:   "Payout Request Submitted",
		Message: "Your early payout request for Rp " + importStrconv + " has been submitted and is being processed.",
		Link:    "/partner/dashboard/finance",
	})

	// Notify Admins
	var adminUsers []models.User
	database.DB.Where("role = ?", models.RoleAdmin).Find(&adminUsers)
	for _, admin := range adminUsers {
		database.DB.Create(&models.Notification{
			UserID:  admin.ID,
			Type:    models.NotificationTypeInfo,
			Title:   "New Payout Request",
			Message: partner.CompanyName + " requested a payout of Rp " + importStrconv + ".",
			Link:    "/admin/finance/payouts",
		})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Early payout request submitted successfully"})
}

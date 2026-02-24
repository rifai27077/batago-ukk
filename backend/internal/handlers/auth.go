package handlers

import (
	"log"
	"net/http"

	"math/rand"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/middleware"
	"github.com/rifai27077/batago-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

const charset = "0123456789"

func GenerateVerificationCode() string {
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, 6)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

type VerificationInput struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

type RegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Phone    string `json:"phone"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

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

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// In a real app, send email here. For now, we simulate it.
	// Log the code so the developer/user can see it
	println("==================================================")
	println("VERIFICATION CODE FOR " + user.Email + ": " + verificationCode)
	println("==================================================")

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration successful. Please verify your email.",
		"email":   user.Email,
	})
}

func VerifyEmail(c *gin.Context) {
	var input VerificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.IsVerified {
		c.JSON(http.StatusOK, gin.H{"message": "Email already verified"})
		return
	}

	if user.VerificationCode != input.Code {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid verification code"})
		return
	}

	// Update user status
	user.IsVerified = true
	user.VerificationCode = "" // Clear code
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email verified successfully"})
}

type ResendVerificationInput struct {
	Email string `json:"email" binding:"required,email"`
}

func ResendVerification(c *gin.Context) {
	var input ResendVerificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.IsVerified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already verified"})
		return
	}

	verificationCode := GenerateVerificationCode()
	user.VerificationCode = verificationCode
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update verification code"})
		return
	}

	// In a real app, send email here. For now, we simulate it.
	println("==================================================")
	println("RESEND VERIFICATION CODE FOR " + user.Email + ": " + verificationCode)
	println("==================================================")

	c.JSON(http.StatusOK, gin.H{"message": "Verification code resent"})
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !user.IsVerified {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Email not verified",
			"code":  "EMAIL_NOT_VERIFIED",
			"email": user.Email,
		})
		return
	}

	token, err := middleware.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
			"phone": user.Phone,
		},
	})
}

func GetProfile(c *gin.Context) {
	userID := c.MustGet("user_id")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	avatarURL := user.AvatarURL
	if avatarURL == "" {
		avatarURL = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.Email
	}

	var partner models.Partner
	partnerStatus := ""
	partnerCompanyName := ""
	partnerType := ""
	partnerAddress := ""
	if err := database.DB.Where("user_id = ?", user.ID).First(&partner).Error; err == nil {
		partnerStatus = string(partner.Status)
		partnerCompanyName = partner.CompanyName
		partnerType = string(partner.Type)

		// Sync Role if it's out of sync (Fail-safe)
		if partner.Status == models.PartnerStatusApproved && user.Role != models.RolePartner {
			user.Role = models.RolePartner
			database.DB.Model(&user).Update("role", models.RolePartner)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":                   user.ID,
			"name":                 user.Name,
			"email":                user.Email,
			"role":                  user.Role,
			"phone":                 user.Phone,
			"avatar_url":            avatarURL,
			"created_at":            user.CreatedAt,
			"is_verified":           user.IsVerified,
			"partner_status":        partnerStatus,
			"partner_company_name": partnerCompanyName,
			"partner_type":         partnerType,
			"partner_address":      partnerAddress,
		},
	})
}

type UpdateProfileInput struct {
	Name         string `json:"name"`
	Phone        string `json:"phone"`
	CompanyName  string `json:"company_name"`
	CompanyType  string `json:"company_type"`
	Address      string `json:"address"`
}

func UpdateProfile(c *gin.Context) {
	userID := c.MustGet("user_id")
	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update fields if provided
	if input.Name != "" {
		user.Name = input.Name
	}
	if input.Phone != "" {
		user.Phone = input.Phone
	}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	// Update Partner info
	var partner models.Partner
	if err := database.DB.Where("user_id = ?", user.ID).First(&partner).Error; err == nil {
		if input.CompanyName != "" {
			partner.CompanyName = input.CompanyName
		}
		if input.CompanyType != "" {
			partner.Type = models.PartnerType(input.CompanyType)
		}
		// partner.Address = input.Address // Add this if column exists
		database.DB.Save(&partner)
	}

	avatarURL := user.AvatarURL
	if avatarURL == "" {
		avatarURL = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.Email
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
		"user": gin.H{
			"id":         user.ID,
			"name":       user.Name,
			"email":      user.Email,
			"role":       user.Role,
			"phone":      user.Phone,
			"avatar_url": avatarURL,
			"created_at": user.CreatedAt,
		},
	})
}

func UploadAvatar(c *gin.Context) {
	userID := c.MustGet("user_id")

	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// In production, upload to S3/Cloudinary. Here we verify extensions and save locally.
	// Allow: jpg, jpeg, png
	// ... (validation logic would go here)

	// Save file with unique name
	filename := time.Now().Format("20060102150405") + "_" + file.Filename
	dst := "./uploads/" + filename

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Use full URL if possible, or relative to backend root
	// Assuming backend runs on :8080
	avatarURL := "http://localhost:8080/uploads/" + filename

	// Update user avatar_url
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.AvatarURL = avatarURL
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update avatar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Avatar uploaded successfully",
		"avatar_url": avatarURL,
	})
}

type ForgotPasswordInput struct {
	Email string `json:"email" binding:"required,email"`
}

func ForgotPassword(c *gin.Context) {
	var input ForgotPasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		// For security, don't reveal if user doesn't exist. 
		// Just return success message.
		c.JSON(http.StatusOK, gin.H{"message": "If your email is registered, you will receive a reset code."})
		return
	}

	resetCode := GenerateVerificationCode()
	user.ResetCode = resetCode
	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Error saving reset code: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate reset code"})
		return
	}

	// In a real app, send email here.
	println("==================================================")
	println("PASSWORD RESET CODE FOR " + user.Email + ": " + resetCode)
	println("==================================================")

	c.JSON(http.StatusOK, gin.H{"message": "Reset code sent successfully"})
}

type ResetPasswordInput struct {
	Email           string `json:"email" binding:"required,email"`
	Code            string `json:"code" binding:"required"`
	Password        string `json:"password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password"`
}

func ResetPassword(c *gin.Context) {
	var input ResetPasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.ResetCode == "" || user.ResetCode != input.Code {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired reset code"})
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)
	user.ResetCode = "" // Clear code
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully. You can now login with your new password."})
}

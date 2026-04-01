package handlers_test

import (
	"net/http"
	"strings"
	"testing"

	"github.com/rifai27077/batago-backend/internal/handlers"
	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/testutil"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func setupAuthRouter() *testutil.RouterHelper {
	rh := testutil.NewRouterHelper()
	rh.R.POST("/register", handlers.Register)
	rh.R.POST("/verify", handlers.VerifyEmail)
	rh.R.POST("/login", handlers.Login)
	rh.R.POST("/forgot-password", handlers.ForgotPassword)
	rh.R.POST("/reset-password", handlers.ResetPassword)
	return rh
}

// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────

func TestRegister_Success(t *testing.T) {
	testutil.SetupTestDB()
	rh := setupAuthRouter()

	w := rh.Post("/register", `{"name":"Budi","email":"budi@test.com","password":"secret123","phone":"08123"}`)
	assert.Equal(t, http.StatusCreated, w.Code)

	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.Equal(t, "Registration successful. Please verify your email.", resp["message"])
}

func TestRegister_MissingFields(t *testing.T) {
	testutil.SetupTestDB()
	rh := setupAuthRouter()

	w := rh.Post("/register", `{"email":"budi@test.com"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestRegister_DuplicateEmail(t *testing.T) {
	db := testutil.SetupTestDB()
	testutil.SeedUser(db, "Budi", "budi@test.com", "hashed", models.RoleUser, false)
	rh := setupAuthRouter()

	w := rh.Post("/register", `{"name":"Budi2","email":"budi@test.com","password":"secret123"}`)
	assert.Equal(t, http.StatusConflict, w.Code)
}

// ─────────────────────────────────────────────
// VerifyEmail
// ─────────────────────────────────────────────

func TestVerifyEmail_Success(t *testing.T) {
	db := testutil.SetupTestDB()
	u := models.User{Name: "Adi", Email: "adi@test.com", Password: "x", Role: models.RoleUser, IsVerified: false, VerificationCode: "123456"}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/verify", `{"email":"adi@test.com","code":"123456"}`)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestVerifyEmail_WrongCode(t *testing.T) {
	db := testutil.SetupTestDB()
	u := models.User{Name: "Adi", Email: "adi@test.com", Password: "x", Role: models.RoleUser, IsVerified: false, VerificationCode: "123456"}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/verify", `{"email":"adi@test.com","code":"000000"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestVerifyEmail_UserNotFound(t *testing.T) {
	testutil.SetupTestDB()
	rh := setupAuthRouter()

	w := rh.Post("/verify", `{"email":"nobody@test.com","code":"123456"}`)
	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestVerifyEmail_AlreadyVerified(t *testing.T) {
	db := testutil.SetupTestDB()
	u := models.User{Name: "Adi", Email: "adi@test.com", Password: "x", Role: models.RoleUser, IsVerified: true, VerificationCode: "123456"}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/verify", `{"email":"adi@test.com","code":"123456"}`)
	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.Equal(t, "Email already verified", resp["message"])
}

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────

func TestLogin_Success(t *testing.T) {
	db := testutil.SetupTestDB()
	hashed, _ := bcrypt.GenerateFromPassword([]byte("pass123"), bcrypt.DefaultCost)
	u := models.User{Name: "Siti", Email: "siti@test.com", Password: string(hashed), Role: models.RoleUser, IsVerified: true}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/login", `{"email":"siti@test.com","password":"pass123"}`)
	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotEmpty(t, resp["token"])
}

func TestLogin_WrongPassword(t *testing.T) {
	db := testutil.SetupTestDB()
	hashed, _ := bcrypt.GenerateFromPassword([]byte("pass123"), bcrypt.DefaultCost)
	u := models.User{Name: "Siti", Email: "siti@test.com", Password: string(hashed), Role: models.RoleUser, IsVerified: true}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/login", `{"email":"siti@test.com","password":"wrongpass"}`)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestLogin_UnverifiedEmail(t *testing.T) {
	db := testutil.SetupTestDB()
	hashed, _ := bcrypt.GenerateFromPassword([]byte("pass123"), bcrypt.DefaultCost)
	u := models.User{Name: "Dani", Email: "dani@test.com", Password: string(hashed), Role: models.RoleUser, IsVerified: false}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/login", `{"email":"dani@test.com","password":"pass123"}`)
	assert.Equal(t, http.StatusForbidden, w.Code)
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.Equal(t, "EMAIL_NOT_VERIFIED", resp["code"])
}

func TestLogin_UserNotFound(t *testing.T) {
	testutil.SetupTestDB()
	rh := setupAuthRouter()

	w := rh.Post("/login", `{"email":"ghost@test.com","password":"pass123"}`)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// ─────────────────────────────────────────────
// ForgotPassword
// ─────────────────────────────────────────────

func TestForgotPassword_ExistingEmail(t *testing.T) {
	db := testutil.SetupTestDB()
	testutil.SeedUser(db, "Rina", "rina@test.com", "hashed", models.RoleUser, true)
	rh := setupAuthRouter()

	w := rh.Post("/forgot-password", `{"email":"rina@test.com"}`)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestForgotPassword_NonExistingEmail(t *testing.T) {
	testutil.SetupTestDB()
	rh := setupAuthRouter()

	// Should still return 200 (security - don't reveal user existence)
	w := rh.Post("/forgot-password", `{"email":"nobody@test.com"}`)
	assert.Equal(t, http.StatusOK, w.Code)
}

// ─────────────────────────────────────────────
// ResetPassword
// ─────────────────────────────────────────────

func TestResetPassword_Success(t *testing.T) {
	db := testutil.SetupTestDB()
	u := models.User{Name: "Mira", Email: "mira@test.com", Password: "old", Role: models.RoleUser, IsVerified: true, ResetCode: "RESET1"}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/reset-password", `{"email":"mira@test.com","code":"RESET1","password":"newpass1","confirm_password":"newpass1"}`)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestResetPassword_InvalidCode(t *testing.T) {
	db := testutil.SetupTestDB()
	u := models.User{Name: "Mira", Email: "mira@test.com", Password: "old", Role: models.RoleUser, IsVerified: true, ResetCode: "RESET1"}
	db.Create(&u)
	rh := setupAuthRouter()

	w := rh.Post("/reset-password", `{"email":"mira@test.com","code":"WRONG1","password":"newpass1","confirm_password":"newpass1"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestResetPassword_MissingFields(t *testing.T) {
	testutil.SetupTestDB()
	rh := setupAuthRouter()

	w := rh.Post("/reset-password", `{"email":"mira@test.com"}`)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

// ─────────────────────────────────────────────
// GenerateVerificationCode
// ─────────────────────────────────────────────

func TestGenerateVerificationCode_Length(t *testing.T) {
	code := handlers.GenerateVerificationCode()
	assert.Len(t, code, 6)
	assert.True(t, strings.ContainsAny(code, "0123456789"))
}

func TestGenerateVerificationCode_Unique(t *testing.T) {
	codes := make(map[string]bool)
	for i := 0; i < 20; i++ {
		code := handlers.GenerateVerificationCode()
		assert.Len(t, code, 6)
		codes[code] = true
	}
	// Should generate at least a few unique codes in 20 attempts
	assert.Greater(t, len(codes), 1)
}

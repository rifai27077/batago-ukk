package handlers_test

import (
	"net/http"
	"testing"

	"github.com/rifai27077/batago-backend/internal/handlers"
	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/testutil"
	"github.com/stretchr/testify/assert"
)

func setupAdminRouter(adminID uint) *testutil.RouterHelper {
	rh := testutil.NewRouterHelper()
	auth := testutil.InjectUserID(adminID, string(models.RoleAdmin))
	
	rh.R.GET("/admin/stats", auth, handlers.GetAdminStats)
	rh.R.GET("/admin/users", auth, handlers.GetAdminUsers)
	rh.R.GET("/admin/partners", auth, handlers.GetAdminPartners)
	rh.R.GET("/admin/bookings", auth, handlers.GetAdminBookings)
	rh.R.PUT("/admin/partners/:id/status", auth, handlers.UpdatePartnerStatus)
	rh.R.GET("/admin/reports", auth, handlers.GetAdminReports)
	return rh
}

func TestGetAdminStats(t *testing.T) {
	db := testutil.SetupTestDB()
	admin := testutil.SeedUser(db, "Admin", "admin@test.com", "pass", models.RoleAdmin, true)
	
	// Seed some data for stats
	user := testutil.SeedUser(db, "User", "user@test.com", "pass", models.RoleUser, true)
	// Seed one more user who stays a user
	testutil.SeedUser(db, "Normal User", "normal@test.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, user.ID, "Test Partner", models.PartnerTypeHotel, models.PartnerStatusApproved)
	testutil.SeedBooking(db, user.ID, p.ID, models.BookingTypeHotel, 500000, models.PaymentStatusPaid)
	
	rh := setupAdminRouter(admin.ID)
	
	w := rh.Get("/admin/stats")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	stats := resp["stats"].(map[string]interface{})
	assert.GreaterOrEqual(t, stats["total_users"].(float64), 1.0)
	assert.GreaterOrEqual(t, stats["active_partners"].(float64), 1.0)
}

func TestGetAdminUsers(t *testing.T) {
	db := testutil.SetupTestDB()
	admin := testutil.SeedUser(db, "Admin", "admin@test.com", "pass", models.RoleAdmin, true)
	testutil.SeedUser(db, "User 1", "u1@test.com", "pass", models.RoleUser, true)
	testutil.SeedUser(db, "User 2", "u2@test.com", "pass", models.RoleUser, true)
	
	rh := setupAdminRouter(admin.ID)
	
	w := rh.Get("/admin/users")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	data := resp["data"].([]interface{})
	assert.GreaterOrEqual(t, len(data), 2)
}

func TestApprovePartner(t *testing.T) {
	db := testutil.SetupTestDB()
	admin := testutil.SeedUser(db, "Admin", "admin@test.com", "pass", models.RoleAdmin, true)
	u := testutil.SeedUser(db, "Partner Candidate", "p@test.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, u.ID, "New Partner", models.PartnerTypeHotel, models.PartnerStatusInReview)
	
	rh := setupAdminRouter(admin.ID)
	
	w := rh.Put("/admin/partners/1/status", `{"action": "approve"}`)
	assert.Equal(t, http.StatusOK, w.Code)
	
	var updated models.Partner
	db.First(&updated, p.ID)
	assert.Equal(t, models.PartnerStatusApproved, updated.Status)
}

func TestGetAdminReports(t *testing.T) {
	db := testutil.SetupTestDB()
	admin := testutil.SeedUser(db, "Admin", "admin@test.com", "pass", models.RoleAdmin, true)
	
	rh := setupAdminRouter(admin.ID)
	
	w := rh.Get("/admin/reports")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["monthly_data"])
}

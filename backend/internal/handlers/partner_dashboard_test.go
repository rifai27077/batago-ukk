package handlers_test

import (
	"net/http"
	"testing"

	"github.com/rifai27077/batago-backend/internal/handlers"
	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/testutil"
	"github.com/stretchr/testify/assert"
)

func setupPartnerRouter(partnerID uint) *testutil.RouterHelper {
	rh := testutil.NewRouterHelper()
	auth := testutil.InjectUserID(partnerID, string(models.RolePartner))
	
	rh.R.GET("/partner/listings", auth, handlers.GetPartnerListings)
	rh.R.GET("/partner/finance", auth, handlers.GetPartnerFinance)
	rh.R.GET("/partner/dashboard", auth, handlers.GetDashboardStats)
	return rh
}

func TestGetPartnerListings(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Partner", "p@test.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Partner Co", models.PartnerTypeHotel, models.PartnerStatusApproved)
	city := testutil.SeedCity(db, "Jakarta", "Indonesia", true)
	testutil.SeedHotel(db, p.ID, city.ID, "Hotel A", 1000000)
	
	rh := setupPartnerRouter(u.ID)
	
	w := rh.Get("/partner/listings")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["data"])
}

func TestGetPartnerFinance(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Partner", "p@test.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Partner Co", models.PartnerTypeHotel, models.PartnerStatusApproved)
	testutil.SeedBooking(db, u.ID, p.ID, models.BookingTypeHotel, 2000000, models.PaymentStatusPaid)
	
	rh := setupPartnerRouter(u.ID)
	
	w := rh.Get("/partner/finance")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["chart_data"])
}

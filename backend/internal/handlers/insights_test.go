package handlers_test

import (
	"net/http"
	"testing"

	"github.com/rifai27077/batago-backend/internal/handlers"
	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/testutil"
	"github.com/stretchr/testify/assert"
)

func setupInsightsRouter(partnerID uint) *testutil.RouterHelper {
	rh := testutil.NewRouterHelper()
	auth := testutil.InjectUserID(partnerID, string(models.RolePartner))
	
	rh.R.GET("/partner/insights", auth, handlers.GetPartnerInsights)
	return rh
}

func TestGetPartnerInsights_Hotel(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Hotel Partner", "hotel@partner.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Bali Resort", models.PartnerTypeHotel, models.PartnerStatusApproved)
	city := testutil.SeedCity(db, "Bali", "Indonesia", true)
	h := testutil.SeedHotel(db, p.ID, city.ID, "Grand Hotel", 1000000)
	testutil.SeedRoomType(db, h.ID, "Deluxe", 1000000, 2)
	testutil.SeedBooking(db, u.ID, p.ID, models.BookingTypeHotel, 2000000, models.PaymentStatusPaid)
	
	rh := setupInsightsRouter(u.ID)
	
	w := rh.Get("/partner/insights")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["metrics"])
	assert.NotNil(t, resp["pricing_data"])
	assert.Equal(t, "hotel", resp["partner_type"])
}

func TestGetPartnerInsights_Airline(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Airline Partner", "air@partner.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Garuda", models.PartnerTypeFlight, models.PartnerStatusApproved)
	_, _, f := testutil.SeedFlight(db, p.ID)
	testutil.SeedFlightSeat(db, f.ID, models.FlightClassEconomy, 1200000, 100, 50)
	testutil.SeedBooking(db, u.ID, p.ID, models.BookingTypeFlight, 1200000, models.PaymentStatusPaid)
	
	rh := setupInsightsRouter(u.ID)
	
	w := rh.Get("/partner/insights")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["metrics"])
	assert.NotNil(t, resp["pricing_data"])
	assert.Equal(t, "flight", resp["partner_type"])
}

func TestGetPartnerInsights_NotFound(t *testing.T) {
	testutil.SetupTestDB()
	// No partner seeded
	rh := setupInsightsRouter(999)
	
	w := rh.Get("/partner/insights")
	assert.Equal(t, http.StatusNotFound, w.Code)
}

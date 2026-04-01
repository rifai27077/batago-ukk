package handlers_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/rifai27077/batago-backend/internal/handlers"
	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/testutil"
	"github.com/stretchr/testify/assert"
)

func setupFlightRouter() *testutil.RouterHelper {
	rh := testutil.NewRouterHelper()
	rh.R.GET("/flights", handlers.SearchFlights)
	rh.R.GET("/flights/:id", handlers.GetFlightDetail)
	rh.R.GET("/airports", handlers.GetAirports)
	return rh
}

func TestSearchFlights(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Partner", "p@test.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Airline", models.PartnerTypeFlight, models.PartnerStatusApproved)
	dep, arr, f := testutil.SeedFlight(db, p.ID)
	testutil.SeedFlightSeat(db, f.ID, models.FlightClassEconomy, 1000000, 10, 10)
	
	rh := setupFlightRouter()
	
	url := fmt.Sprintf("/flights?from=%s&to=%s", dep.Code, arr.Code)
	w := rh.Get(url)
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	data := resp["data"].([]interface{})
	assert.GreaterOrEqual(t, len(data), 1)
}

func TestGetFlightDetail(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Partner", "p@test.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Airline", models.PartnerTypeFlight, models.PartnerStatusApproved)
	_, _, f := testutil.SeedFlight(db, p.ID)
	
	rh := setupFlightRouter()
	
	w := rh.Get(fmt.Sprintf("/flights/%d", f.ID))
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["data"])
}

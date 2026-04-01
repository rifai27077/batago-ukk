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

func setupHotelRouter() *testutil.RouterHelper {
	rh := testutil.NewRouterHelper()
	rh.R.GET("/hotels", handlers.SearchHotels)
	rh.R.GET("/hotels/:id", handlers.GetHotelDetail)
	return rh
}

func TestSearchHotels(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Partner", "p@test.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Hotel Group", models.PartnerTypeHotel, models.PartnerStatusApproved)
	city := testutil.SeedCity(db, "Bali", "Indonesia", true)
	h := testutil.SeedHotel(db, p.ID, city.ID, "Beach Resort", 1500000)
	testutil.SeedRoomType(db, h.ID, "Standard", 1500000, 2)
	
	rh := setupHotelRouter()
	
	url := fmt.Sprintf("/hotels?city_id=%d", city.ID)
	w := rh.Get(url)
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	data := resp["data"].([]interface{})
	assert.GreaterOrEqual(t, len(data), 1)
}

func TestGetHotelDetail(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Partner", "p@test.com", "pass", models.RolePartner, true)
	p := testutil.SeedPartner(db, u.ID, "Hotel Group", models.PartnerTypeHotel, models.PartnerStatusApproved)
	city := testutil.SeedCity(db, "Bali", "Indonesia", true)
	h := testutil.SeedHotel(db, p.ID, city.ID, "Beach Resort", 1500000)
	
	rh := setupHotelRouter()
	
	w := rh.Get(fmt.Sprintf("/hotels/%d", h.ID))
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["data"])
}

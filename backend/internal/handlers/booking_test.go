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

func setupBookingRouter(userID uint) *testutil.RouterHelper {
	rh := testutil.NewRouterHelper()
	auth := testutil.InjectUserID(userID, string(models.RoleUser))
	
	rh.R.POST("/bookings/flight", auth, handlers.CreateFlightBooking)
	rh.R.POST("/bookings/hotel", auth, handlers.CreateHotelBooking)
	rh.R.GET("/bookings", auth, handlers.GetMyBookings)
	rh.R.GET("/bookings/:id", auth, handlers.GetBookingDetail)
	rh.R.POST("/bookings/:id/cancel", auth, handlers.CancelBooking)
	return rh
}

// ─────────────────────────────────────────────
// CreateFlightBooking
// ─────────────────────────────────────────────

func TestCreateFlightBooking_Success(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Test User", "test@user.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, u.ID, "Garuda", models.PartnerTypeFlight, models.PartnerStatusApproved)
	_, _, f := testutil.SeedFlight(db, p.ID)
	testutil.SeedFlightSeat(db, f.ID, models.FlightClassEconomy, 1000000, 10, 10)
	
	rh := setupBookingRouter(u.ID)
	
	body := fmt.Sprintf(`{
		"flight_id": %d,
		"class": "Economy",
		"passengers": [{"name": "Passenger 1", "type": "Adult"}]
	}`, f.ID)
	
	w := rh.Post("/bookings/flight", body)
	assert.Equal(t, http.StatusCreated, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotEmpty(t, resp["booking_code"])
}

func TestCreateFlightBooking_NoSeats(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Test User", "test@user.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, u.ID, "Garuda", models.PartnerTypeFlight, models.PartnerStatusApproved)
	_, _, f := testutil.SeedFlight(db, p.ID)
	testutil.SeedFlightSeat(db, f.ID, models.FlightClassEconomy, 1000000, 10, 0)
	
	rh := setupBookingRouter(u.ID)
	
	body := fmt.Sprintf(`{
		"flight_id": %d,
		"class": "Economy",
		"passengers": [{"name": "Passenger 1", "type": "Adult"}]
	}`, f.ID)
	
	w := rh.Post("/bookings/flight", body)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

// ─────────────────────────────────────────────
// CreateHotelBooking
// ─────────────────────────────────────────────

func TestCreateHotelBooking_Success(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Test User", "test@user.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, u.ID, "Hotel Indonesia", models.PartnerTypeHotel, models.PartnerStatusApproved)
	city := testutil.SeedCity(db, "Jakarta", "Indonesia", true)
	h := testutil.SeedHotel(db, p.ID, city.ID, "Grand Hotel", 2000000)
	rt := testutil.SeedRoomType(db, h.ID, "Deluxe", 2000000, 2)
	
	rh := setupBookingRouter(u.ID)
	
	body := fmt.Sprintf(`{
		"room_type_id": %d,
		"check_in": "2026-03-01",
		"check_out": "2026-03-03",
		"guests": 2
	}`, rt.ID)
	
	w := rh.Post("/bookings/hotel", body)
	assert.Equal(t, http.StatusCreated, w.Code)
}

// ─────────────────────────────────────────────
// GetMyBookings
// ─────────────────────────────────────────────

func TestGetMyBookings(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Test User", "test@user.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, u.ID, "Garuda", models.PartnerTypeFlight, models.PartnerStatusApproved)
	testutil.SeedBooking(db, u.ID, p.ID, models.BookingTypeFlight, 1000000, models.PaymentStatusPaid)
	
	rh := setupBookingRouter(u.ID)
	
	w := rh.Get("/bookings")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var resp map[string]interface{}
	testutil.JSON(w, &resp)
	assert.NotNil(t, resp["data"])
}

// ─────────────────────────────────────────────
// CancelBooking
// ─────────────────────────────────────────────

func TestCancelBooking_Success(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Test User", "test@user.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, u.ID, "Garuda", models.PartnerTypeFlight, models.PartnerStatusApproved)
	booking := testutil.SeedBooking(db, u.ID, p.ID, models.BookingTypeFlight, 1000000, models.PaymentStatusPending)
	
	rh := setupBookingRouter(u.ID)
	
	w := rh.Post(fmt.Sprintf("/bookings/%d/cancel", booking.ID), "")
	assert.Equal(t, http.StatusOK, w.Code)
	
	var updated models.Booking
	db.First(&updated, booking.ID)
	assert.Equal(t, models.BookingStatusCancelled, updated.BookingStatus)
}

func TestCancelBooking_PaidForbidden(t *testing.T) {
	db := testutil.SetupTestDB()
	u := testutil.SeedUser(db, "Test User", "test@user.com", "pass", models.RoleUser, true)
	p := testutil.SeedPartner(db, u.ID, "Garuda", models.PartnerTypeFlight, models.PartnerStatusApproved)
	booking := testutil.SeedBooking(db, u.ID, p.ID, models.BookingTypeFlight, 1000000, models.PaymentStatusPaid)
	
	rh := setupBookingRouter(u.ID)
	
	w := rh.Post(fmt.Sprintf("/bookings/%d/cancel", booking.ID), "")
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

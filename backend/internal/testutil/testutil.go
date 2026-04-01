// Package testutil provides shared helpers for handler unit tests.
// It spins up an in-memory SQLite database so tests are fully isolated
// from the production Supabase instance.
package testutil

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ─────────────────────────────────────────────────────────────────────────────
// RouterHelper — convenience wrapper around *gin.Engine for test requests
// ─────────────────────────────────────────────────────────────────────────────

// RouterHelper wraps gin.Engine for convenient test request firing.
type RouterHelper struct {
	R *gin.Engine
}

// NewRouterHelper returns a test-mode Gin router.
func NewRouterHelper() *RouterHelper {
	gin.SetMode(gin.TestMode)
	return &RouterHelper{R: gin.New()}
}

func (rh *RouterHelper) do(method, path, body string) *httptest.ResponseRecorder {
	var b *strings.Reader
	if body != "" {
		b = strings.NewReader(body)
	} else {
		b = strings.NewReader("")
	}
	req, _ := http.NewRequest(method, path, b)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	rh.R.ServeHTTP(w, req)
	return w
}

// Post fires a POST with the given JSON body.
func (rh *RouterHelper) Post(path, body string) *httptest.ResponseRecorder {
	return rh.do(http.MethodPost, path, body)
}

// Get fires a GET request.
func (rh *RouterHelper) Get(path string) *httptest.ResponseRecorder {
	return rh.do(http.MethodGet, path, "")
}

// Put fires a PUT with the given JSON body.
func (rh *RouterHelper) Put(path, body string) *httptest.ResponseRecorder {
	return rh.do(http.MethodPut, path, body)
}

// Delete fires a DELETE request.
func (rh *RouterHelper) Delete(path string) *httptest.ResponseRecorder {
	return rh.do(http.MethodDelete, path, "")
}

// ─────────────────────────────────────────────────────────────────────────────
// Database helpers
// ─────────────────────────────────────────────────────────────────────────────

// SetupTestDB initialises an in-memory SQLite DB, wires it into database.DB,
// and auto-migrates every model used by the handlers.
func SetupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared&_busy_timeout=5000"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("failed to open test database: " + err.Error())
	}

	// For SQLite in-memory with goroutines, we MUST use a single connection
	// to ensure all goroutines share the same database state.
	sqlDB, _ := db.DB()
	sqlDB.SetMaxOpenConns(1)
	sqlDB.SetMaxIdleConns(1)
	sqlDB.SetConnMaxLifetime(0)

	// Drop and re-create all tables so each test gets a clean slate.
	_ = db.Migrator().DropTable(
		&models.AdminActivityLog{},
		&models.PayoutRequest{},
		&models.BankAccount{},
		&models.Promotion{},
		&models.Review{},
		&models.Notification{},
		&models.HotelVoucher{},
		&models.Passenger{},
		&models.FlightBooking{},
		&models.HotelBooking{},
		&models.Payment{},
		&models.Booking{},
		&models.FlightSeat{},
		&models.Flight{},
		&models.Airport{},
		&models.RoomAvailability{},
		&models.RoomType{},
		"hotel_facilities",
		&models.HotelImage{},
		&models.Hotel{},
		&models.City{},
		&models.Facility{},
		&models.Partner{},
		&models.PartnerStaff{},
		&models.User{},
	)

	if err := db.AutoMigrate(
		&models.User{},
		&models.Partner{},
		&models.PartnerStaff{},
		&models.City{},
		&models.Facility{},
		&models.Hotel{},
		&models.HotelImage{},
		&models.RoomType{},
		&models.RoomAvailability{},
		&models.Airport{},
		&models.Flight{},
		&models.FlightSeat{},
		&models.Booking{},
		&models.Payment{},
		&models.FlightBooking{},
		&models.HotelBooking{},
		&models.Passenger{},
		&models.HotelVoucher{},
		&models.Notification{},
		&models.Review{},
		&models.Promotion{},
		&models.PayoutRequest{},
		&models.BankAccount{},
		&models.AdminActivityLog{},
	); err != nil {
		panic("auto-migrate failed: " + err.Error())
	}

	database.DB = db
	return db
}

// ─────────────────────────────────────────────────────────────────────────────
// Context helpers
// ─────────────────────────────────────────────────────────────────────────────

// InjectUserID returns middleware that injects user_id + role into gin context.
func InjectUserID(userID uint, role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("user_id", userID)
		c.Set("role", role)
		c.Next()
	}
}

// JSON decodes the response body into v.
func JSON(w *httptest.ResponseRecorder, v interface{}) {
	_ = json.NewDecoder(w.Body).Decode(v)
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed helpers
// ─────────────────────────────────────────────────────────────────────────────

// SeedUser creates and returns a User in the test DB.
func SeedUser(db *gorm.DB, name, email, password string, role models.Role, verified bool) models.User {
	u := models.User{Name: name, Email: email, Password: password, Role: role, IsVerified: verified}
	db.Create(&u)
	return u
}

// SeedPartner creates and returns a Partner linked to the given user.
func SeedPartner(db *gorm.DB, userID uint, company string, pType models.PartnerType, status models.PartnerStatus) models.Partner {
	p := models.Partner{
		UserID: userID, CompanyName: company,
		Type: pType, Status: status, CommissionRate: 10,
	}
	db.Create(&p)
	return p
}

// SeedCity creates and returns a City.
func SeedCity(db *gorm.DB, name, country string, popular bool) models.City {
	c := models.City{Name: name, Country: country, IsPopular: popular}
	db.Create(&c)
	return c
}

// SeedHotel creates and returns a Hotel.
func SeedHotel(db *gorm.DB, partnerID, cityID uint, name string, basePrice float64) models.Hotel {
	h := models.Hotel{
		PartnerID: partnerID, Name: name, CityID: cityID,
		BasePrice: basePrice, RoomCount: 5, Status: "active",
	}
	db.Create(&h)
	return h
}

// SeedRoomType creates and returns a RoomType for a hotel.
func SeedRoomType(db *gorm.DB, hotelID uint, name string, price float64, maxGuests int) models.RoomType {
	rt := models.RoomType{HotelID: hotelID, Name: name, BasePrice: price, MaxGuests: maxGuests}
	db.Create(&rt)
	return rt
}

// SeedFlight creates two airports and a flight; returns all three.
func SeedFlight(db *gorm.DB, partnerID uint) (models.Airport, models.Airport, models.Flight) {
	dep := models.Airport{Code: "CGK", Name: "Soekarno-Hatta", City: "Jakarta", Country: "ID"}
	arr := models.Airport{Code: "DPS", Name: "Ngurah Rai", City: "Bali", Country: "ID"}
	db.Create(&dep)
	db.Create(&arr)
	f := models.Flight{
		PartnerID: partnerID, FlightNumber: "GA-100", Airline: "Garuda",
		DepartureAirportID: dep.ID, ArrivalAirportID: arr.ID,
		DepartureTime: time.Now().Add(2 * time.Hour),
		ArrivalTime:   time.Now().Add(4 * time.Hour),
		Duration:      120,
	}
	db.Create(&f)
	return dep, arr, f
}

// SeedFlightSeat adds a FlightSeat to a flight.
func SeedFlightSeat(db *gorm.DB, flightID uint, class models.FlightClass, price float64, total, avail int) models.FlightSeat {
	s := models.FlightSeat{FlightID: flightID, Class: class, Price: price, TotalSeats: total, AvailableSeats: avail}
	db.Create(&s)
	return s
}

// SeedBooking creates and returns a Booking.
func SeedBooking(db *gorm.DB, userID, partnerID uint, bType models.BookingType, amount float64, payStatus models.PaymentStatus) models.Booking {
	b := models.Booking{
		BookingCode:   "TEST-" + time.Now().Format("150405000"),
		UserID:        userID, PartnerID: partnerID,
		Type:          bType,
		TotalAmount:   amount,
		PaymentStatus: payStatus,
		BookingStatus: models.BookingStatusNew,
		ExpiresAt:     time.Now().Add(30 * time.Minute),
	}
	db.Create(&b)

	if payStatus == models.PaymentStatusPaid {
		SeedPayment(db, b.ID, amount, models.PaymentStatusPaid)
	}

	return b
}

// SeedPayment creates and returns a Payment.
func SeedPayment(db *gorm.DB, bookingID uint, amount float64, status models.PaymentStatus) models.Payment {
	now := time.Now()
	p := models.Payment{
		BookingID:     bookingID,
		Amount:        amount,
		Status:        status,
		Gateway:       "midtrans",
		TransactionID: "TRX-" + time.Now().Format("150405"),
		PaidAt:        &now,
	}
	db.Create(&p)
	return p
}

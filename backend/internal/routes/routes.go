package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/handlers"
	"github.com/rifai27077/batago-backend/internal/middleware"
)

func SetupRoutes(r *gin.Engine) {
	// Serve uploaded files
	r.Static("/uploads", "./uploads")

	// Root Welcome
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"app":     "BataGo API",
			"version": "1.0.0",
			"status":  "running",
		})
	})

	// Ignore favicon
	r.GET("/favicon.ico", func(c *gin.Context) {
		c.Status(204)
	})

	v1 := r.Group("/v1")

	// v1 Root
	v1.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to BataGo API v1",
			"docs":    "TBD",
		})
	})

	// --- Public Routes ---

	// Payment webhook (public — Midtrans calls this directly)
	v1.POST("/payments/webhook", handlers.MidtransWebhook)

	// Auth
	auth := v1.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
		auth.POST("/verify", handlers.VerifyEmail)
		auth.POST("/verify/resend", handlers.ResendVerification)
		auth.POST("/password/forgot", handlers.ForgotPassword)
		auth.POST("/password/reset", handlers.ResetPassword)
		auth.POST("/partner/register", handlers.RegisterPartner)
	}

	// Flights (public search)
	v1.GET("/flights", handlers.SearchFlights)
	v1.GET("/flights/:id", handlers.GetFlightDetail)
	v1.GET("/airports", handlers.GetAirports)

	// Hotels (public search)
	v1.GET("/hotels", handlers.SearchHotels)
	v1.GET("/hotels/:id", handlers.GetHotelDetail)
	v1.GET("/cities", handlers.GetCities)
	v1.GET("/promotions", handlers.GetPublicPromotions)

	// --- Protected Routes (require JWT) ---
	protected := v1.Group("")
	protected.Use(middleware.AuthMiddleware())
	{
		// Profile
		protected.GET("/profile", handlers.GetProfile)
		protected.PUT("/profile", handlers.UpdateProfile)
		protected.POST("/profile/avatar", handlers.UploadAvatar)
		protected.POST("/profile/partner", handlers.BecomePartner)

		// Bookings
		protected.POST("/bookings/flight", handlers.CreateFlightBooking)
		protected.POST("/bookings/hotel", handlers.CreateHotelBooking)
		protected.GET("/bookings", handlers.GetMyBookings)
		protected.GET("/bookings/:id", handlers.GetBookingDetail)
		protected.DELETE("/bookings/:id", handlers.CancelBooking)
		protected.GET("/bookings/:id/ticket", handlers.DownloadTicket)

		// Payments
		protected.POST("/payments/token", handlers.CreatePaymentToken)

		// Reviews
		protected.POST("/reviews", handlers.CreateReview)

		// Partner Dashboard
		protected.GET("/partner/dashboard", handlers.GetDashboardStats)

		// Partner Listings
		protected.GET("/partner/listings", handlers.GetPartnerListings)
		protected.POST("/partner/listings", handlers.CreatePartnerListing)
		protected.PUT("/partner/listings/:id", handlers.UpdatePartnerListing)
		protected.DELETE("/partner/listings/:id", handlers.DeletePartnerListing)

		// Partner Promotions
		protected.GET("/partner/promotions", handlers.GetPartnerPromotions)
		protected.POST("/partner/promotions", handlers.CreatePartnerPromotion)
		protected.PUT("/partner/promotions/:id", handlers.UpdatePartnerPromotion)
		protected.DELETE("/partner/promotions/:id", handlers.DeletePartnerPromotion)

		// Partner Bookings
		protected.GET("/partner/bookings", handlers.GetPartnerBookings)

		// Partner Finance
		protected.GET("/partner/finance", handlers.GetPartnerFinance)

		// Partner Analytics
		protected.GET("/partner/analytics", handlers.GetPartnerAnalytics)

		// Partner Staff
		protected.GET("/partner/staff", handlers.GetPartnerStaff)
		protected.POST("/partner/staff", handlers.AddPartnerStaff)
		protected.DELETE("/partner/staff/:id", handlers.RemovePartnerStaff)

		// Partner Availability
		protected.GET("/partner/availability", handlers.GetPartnerAvailability)
		protected.POST("/partner/availability/block", handlers.BlockPartnerDates)

		// Partner Uploads
		protected.POST("/partner/upload", handlers.UploadListingImage)


		// Partner Fleet (Aircraft)
		protected.GET("/partner/fleet", handlers.GetPartnerFleet)
		protected.POST("/partner/fleet", handlers.CreateAircraft)
		protected.PUT("/partner/fleet/:id", handlers.UpdateAircraft)
		protected.DELETE("/partner/fleet/:id", handlers.DeleteAircraft)

		// Partner Routes (Flight Routes)
		protected.GET("/partner/routes", handlers.GetPartnerRoutes)
		protected.POST("/partner/routes", handlers.CreatePartnerRoute)
		protected.DELETE("/partner/routes/:id", handlers.DeletePartnerRoute)

		// Partner Insights
		protected.GET("/partner/insights", handlers.GetPartnerInsights)

		// Notifications
		protected.GET("/notifications", handlers.GetNotifications)
		protected.PUT("/notifications/:id/read", handlers.MarkNotificationAsRead)
		protected.PUT("/notifications/read-all", handlers.MarkAllAsRead)

		// Favourites
		protected.POST("/favourites/toggle", handlers.ToggleFavourite)
		protected.GET("/favourites", handlers.GetFavourites)

		// Promotions
		protected.GET("/promotions/validate", handlers.ValidatePromoCode)
	}
}

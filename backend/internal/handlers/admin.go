package handlers

import (
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rifai27077/batago-backend/internal/database"
	"github.com/rifai27077/batago-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// ──────────────────────────────────────────────
// GET /admin/stats
// ──────────────────────────────────────────────

func GetAdminStats(c *gin.Context) {
	db := database.DB
	now := time.Now()
	thirtyDaysAgo := now.AddDate(0, 0, -30)
	sixtyDaysAgo := now.AddDate(0, 0, -60)

	// ── Parallel stat collection ───────────────────────────────────
	var (
		totalUsers, usersPrev                         int64
		activePartners, partnersPrev                 int64
		totalBookings, bookingsLast30d, bookingsPrev30d                   int64
		totalRevenue, revenueLast30d, revenuePrev30d                     float64
		activeHotels, activeFlights                        int64
		topPartners                                        []struct {
			ID          uint    `json:"id"`
			CompanyName string  `json:"name"`
			Type        string  `json:"type"`
			Revenue     float64 `json:"revenue"`
			Bookings    int64   `json:"bookings"`
		}
		recentBookings []struct {
			ID      uint    `json:"id"`
			Code    string  `json:"booking_code"`
			Guest   string  `json:"guest"`
			Partner string  `json:"partner"`
			Type    string  `json:"type"`
			Amount  float64 `json:"amount"`
			Status  string  `json:"status"`
			Date    string  `json:"date"`
		}
		pendingPartners    []models.Partner
		pendingPayouts     int64
		pendingPayoutAmt   float64
		revTrendRows       []struct {
			Month string  `gorm:"column:month"`
			Value float64 `gorm:"column:value"`
		}
		bookingDistRows []struct {
			Type  string `gorm:"column:type"`
			Count int64  `gorm:"column:count"`
		}
	)

	var wg sync.WaitGroup
	wg.Add(9)

	go func() { defer wg.Done()
		db.Model(&models.User{}).Where("role = ?", models.RoleUser).Count(&totalUsers)
		db.Model(&models.User{}).Where("role = ? AND created_at < ?", models.RoleUser, thirtyDaysAgo).Count(&usersPrev)
	}()
	go func() { defer wg.Done()
		db.Model(&models.Partner{}).Where("status = ?", models.PartnerStatusApproved).Count(&activePartners)
		db.Model(&models.Partner{}).Where("status = ? AND created_at < ?", models.PartnerStatusApproved, thirtyDaysAgo).Count(&partnersPrev)
	}()
	go func() { defer wg.Done()
		db.Model(&models.Booking{}).Count(&totalBookings)
		db.Model(&models.Booking{}).Where("created_at >= ?", thirtyDaysAgo).Count(&bookingsLast30d)
		db.Model(&models.Booking{}).Where("created_at >= ? AND created_at < ?", sixtyDaysAgo, thirtyDaysAgo).Count(&bookingsPrev30d)
	}()
	go func() { defer wg.Done()
		db.Model(&models.Payment{}).Where("status = ?", models.PaymentStatusPaid).Select("COALESCE(SUM(amount), 0)").Scan(&totalRevenue)
		db.Model(&models.Payment{}).Where("status = ? AND paid_at >= ?", models.PaymentStatusPaid, thirtyDaysAgo).Select("COALESCE(SUM(amount), 0)").Scan(&revenueLast30d)
		db.Model(&models.Payment{}).Where("status = ? AND paid_at >= ? AND paid_at < ?", models.PaymentStatusPaid, sixtyDaysAgo, thirtyDaysAgo).Select("COALESCE(SUM(amount), 0)").Scan(&revenuePrev30d)
	}()
	go func() { defer wg.Done()
		// Single aggregated query for 6-month revenue trend
		sixMonthsAgo := time.Now().AddDate(0, -6, 0)
		trunc := database.TruncateMonthSQL("paid_at")
		toChar := database.ToCharMonthSQL("paid_at")
		db.Raw(`
			SELECT `+toChar+` as month,
			       COALESCE(SUM(amount), 0) / 1000000.0 as value
			FROM payments
			WHERE status = ? AND paid_at >= ? AND deleted_at IS NULL
			GROUP BY `+trunc+`
			ORDER BY `+trunc+` ASC
		`, models.PaymentStatusPaid, sixMonthsAgo).Scan(&revTrendRows)
	}()
	go func() { defer wg.Done()
		// Single GROUP BY for booking distribution
		db.Raw(`SELECT type, COUNT(*) as count FROM bookings WHERE deleted_at IS NULL AND type IN (?, ?) GROUP BY type`,
			models.BookingTypeHotel, models.BookingTypeFlight).Scan(&bookingDistRows)
	}()
	go func() { defer wg.Done()
		db.Raw(`
			SELECT p.id, p.company_name, p.type,
				COALESCE(SUM(pay.amount), 0) as revenue,
				COUNT(DISTINCT b.id) as bookings
			FROM partners p
			LEFT JOIN bookings b ON b.partner_id = p.id AND b.deleted_at IS NULL
			LEFT JOIN payments pay ON pay.booking_id = b.id AND pay.status = 'PAID' AND pay.deleted_at IS NULL
			WHERE p.status = 'APPROVED' AND p.deleted_at IS NULL
			GROUP BY p.id, p.company_name, p.type
			ORDER BY revenue DESC LIMIT 5
		`).Scan(&topPartners)
		db.Raw(`
			SELECT b.id, b.booking_code as code, u.name as guest, p.company_name as partner,
				b.type, b.total_amount as amount, b.booking_status as status, b.created_at as date
			FROM bookings b
			JOIN users u ON u.id = b.user_id
			JOIN partners p ON p.id = b.partner_id
			WHERE b.deleted_at IS NULL
			ORDER BY b.created_at DESC LIMIT 5
		`).Scan(&recentBookings)
	}()
	go func() { defer wg.Done()
		db.Where("status = ?", models.PartnerStatusInReview).Order("created_at DESC").Limit(3).Find(&pendingPartners)
		// Merged payout count + sum in one query
		var payoutRow struct {
			Count  int64   `gorm:"column:count"`
			Amount float64 `gorm:"column:amount"`
		}
		db.Raw(`SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as amount FROM payout_requests WHERE status = 'pending' AND deleted_at IS NULL`).Scan(&payoutRow)
		pendingPayouts = payoutRow.Count
		pendingPayoutAmt = payoutRow.Amount
	}()
	go func() { defer wg.Done()
		db.Model(&models.Hotel{}).Where("status = ?", "active").Count(&activeHotels)
		db.Model(&models.Flight{}).Count(&activeFlights)
	}()

	wg.Wait()

	// ── Post-process results in Go (zero DB round-trips) ─────────
	var userChange float64
	if usersPrev > 0 {
		userChange = float64(totalUsers-usersPrev) / float64(usersPrev) * 100
	} else if totalUsers > 0 {
		userChange = 100 // New growth from zero
	}

	partnerChange := activePartners - partnersPrev
	
	var bookingChange float64
	if bookingsPrev30d > 0 {
		bookingChange = float64(bookingsLast30d-bookingsPrev30d) / float64(bookingsPrev30d) * 100
	} else if bookingsLast30d > 0 {
		bookingChange = 100
	}

	var revenueChange float64
	if revenuePrev30d > 0 {
		revenueChange = (revenueLast30d - revenuePrev30d) / revenuePrev30d * 100
	} else if revenueLast30d > 0 {
		revenueChange = 100
	}

	// Build month-keyed map for trend (fill 6 slots in order)
	trendMap := make(map[string]float64)
	for _, r := range revTrendRows {
		// Keep 2 decimal places precision for trend display
		trendMap[r.Month] = math.Round(r.Value*100) / 100
	}
	type MonthRevenue struct {
		Month string  `json:"month"`
		Value float64 `json:"value"`
	}
	revenueTrend := make([]MonthRevenue, 0, 6)
	for i := 5; i >= 0; i-- {
		m := time.Now().AddDate(0, -i, 0)
		label := m.Format("Jan")
		revenueTrend = append(revenueTrend, MonthRevenue{Month: label, Value: trendMap[label]})
	}

	var hotelBookings, flightBookings int64
	for _, row := range bookingDistRows {
		switch row.Type {
		case string(models.BookingTypeHotel):
			hotelBookings = row.Count
		case string(models.BookingTypeFlight):
			flightBookings = row.Count
		}
	}
	totalDist := hotelBookings + flightBookings
	var hotelPct, flightPct int
	if totalDist > 0 {
		hotelPct = int(float64(hotelBookings) / float64(totalDist) * 100)
		flightPct = 100 - hotelPct
	}

	type PendingAction struct {
		Title string `json:"title"`
		Desc  string `json:"desc"`
		Type  string `json:"type"`
		Time  string `json:"time"`
	}
	var pendingActions []PendingAction
	for _, pp := range pendingPartners {
		pendingActions = append(pendingActions, PendingAction{
			Title: "Partner Verification",
			Desc:  pp.CompanyName + " menunggu approval",
			Type:  "warning",
			Time:  formatTimeAgo(pp.CreatedAt),
		})
	}
	if pendingPayouts > 0 {
		pendingActions = append(pendingActions, PendingAction{
			Title: "Payout Pending",
			Desc:  formatAmount(pendingPayoutAmt) + " siap ditransfer ke " + strconv.FormatInt(pendingPayouts, 10) + " partner",
			Type:  "info",
			Time:  "Ongoing",
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"total_users":     totalUsers,
			"user_change":     math.Round(userChange*10) / 10,
			"active_partners": activePartners,
			"partner_change":  partnerChange,
			"total_bookings":  totalBookings,
			"booking_change":  math.Round(bookingChange*10) / 10,
			"total_revenue":   totalRevenue,
			"revenue_change":  math.Round(revenueChange*10) / 10,
		},
		"revenue_trend":        revenueTrend,
		"booking_distribution": gin.H{
			"hotels":     hotelBookings,
			"hotel_pct":  hotelPct,
			"flights":    flightBookings,
			"flight_pct": flightPct,
		},
		"top_partners":    topPartners,
		"pending_actions": pendingActions,
		"recent_bookings": recentBookings,
		"quick_stats": gin.H{
			"active_hotels":  activeHotels,
			"active_flights": activeFlights,
		},
	})
}

// ──────────────────────────────────────────────
// GET /admin/users
// ──────────────────────────────────────────────

func GetAdminUsers(c *gin.Context) {
	db := database.DB
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	status := c.Query("status")

	query := db.Model(&models.User{}).Where("role != ?", models.RoleAdmin)

	if search != "" {
		like := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(email) LIKE ?", like, like)
	}
	if status == "active" {
		query = query.Where("is_verified = ?", true)
	} else if status == "suspended" {
		query = query.Where("is_verified = ?", false)
	}

	var total int64
	query.Count(&total)

	var users []models.User
	query.Order("created_at DESC").Offset((page - 1) * limit).Limit(limit).Find(&users)

	// Get booking counts and totals per user
	type UserBookingStats struct {
		UserID        uint    `json:"user_id"`
		TotalBookings int64   `json:"total_bookings"`
		TotalSpent    float64 `json:"total_spent"`
	}
	var bookingStats []UserBookingStats
	userIDs := make([]uint, len(users))
	for i, u := range users {
		userIDs[i] = u.ID
	}
	if len(userIDs) > 0 {
		db.Raw(`
			SELECT b.user_id, COUNT(*) as total_bookings, COALESCE(SUM(b.total_amount), 0) as total_spent
			FROM bookings b
			WHERE b.user_id IN ? AND b.deleted_at IS NULL
			GROUP BY b.user_id
		`, userIDs).Scan(&bookingStats)
	}

	statsMap := make(map[uint]UserBookingStats)
	for _, s := range bookingStats {
		statsMap[s.UserID] = s
	}

	type UserResponse struct {
		ID            uint    `json:"id"`
		Name          string  `json:"name"`
		Email         string  `json:"email"`
		Phone         string  `json:"phone"`
		Status        string  `json:"status"`
		Joined        string  `json:"joined"`
		TotalBookings int64   `json:"total_bookings"`
		TotalSpent    float64 `json:"total_spent"`
	}

	var result []UserResponse
	for _, u := range users {
		st := "active"
		if !u.IsVerified {
			st = "suspended"
		}
		bs := statsMap[u.ID]
		result = append(result, UserResponse{
			ID:            u.ID,
			Name:          u.Name,
			Email:         u.Email,
			Phone:         u.Phone,
			Status:        st,
			Joined:        u.CreatedAt.Format("2 Jan 2006"),
			TotalBookings: bs.TotalBookings,
			TotalSpent:    bs.TotalSpent,
		})
	}

	// Reuse already-computed total; one extra count for active users only
	var totalActive int64
	db.Model(&models.User{}).Where("role != ? AND is_verified = ?", models.RoleAdmin, true).Count(&totalActive)
	totalSuspended := total - totalActive

	c.JSON(http.StatusOK, gin.H{
		"data": result,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
		"summary": gin.H{
			"total":     total,
			"active":    totalActive,
			"suspended": totalSuspended,
		},
	})
}

// ──────────────────────────────────────────────
// PUT /admin/users/:id/status
// ──────────────────────────────────────────────

func UpdateUserStatus(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var input struct {
		Status string `json:"status" binding:"required"` // "active" or "suspended"
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	verified := input.Status == "active"
	if err := db.Model(&models.User{}).Where("id = ?", id).Update("is_verified", verified).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User status updated"})
}

// ──────────────────────────────────────────────
// GET /admin/partners
// ──────────────────────────────────────────────

func GetAdminPartners(c *gin.Context) {
	db := database.DB
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	status := c.Query("status")
	partnerType := c.Query("type")

	query := db.Model(&models.Partner{}).Preload("User")

	if search != "" {
		like := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(company_name) LIKE ?", like)
	}

	if status == "pending" {
		query = query.Where("status IN ?", []string{string(models.PartnerStatusDraft), string(models.PartnerStatusInReview)})
	} else if status != "" && status != "all" {
		query = query.Where("status = ?", strings.ToUpper(status))
	}

	if partnerType != "" && partnerType != "all" {
		query = query.Where("type = ?", partnerType)
	}

	var total int64
	query.Count(&total)

	var partners []models.Partner
	query.Order("created_at DESC").Offset((page - 1) * limit).Limit(limit).Find(&partners)

	// Get revenue per partner
	type PartnerRevenue struct {
		PartnerID uint    `json:"partner_id"`
		Revenue   float64 `json:"revenue"`
	}
	pIDs := make([]uint, len(partners))
	for i, p := range partners {
		pIDs[i] = p.ID
	}
	var revenues []PartnerRevenue
	if len(pIDs) > 0 {
		db.Raw(`
			SELECT b.partner_id, COALESCE(SUM(pay.amount), 0) as revenue
			FROM bookings b
			JOIN payments pay ON pay.booking_id = b.id AND pay.status = 'PAID' AND pay.deleted_at IS NULL
			WHERE b.partner_id IN ? AND b.deleted_at IS NULL
			GROUP BY b.partner_id
		`, pIDs).Scan(&revenues)
	}
	revMap := make(map[uint]float64)
	for _, r := range revenues {
		revMap[r.PartnerID] = r.Revenue
	}

	type PartnerResponse struct {
		ID           uint    `json:"id"`
		Name         string  `json:"name"`
		Type         string  `json:"type"`
		Status       string  `json:"status"`
		Email        string  `json:"email"`
		Commission   string  `json:"commission"`
		Joined       string  `json:"joined"`
		TotalRevenue float64 `json:"total_revenue"`
		Location     string  `json:"location"`
	}

	var result []PartnerResponse
	for _, p := range partners {
		st := strings.ToLower(string(p.Status))
		if st == "in_review" || st == "draft" {
			st = "pending"
		}
		commStr := strconv.FormatFloat(p.CommissionRate, 'f', 0, 64) + "%"
		if p.CommissionRate == 0 {
			if p.Type == models.PartnerTypeHotel {
				commStr = "10%"
			} else {
				commStr = "8%"
			}
		}
		result = append(result, PartnerResponse{
			ID:           p.ID,
			Name:         p.CompanyName,
			Type:         string(p.Type),
			Status:       st,
			Email:        p.User.Email,
			Commission:   commStr,
			Joined:       p.CreatedAt.Format("2 Jan 2006"),
			TotalRevenue: revMap[p.ID],
			Location:     p.Address,
		})
	}

	// Pending count
	var pendingCount int64
	db.Model(&models.Partner{}).Where("status IN ?", []string{string(models.PartnerStatusDraft), string(models.PartnerStatusInReview)}).Count(&pendingCount)

	c.JSON(http.StatusOK, gin.H{
		"data": result,
		"meta": gin.H{
			"page":          page,
			"limit":         limit,
			"total":         total,
			"pending_count": pendingCount,
		},
	})
}

// ──────────────────────────────────────────────
// PUT /admin/partners/:id/status
// ──────────────────────────────────────────────

func UpdatePartnerStatus(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var input struct {
		Action string `json:"action" binding:"required"` // approve, reject, suspend
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var partner models.Partner
	if err := db.First(&partner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	switch input.Action {
	case "approve":
		now := time.Now()
		partner.Status = models.PartnerStatusApproved
		partner.ApprovedAt = &now
	case "reject":
		partner.Status = models.PartnerStatusRejected
	case "suspend":
		partner.Status = models.PartnerStatusSuspended
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
		return
	}

	if err := db.Save(&partner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update partner status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Partner status updated to " + string(partner.Status)})
}

// ──────────────────────────────────────────────
// GET /admin/bookings
// ──────────────────────────────────────────────

func GetAdminBookings(c *gin.Context) {
	db := database.DB
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	status := c.Query("status")
	bookingType := c.Query("type")

	query := db.Model(&models.Booking{})

	if search != "" {
		like := "%" + strings.ToLower(search) + "%"
		query = query.Where(
			"LOWER(booking_code) LIKE ? OR user_id IN (SELECT id FROM users WHERE LOWER(name) LIKE ?)",
			like, like,
		)
	}
	if status != "" && status != "all" {
		query = query.Where("booking_status = ?", strings.ToUpper(status))
	}
	if bookingType != "" && bookingType != "all" {
		query = query.Where("type = ?", bookingType)
	}

	var total int64
	query.Count(&total)

	var bookings []models.Booking
	query.Preload("User").Preload("Partner").
		Order("created_at DESC").
		Offset((page - 1) * limit).Limit(limit).
		Find(&bookings)

	type BookingResponse struct {
		ID         uint    `json:"id"`
		Code       string  `json:"booking_code"`
		Guest      string  `json:"guest"`
		Partner    string  `json:"partner"`
		Type       string  `json:"type"`
		Amount     float64 `json:"amount"`
		Commission float64 `json:"commission"`
		Status     string  `json:"status"`
		Date       string  `json:"date"`
	}

	var result []BookingResponse
	for _, b := range bookings {
		commRate := b.Partner.CommissionRate
		if commRate == 0 {
			if b.Type == models.BookingTypeHotel {
				commRate = 10
			} else {
				commRate = 8
			}
		}
		commission := b.TotalAmount * commRate / 100

		result = append(result, BookingResponse{
			ID:         b.ID,
			Code:       b.BookingCode,
			Guest:      b.User.Name,
			Partner:    b.Partner.CompanyName,
			Type:       string(b.Type),
			Amount:     b.TotalAmount,
			Commission: commission,
			Status:     strings.ToLower(string(b.BookingStatus)),
			Date:       b.CreatedAt.Format("2 Jan 2006"),
		})
	}

	// Single GROUP BY query replaces 3 sequential COUNT queries
	type StatusCount struct {
		Status string `gorm:"column:booking_status"`
		Count  int64  `gorm:"column:count"`
	}
	var statusCounts []StatusCount
	db.Raw(`SELECT booking_status, COUNT(*) as count FROM bookings WHERE deleted_at IS NULL GROUP BY booking_status`).Scan(&statusCounts)
	var confirmed, pending, cancelled, refunded, disputed int64
	for _, sc := range statusCounts {
		switch sc.Status {
		case "CONFIRMED":
			confirmed = sc.Count
		case "NEW":
			pending = sc.Count
		case "CANCELLED":
			cancelled = sc.Count
		case "REFUNDED":
			refunded = sc.Count
		case "DISPUTED":
			disputed = sc.Count
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data": result,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
		"summary": gin.H{
			"confirmed": confirmed,
			"pending":   pending,
			"cancelled": cancelled,
			"refunded":  refunded,
			"disputed":  disputed,
		},
	})
}

// ──────────────────────────────────────────────
// GET /admin/finance/stats
// ──────────────────────────────────────────────

func GetAdminFinanceStats(c *gin.Context) {
	db := database.DB

	// GMV (total booking amount, paid only)
	var gmv float64
	db.Model(&models.Booking{}).
		Where("payment_status = ?", models.PaymentStatusPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&gmv)

	// Platform Revenue (sum of commissions)
	var platformRevenue float64
	db.Raw(`
		SELECT COALESCE(SUM(
			CASE WHEN p.commission_rate > 0 THEN b.total_amount * p.commission_rate / 100
				 WHEN b.type = 'hotel' THEN b.total_amount * 10 / 100
				 ELSE b.total_amount * 8 / 100
			END
		), 0) as revenue
		FROM bookings b
		JOIN partners p ON p.id = b.partner_id
		JOIN payments pay ON pay.booking_id = b.id AND pay.status = 'PAID'
		WHERE b.deleted_at IS NULL AND pay.deleted_at IS NULL
	`).Scan(&platformRevenue)

	// Merged payout count + sum in single query
	var payoutSummary struct {
		Amount float64 `gorm:"column:amount"`
		Count  int64   `gorm:"column:count"`
	}
	db.Raw(`SELECT COALESCE(SUM(amount), 0) as amount, COUNT(*) as count FROM payout_requests WHERE status = 'pending' AND deleted_at IS NULL`).Scan(&payoutSummary)

	c.JSON(http.StatusOK, gin.H{
		"gmv":              gmv,
		"platform_revenue": platformRevenue,
		"pending_payouts": gin.H{
			"amount": payoutSummary.Amount,
			"count":  payoutSummary.Count,
		},
	})
}

// ──────────────────────────────────────────────
// GET /admin/finance/payouts
// ──────────────────────────────────────────────

func GetAdminPayouts(c *gin.Context) {
	db := database.DB
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	var total int64
	db.Model(&models.PayoutRequest{}).Count(&total)

	var payouts []models.PayoutRequest
	db.Preload("Partner").Preload("BankAccount").
		Order("created_at DESC").
		Offset((page - 1) * limit).Limit(limit).
		Find(&payouts)

	type PayoutResponse struct {
		ID      uint    `json:"id"`
		Partner string  `json:"partner"`
		Type    string  `json:"type"`
		Amount  float64 `json:"amount"`
		Status  string  `json:"status"`
		Date    string  `json:"date"`
	}

	var result []PayoutResponse
	for _, p := range payouts {
		result = append(result, PayoutResponse{
			ID:      p.ID,
			Partner: p.Partner.CompanyName,
			Type:    string(p.Partner.Type),
			Amount:  p.Amount,
			Status:  p.Status,
			Date:    p.CreatedAt.Format("2 Jan 2006"),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"data": result,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

// ──────────────────────────────────────────────
// PUT /admin/finance/payouts/:id
// ──────────────────────────────────────────────

func ProcessAdminPayout(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var payout models.PayoutRequest
	if err := db.First(&payout, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payout not found"})
		return
	}

	now := time.Now()
	payout.Status = "processing"
	payout.ProcessedAt = &now

	if err := db.Save(&payout).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process payout"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payout is now processing"})
}

// ── Helper: Log admin activity ────────────────
func logAdminActivity(adminID uint, action, target, category, status string) {
	database.DB.Create(&models.AdminActivityLog{
		AdminID:  adminID,
		Action:   action,
		Target:   target,
		Category: category,
		Status:   status,
	})
}

func getAdminID(c *gin.Context) uint {
	val, _ := c.Get("user_id")
	return val.(uint)
}

// ──────────────────────────────────────────────
// GET /admin/notifications
// ──────────────────────────────────────────────

func GetAdminNotifications(c *gin.Context) {
	db := database.DB
	adminID := getAdminID(c)

	var notifications []models.Notification
	db.Where("user_id = ?", adminID).Order("created_at DESC").Limit(50).Find(&notifications)

	type NotifResponse struct {
		ID         uint   `json:"id"`
		Title      string `json:"title"`
		Message    string `json:"message"`
		Type       string `json:"type"`
		Importance string `json:"importance"`
		IsRead     bool   `json:"is_read"`
		Time       string `json:"time"`
	}
	var result []NotifResponse
	for _, n := range notifications {
		importance := "low"
		if n.Type == models.NotificationTypeInfo {
			importance = "medium"
		}
		result = append(result, NotifResponse{
			ID:         n.ID,
			Title:      n.Title,
			Message:    n.Message,
			Type:       string(n.Type),
			Importance: importance,
			IsRead:     n.Read,
			Time:       formatTimeAgo(n.CreatedAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

// ──────────────────────────────────────────────
// PUT /admin/notifications/read-all
// ──────────────────────────────────────────────

func MarkAdminNotificationsRead(c *gin.Context) {
	db := database.DB
	adminID := getAdminID(c)

	db.Model(&models.Notification{}).Where("user_id = ?", adminID).Update("read", true)
	c.JSON(http.StatusOK, gin.H{"message": "All notifications marked as read"})
}

// ──────────────────────────────────────────────
// DELETE /admin/notifications/:id
// ──────────────────────────────────────────────

func DeleteAdminNotification(c *gin.Context) {
	db := database.DB
	adminID := getAdminID(c)
	id := c.Param("id")

	if err := db.Where("id = ? AND user_id = ?", id, adminID).Delete(&models.Notification{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete notification"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Notification deleted"})
}

// ──────────────────────────────────────────────
// Destinations CRUD (uses City model)
// ──────────────────────────────────────────────

func GetAdminDestinations(c *gin.Context) {
	db := database.DB

	type DestResponse struct {
		ID       uint   `json:"id"`
		Name     string `json:"name"`
		Country  string `json:"country"`
		Hotels   int64  `json:"hotels"`
		Flights  int64  `json:"flights"`
		Featured bool   `json:"featured"`
	}

	// Single JOIN query eliminates N+1 COUNT-per-city loop
	type cityWithCount struct {
		ID        uint   `gorm:"column:id"`
		Name      string `gorm:"column:name"`
		Country   string `gorm:"column:country"`
		IsPopular bool   `gorm:"column:is_popular"`
		Hotels    int64  `gorm:"column:hotels"`
	}
	var rows []cityWithCount
	db.Raw(`
		SELECT c.id, c.name, c.country, c.is_popular,
		       COUNT(h.id) as hotels
		FROM cities c
		LEFT JOIN hotels h ON h.city_id = c.id AND h.deleted_at IS NULL
		WHERE c.deleted_at IS NULL
		GROUP BY c.id, c.name, c.country, c.is_popular
		ORDER BY c.name ASC
	`).Scan(&rows)

	var result []DestResponse
	for _, row := range rows {
		result = append(result, DestResponse{
			ID:       row.ID,
			Name:     row.Name,
			Country:  row.Country,
			Hotels:   row.Hotels,
			Flights:  0,
			Featured: row.IsPopular,
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func CreateAdminDestination(c *gin.Context) {
	db := database.DB
	var input struct {
		Name     string `json:"name" binding:"required"`
		Country  string `json:"country" binding:"required"`
		Featured bool   `json:"featured"`
		ImageURL string `json:"image_url"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	city := models.City{Name: input.Name, Country: input.Country, IsPopular: input.Featured, ImageURL: input.ImageURL}
	if err := db.Create(&city).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create destination"})
		return
	}

	logAdminActivity(getAdminID(c), "Created Destination", input.Name, "content", "success")
	c.JSON(http.StatusCreated, gin.H{"data": city})
}

func UpdateAdminDestination(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var city models.City
	if err := db.First(&city, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Destination not found"})
		return
	}

	var input struct {
		Name     string `json:"name"`
		Country  string `json:"country"`
		Featured bool   `json:"featured"`
		ImageURL string `json:"image_url"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Name != "" {
		city.Name = input.Name
	}
	if input.Country != "" {
		city.Country = input.Country
	}
	city.IsPopular = input.Featured
	if input.ImageURL != "" {
		city.ImageURL = input.ImageURL
	}

	db.Save(&city)
	logAdminActivity(getAdminID(c), "Updated Destination", city.Name, "content", "success")
	c.JSON(http.StatusOK, gin.H{"data": city})
}

func DeleteAdminDestination(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var city models.City
	if err := db.First(&city, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Destination not found"})
		return
	}

	db.Delete(&city)
	logAdminActivity(getAdminID(c), "Deleted Destination", city.Name, "content", "success")
	c.JSON(http.StatusOK, gin.H{"message": "Destination deleted"})
}

// ──────────────────────────────────────────────
// Banners CRUD
// ──────────────────────────────────────────────

func GetAdminBanners(c *gin.Context) {
	db := database.DB
	var banners []models.Banner
	db.Order("created_at DESC").Find(&banners)

	type BannerResponse struct {
		ID        uint   `json:"id"`
		Title     string `json:"title"`
		Placement string `json:"placement"`
		Status    string `json:"status"`
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
		ImageURL  string `json:"image_url"`
	}
	var result []BannerResponse
	for _, b := range banners {
		result = append(result, BannerResponse{
			ID:        b.ID,
			Title:     b.Title,
			Placement: b.Placement,
			Status:    string(b.Status),
			StartDate: b.StartDate.Format("2 Jan 2006"),
			EndDate:   b.EndDate.Format("2 Jan 2006"),
			ImageURL:  b.ImageURL,
		})
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func CreateAdminBanner(c *gin.Context) {
	db := database.DB
	var input struct {
		Title     string `json:"title" binding:"required"`
		Placement string `json:"placement" binding:"required"`
		Status    string `json:"status"`
		StartDate string `json:"start_date" binding:"required"`
		EndDate   string `json:"end_date" binding:"required"`
		ImageURL  string `json:"image_url"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, _ := time.Parse("2006-01-02", input.StartDate)
	endDate, _ := time.Parse("2006-01-02", input.EndDate)

	status := models.BannerStatusDraft
	if input.Status == "active" {
		status = models.BannerStatusActive
	}

	banner := models.Banner{
		Title: input.Title, Placement: input.Placement, Status: status,
		StartDate: startDate, EndDate: endDate, ImageURL: input.ImageURL,
	}
	if err := db.Create(&banner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create banner"})
		return
	}

	logAdminActivity(getAdminID(c), "Created Banner", input.Title, "content", "success")
	c.JSON(http.StatusCreated, gin.H{"data": banner})
}

func UpdateAdminBanner(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var banner models.Banner
	if err := db.First(&banner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Banner not found"})
		return
	}

	var input struct {
		Title     string `json:"title"`
		Placement string `json:"placement"`
		Status    string `json:"status"`
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
		ImageURL  string `json:"image_url"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Title != "" {
		banner.Title = input.Title
	}
	if input.Placement != "" {
		banner.Placement = input.Placement
	}
	if input.Status != "" {
		banner.Status = models.BannerStatus(input.Status)
	}
	if input.StartDate != "" {
		t, _ := time.Parse("2006-01-02", input.StartDate)
		banner.StartDate = t
	}
	if input.EndDate != "" {
		t, _ := time.Parse("2006-01-02", input.EndDate)
		banner.EndDate = t
	}
	if input.ImageURL != "" {
		banner.ImageURL = input.ImageURL
	}

	db.Save(&banner)
	logAdminActivity(getAdminID(c), "Updated Banner", banner.Title, "content", "success")
	c.JSON(http.StatusOK, gin.H{"data": banner})
}

func DeleteAdminBanner(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var banner models.Banner
	if err := db.First(&banner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Banner not found"})
		return
	}

	db.Delete(&banner)
	logAdminActivity(getAdminID(c), "Deleted Banner", banner.Title, "content", "success")
	c.JSON(http.StatusOK, gin.H{"message": "Banner deleted"})
}

// ──────────────────────────────────────────────
// Articles CRUD
// ──────────────────────────────────────────────

func GetAdminArticles(c *gin.Context) {
	db := database.DB
	var articles []models.Article
	db.Order("created_at DESC").Find(&articles)

	type ArticleResponse struct {
		ID     uint   `json:"id"`
		Title  string `json:"title"`
		Author string `json:"author"`
		Status string `json:"status"`
		Date   string `json:"date"`
		Views  int    `json:"views"`
	}
	var result []ArticleResponse
	for _, a := range articles {
		result = append(result, ArticleResponse{
			ID: a.ID, Title: a.Title, Author: a.Author,
			Status: string(a.Status), Date: a.CreatedAt.Format("2 Jan 2006"), Views: a.Views,
		})
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func CreateAdminArticle(c *gin.Context) {
	db := database.DB
	var input struct {
		Title   string `json:"title" binding:"required"`
		Content string `json:"content"`
		Author  string `json:"author" binding:"required"`
		Status  string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	status := models.ArticleStatusDraft
	if input.Status == "published" {
		status = models.ArticleStatusPublished
	}

	article := models.Article{Title: input.Title, Content: input.Content, Author: input.Author, Status: status}
	if err := db.Create(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create article"})
		return
	}

	logAdminActivity(getAdminID(c), "Created Article", input.Title, "content", "success")
	c.JSON(http.StatusCreated, gin.H{"data": article})
}

func UpdateAdminArticle(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var article models.Article
	if err := db.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	var input struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		Author  string `json:"author"`
		Status  string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Title != "" {
		article.Title = input.Title
	}
	if input.Content != "" {
		article.Content = input.Content
	}
	if input.Author != "" {
		article.Author = input.Author
	}
	if input.Status != "" {
		article.Status = models.ArticleStatus(input.Status)
	}

	db.Save(&article)
	logAdminActivity(getAdminID(c), "Updated Article", article.Title, "content", "success")
	c.JSON(http.StatusOK, gin.H{"data": article})
}

func DeleteAdminArticle(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var article models.Article
	if err := db.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	db.Delete(&article)
	logAdminActivity(getAdminID(c), "Deleted Article", article.Title, "content", "success")
	c.JSON(http.StatusOK, gin.H{"message": "Article deleted"})
}

// ──────────────────────────────────────────────
// Admin Accounts CRUD
// ──────────────────────────────────────────────

func isSuperAdmin(c *gin.Context) bool {
	db := database.DB
	adminIDVal, exists := c.Get("user_id")
	if !exists { return false }
	
	adminID := uint(0)
	switch v := adminIDVal.(type) {
	case uint: adminID = v
	case float64: adminID = uint(v)
	}

	var user models.User
	if err := db.Where("id = ? AND role = ?", adminID, models.RoleAdmin).First(&user).Error; err != nil {
		log.Printf("isSuperAdmin check failed: User %v not found", adminID)
		return false
	}
	
	return user.SubRole == "super_admin"
}

func GetAdminAccounts(c *gin.Context) {
	db := database.DB
	var admins []models.User
	db.Where("role = ?", models.RoleAdmin).Order("created_at ASC").Find(&admins)

	type AdminResponse struct {
		ID         uint   `json:"id"`
		Name       string `json:"name"`
		Email      string `json:"email"`
		Role       string `json:"role"`
		LastActive string `json:"last_active"`
	}
	var result []AdminResponse
	for _, a := range admins {
		result = append(result, AdminResponse{
			ID:    a.ID,
			Name:  a.Name,
			Email: a.Email,
			Role:  a.SubRole,
			LastActive: formatTimeAgo(a.UpdatedAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func CreateAdminAccount(c *gin.Context) {
	// Only super admins can create other admins
	if !isSuperAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can manage accounts"})
		return
	}

	db := database.DB
	var input struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
		Role     string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists (including soft-deleted)
	var existing models.User
	if err := db.Unscoped().Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Name:       input.Name,
		Email:      input.Email,
		Password:   string(hashedPassword),
		Role:       models.RoleAdmin,
		SubRole:    input.Role,
		IsVerified: true,
	}
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create admin"})
		return
	}

	logAdminActivity(getAdminID(c), "Created Admin Account", input.Name, "system", "success")
	c.JSON(http.StatusCreated, gin.H{"data": gin.H{"id": user.ID, "name": user.Name, "email": user.Email, "role": user.SubRole}})
}

func UpdateAdminAccount(c *gin.Context) {
	// Only super admins can update other admins
	if !isSuperAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can manage accounts"})
		return
	}

	db := database.DB
	id := c.Param("id")

	var user models.User
	if err := db.Where("id = ? AND role = ?", id, models.RoleAdmin).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	if input.Name != "" {
		user.Name = input.Name
	}
	if input.Email != "" {
		// Check email uniqueness if changed (including soft-deleted)
		if input.Email != user.Email {
			var existing models.User
			if err := db.Unscoped().Where("email = ?", input.Email).First(&existing).Error; err == nil {
				c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
				return
			}
			user.Email = input.Email
		}
	}
	if input.Role != "" {
		user.SubRole = input.Role
	}
	if input.Password != "" {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		user.Password = string(hashedPassword)
	}

	if err := db.Save(&user).Error; err != nil {
		log.Printf("UpdateAdminAccount: Failed to save user %d: %v", user.ID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update admin: " + err.Error()})
		return
	}

	logAdminActivity(getAdminID(c), "Updated Admin Account", user.Name, "system", "success")
	c.JSON(http.StatusOK, gin.H{"data": gin.H{"id": user.ID, "name": user.Name, "email": user.Email, "role": user.SubRole}})
}

func DeleteAdminAccount(c *gin.Context) {
	// Only super admins can delete other admins
	if !isSuperAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can manage accounts"})
		return
	}

	db := database.DB
	id := c.Param("id")
	adminID := getAdminID(c)

	// Prevent self-deletion
	idUint, _ := strconv.ParseUint(id, 10, 64)
	if uint(idUint) == adminID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete your own account"})
		return
	}

	var user models.User
	if err := db.Where("id = ? AND role = ?", id, models.RoleAdmin).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	db.Delete(&user)
	logAdminActivity(adminID, "Deleted Admin Account", user.Name, "system", "warning")
	c.JSON(http.StatusOK, gin.H{"message": "Admin account deleted"})
}

// ──────────────────────────────────────────────
// GET /admin/activity-log
// ──────────────────────────────────────────────

func GetAdminActivityLog(c *gin.Context) {
	// Only super admins can view activity logs
	if !isSuperAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can access activity logs"})
		return
	}
	db := database.DB
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	category := c.Query("category")

	query := db.Model(&models.AdminActivityLog{}).Preload("Admin")

	if search != "" {
		like := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(action) LIKE ? OR LOWER(target) LIKE ?", like, like)
	}
	if category != "" && category != "all" {
		query = query.Where("category = ?", category)
	}

	var total int64
	query.Count(&total)

	var logs []models.AdminActivityLog
	query.Order("created_at DESC").Offset((page - 1) * limit).Limit(limit).Find(&logs)

	type LogResponse struct {
		ID        uint   `json:"id"`
		AdminName string `json:"admin_name"`
		AdminRole string `json:"admin_role"`
		Action    string `json:"action"`
		Target    string `json:"target"`
		Category  string `json:"category"`
		Timestamp string `json:"timestamp"`
		Status    string `json:"status"`
	}
	var result []LogResponse
	for _, l := range logs {
		result = append(result, LogResponse{
			ID:        l.ID,
			AdminName: l.Admin.Name,
			AdminRole: "Admin",
			Action:    l.Action,
			Target:    l.Target,
			Category:  l.Category,
			Timestamp: l.CreatedAt.Format("2 Jan 2006, 15:04"),
			Status:    l.Status,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"data": result,
		"meta": gin.H{"page": page, "limit": limit, "total": total},
	})
}

// ──────────────────────────────────────────────
// GET /admin/reports
// ──────────────────────────────────────────────

func GetAdminReports(c *gin.Context) {
	db := database.DB
	twelveMonthsAgo := time.Now().AddDate(0, -12, 0)
	thisMonthStart := time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.UTC)

	// ── 2 aggregate queries replace 24 sequential queries ─────────
	type monthRevRow struct {
		Trunc    string  `gorm:"column:trunc"`
		Revenue  float64 `gorm:"column:revenue"`
	}
	type monthBkRow struct {
		Trunc    string `gorm:"column:trunc"`
		Bookings int64  `gorm:"column:bookings"`
	}

	var revRows []monthRevRow
	var bkRows []monthBkRow
	var wg sync.WaitGroup
	wg.Add(2)
	go func() { defer wg.Done()
		trunc := database.TruncateMonthSQL("created_at")
		db.Raw(`
			SELECT `+trunc+` as trunc, COALESCE(SUM(amount), 0) as revenue
			FROM payments
			WHERE status = ? AND created_at >= ? AND deleted_at IS NULL
			GROUP BY `+trunc+`
		`, models.PaymentStatusPaid, twelveMonthsAgo).Scan(&revRows)
	}()
	go func() { defer wg.Done()
		trunc := database.TruncateMonthSQL("created_at")
		db.Raw(`
			SELECT `+trunc+` as trunc, COUNT(*) as bookings
			FROM bookings
			WHERE created_at >= ? AND deleted_at IS NULL
			GROUP BY `+trunc+`
		`, twelveMonthsAgo).Scan(&bkRows)
	}()
	wg.Wait()

	// Build keyed maps for O(1) lookup
	revMap := make(map[string]float64)
	for _, r := range revRows {
		revMap[formatTrunc(r.Trunc)] = r.Revenue
	}
	bkMap := make(map[string]int64)
	for _, b := range bkRows {
		bkMap[formatTrunc(b.Trunc)] = b.Bookings
	}

	type MonthlyReport struct {
		Name     string  `json:"name"`
		Revenue  float64 `json:"revenue"`
		Bookings int64   `json:"bookings"`
	}
	var monthlyData []MonthlyReport
	var totalRevenue float64
	var totalBookings int64
	for i := 11; i >= 0; i-- {
		m := time.Now().AddDate(0, -i, 0)
		key := m.Format("2006-01")
		r := revMap[key]
		b := bkMap[key]
		totalRevenue += r
		totalBookings += b
		monthlyData = append(monthlyData, MonthlyReport{Name: m.Format("Jan"), Revenue: r, Bookings: b})
	}

	// Summary counts (parallel with distribution)
	var totalUsers, newUsers int64
	var distRows []struct {
		Type  string `gorm:"column:type"`
		Count int64  `gorm:"column:count"`
	}
	wg.Add(2)
	go func() { defer wg.Done()
		db.Model(&models.User{}).Where("role = ?", models.RoleUser).Count(&totalUsers)
		db.Model(&models.User{}).Where("role = ? AND created_at >= ?", models.RoleUser, thisMonthStart).Count(&newUsers)
	}()
	go func() { defer wg.Done()
		db.Raw(`SELECT type, COUNT(*) as count FROM bookings WHERE deleted_at IS NULL AND type IN (?, ?) GROUP BY type`,
			models.BookingTypeHotel, models.BookingTypeFlight).Scan(&distRows)
	}()
	wg.Wait()

	var hbCount, fbCount int64
	for _, dr := range distRows {
		if dr.Type == string(models.BookingTypeHotel) {
			hbCount = dr.Count
		} else {
			fbCount = dr.Count
		}
	}
	totalDist := hbCount + fbCount
	var hotelPct, flightPct int
	if totalDist > 0 {
		hotelPct = int(float64(hbCount) / float64(totalDist) * 100)
		flightPct = 100 - hotelPct
	}

	var avgOrder float64
	if totalBookings > 0 {
		avgOrder = totalRevenue / float64(totalBookings)
	}

	c.JSON(http.StatusOK, gin.H{
		"monthly_data": monthlyData,
		"summary": gin.H{
			"total_revenue":  totalRevenue,
			"total_bookings": totalBookings,
			"new_users":      newUsers,
			"avg_order":      math.Round(avgOrder),
		},
		"distribution": []gin.H{
			{"name": "Hotels", "value": hotelPct},
			{"name": "Flights", "value": flightPct},
		},
	})
}

// ──────────────────────────────────────────────
// GET /admin/bookings/:id
// ──────────────────────────────────────────────

func GetAdminBookingDetail(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var booking models.Booking
	if err := db.Preload("User").Preload("Partner").
		Where("booking_code = ? OR id = ?", id, id).
		First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	commRate := booking.Partner.CommissionRate
	if commRate == 0 {
		if booking.Type == models.BookingTypeHotel {
			commRate = 10
		} else {
			commRate = 8
		}
	}
	commission := booking.TotalAmount * commRate / 100

	// Build payment info
	var payment models.Payment
	db.Where("booking_id = ?", booking.ID).First(&payment)

	paymentMethod := "N/A"
	if payment.ID > 0 {
		paymentMethod = payment.Gateway
		if paymentMethod == "" {
			paymentMethod = "Midtrans"
		}
	}

	// Build breakdown
	breakdown := []gin.H{
		{"label": "Booking Amount", "amount": formatAmount(booking.TotalAmount)},
		{"label": "Service Fee", "amount": formatAmount(5000)},
		{"label": "Total Paid", "amount": formatAmount(booking.TotalAmount + 5000)},
	}

	// Hotel-specific fields
	var checkIn, checkOut, roomType string
	var nights, guests int

	if booking.Type == models.BookingTypeHotel {
		var hb models.HotelBooking
		if err := db.Preload("RoomType").Where("booking_id = ?", booking.ID).First(&hb).Error; err == nil {
			checkIn = hb.CheckIn.Format("2 January 2006")
			checkOut = hb.CheckOut.Format("2 January 2006")
			roomType = hb.RoomType.Name
			nights = int(hb.CheckOut.Sub(hb.CheckIn).Hours() / 24)
			guests = hb.Guests
		}
	}

	result := gin.H{
		"id":           booking.BookingCode,
		"status":       strings.ToLower(string(booking.BookingStatus)),
		"guest": gin.H{
			"name":  booking.User.Name,
			"email": booking.User.Email,
			"phone": booking.User.Phone,
		},
		"guest_user_id": booking.UserID,
		"partner":       booking.Partner.CompanyName,
		"partner_id":    booking.PartnerID,
		"partner_type":  string(booking.Type),
		"room_type":     roomType,
		"check_in":      checkIn,
		"check_out":     checkOut,
		"nights":        nights,
		"guests":        guests,
		"special_request": "",
		"payment": gin.H{
			"method":    paymentMethod,
			"total":     formatAmount(booking.TotalAmount + 5000),
			"breakdown": breakdown,
		},
		"commission": formatAmount(commission),
		"created_at": booking.CreatedAt.Format("2 January 2006, 15:04 WIB"),
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

// ──────────────────────────────────────────────
// GET /admin/users/:id
// ──────────────────────────────────────────────

func GetAdminUserDetail(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var user models.User
	if err := db.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Booking stats
	var totalBookings int64
	var totalSpent float64
	db.Model(&models.Booking{}).Where("user_id = ?", user.ID).Count(&totalBookings)
	db.Model(&models.Booking{}).Where("user_id = ?", user.ID).Select("COALESCE(SUM(total_amount), 0)").Scan(&totalSpent)

	st := "active"
	if !user.IsVerified {
		st = "suspended"
	}

	// Recent bookings
	type BookingRow struct {
		ID      string  `json:"id"`
		Type    string  `json:"type"`
		Partner string  `json:"partner"`
		Date    string  `json:"date"`
		Amount  float64 `json:"amount"`
		Status  string  `json:"status"`
	}
	var bookings []models.Booking
	db.Preload("Partner").Where("user_id = ?", user.ID).Order("created_at DESC").Limit(10).Find(&bookings)

	var bookingHistory []BookingRow
	for _, b := range bookings {
		bookingHistory = append(bookingHistory, BookingRow{
			ID:      b.BookingCode,
			Type:    string(b.Type),
			Partner: b.Partner.CompanyName,
			Date:    b.CreatedAt.Format("2 Jan 2006"),
			Amount:  b.TotalAmount,
			Status:  strings.ToLower(string(b.BookingStatus)),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":              user.ID,
			"name":            user.Name,
			"email":           user.Email,
			"phone":           user.Phone,
			"address":         "",
			"status":          st,
			"joined":          user.CreatedAt.Format("2 January 2006"),
			"total_bookings":  totalBookings,
			"total_spent":     totalSpent,
			"loyalty_points":  0,
		},
		"booking_history": bookingHistory,
	})
}

// ──────────────────────────────────────────────
// GET /admin/partners/:id
// ──────────────────────────────────────────────

func GetAdminPartnerDetail(c *gin.Context) {
	db := database.DB
	id := c.Param("id")

	var partner models.Partner
	if err := db.Preload("User").First(&partner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Partner not found"})
		return
	}

	// Stats
	var totalBookings int64
	var totalRevenue float64
	db.Model(&models.Booking{}).Where("partner_id = ?", partner.ID).Count(&totalBookings)
	db.Raw(`
		SELECT COALESCE(SUM(pay.amount), 0)
		FROM bookings b
		JOIN payments pay ON pay.booking_id = b.id AND pay.status = 'PAID' AND pay.deleted_at IS NULL
		WHERE b.partner_id = ? AND b.deleted_at IS NULL
	`, partner.ID).Scan(&totalRevenue)

	var avgRating float64
	db.Model(&models.Review{}).
		Joins("JOIN bookings ON bookings.id = reviews.booking_id").
		Where("bookings.partner_id = ?", partner.ID).
		Select("COALESCE(AVG(reviews.rating), 0)").Scan(&avgRating)

	st := strings.ToLower(string(partner.Status))
	if st == "in_review" || st == "draft" {
		st = "pending"
	}

	commStr := strconv.FormatFloat(partner.CommissionRate, 'f', 0, 64) + "%"
	if partner.CommissionRate == 0 {
		if partner.Type == models.PartnerTypeHotel {
			commStr = "10%"
		} else {
			commStr = "8%"
		}
	}

	// Recent bookings
	type RBRow struct {
		ID     string  `json:"id"`
		Guest  string  `json:"guest"`
		Date   string  `json:"date"`
		Amount float64 `json:"amount"`
		Status string  `json:"status"`
	}
	var bookings []models.Booking
	db.Preload("User").Where("partner_id = ?", partner.ID).Order("created_at DESC").Limit(5).Find(&bookings)

	var recentBookings []RBRow
	for _, b := range bookings {
		recentBookings = append(recentBookings, RBRow{
			ID:     b.BookingCode,
			Guest:  b.User.Name,
			Date:   b.CreatedAt.Format("2 Jan 2006"),
			Amount: b.TotalAmount,
			Status: strings.ToLower(string(b.BookingStatus)),
		})
	}

	pType := string(partner.Type)
	if pType == "flight" {
		pType = "airline"
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":             partner.ID,
			"name":           partner.CompanyName,
			"type":           pType,
			"status":         st,
			"email":          partner.User.Email,
			"phone":          partner.User.Phone,
			"address":        partner.Address,
			"commission":     commStr,
			"joined":         partner.CreatedAt.Format("2 January 2006"),
			"total_revenue":  totalRevenue,
			"total_bookings": totalBookings,
			"rating":         math.Round(avgRating*10) / 10,
		},
		"recent_bookings": recentBookings,
	})
}

// ──────────────────────────────────────────────
// Platform Settings
// ──────────────────────────────────────────────

func GetPlatformSettings(c *gin.Context) {
	db := database.DB
	var settings []models.PlatformSetting
	db.Find(&settings)

	result := make(map[string]string)
	for _, s := range settings {
		result[s.Key] = s.Value
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func UpdatePlatformSettings(c *gin.Context) {
	if !isSuperAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can manage platform settings"})
		return
	}
	db := database.DB
	var input map[string]string
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for key, val := range input {
		var setting models.PlatformSetting
		if err := db.Unscoped().Where("`key` = ?", key).First(&setting).Error; err != nil {
			setting = models.PlatformSetting{Key: key, Value: val}
			if err := db.Create(&setting).Error; err != nil {
				log.Printf("UpdatePlatformSettings: Failed to create key %s: %v", key, err)
			}
		} else {
			setting.Value = val
			setting.DeletedAt = gorm.DeletedAt{} // Restore if soft-deleted
			if err := db.Save(&setting).Error; err != nil {
				log.Printf("UpdatePlatformSettings: Failed to save key %s: %v", key, err)
			}
		}
	}

	logAdminActivity(getAdminID(c), "Updated Platform Settings", "system", "settings", "success")
	c.JSON(http.StatusOK, gin.H{"message": "Settings updated successfully"})
}

// ──────────────────────────────────────────────
// Master Data (Facilities)
// ──────────────────────────────────────────────

func GetAdminFacilities(c *gin.Context) {
	db := database.DB
	var facilities []models.Facility
	db.Find(&facilities)

	type FacilityResponse struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
		Icon string `json:"icon"`
	}

	var result []FacilityResponse
	for _, f := range facilities {
		result = append(result, FacilityResponse{
			ID:   f.ID,
			Name: f.Name,
			Icon: f.Icon,
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func CreateAdminFacility(c *gin.Context) {
	if !isSuperAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can manage master data"})
		return
	}
	db := database.DB
	var input struct {
		Name string `json:"name" binding:"required"`
		Icon string `json:"icon"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	facility := models.Facility{Name: input.Name, Icon: input.Icon}
	if err := db.Create(&facility).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create facility"})
		return
	}

	logAdminActivity(getAdminID(c), "Created Facility", input.Name, "master_data", "success")
	c.JSON(http.StatusCreated, gin.H{"data": facility})
}

func DeleteAdminFacility(c *gin.Context) {
	if !isSuperAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only super admins can manage master data"})
		return
	}
	db := database.DB
	id := c.Param("id")

	if err := db.Delete(&models.Facility{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete facility"})
		return
	}

	logAdminActivity(getAdminID(c), "Deleted Facility", id, "master_data", "success")
	c.JSON(http.StatusOK, gin.H{"message": "Facility deleted"})
}

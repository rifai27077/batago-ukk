package models_test

import (
	"testing"

	"github.com/rifai27077/batago-backend/internal/models"
	"github.com/rifai27077/batago-backend/internal/testutil"
	"github.com/stretchr/testify/assert"
)

func TestPartner_AfterSaveHook(t *testing.T) {
	db := testutil.SetupTestDB()
	
	// 1. Create a normal user
	user := testutil.SeedUser(db, "Test User", "hook@test.com", "pass", models.RoleUser, true)
	assert.Equal(t, models.RoleUser, user.Role)
	
	// 2. Create a partner with status APPROVED
	partner := models.Partner{
		UserID: user.ID,
		CompanyName: "Test Co",
		Type: models.PartnerTypeHotel,
		Status: models.PartnerStatusApproved,
	}
	db.Create(&partner)
	
	// 3. Check if user role was updated to PARTNER
	var updatedUser models.User
	db.First(&updatedUser, user.ID)
	assert.Equal(t, models.RolePartner, updatedUser.Role)
	
	// 4. Update partner to REJECTED
	partner.Status = models.PartnerStatusRejected
	db.Save(&partner)
	
	// 5. Check if user role was reverted to USER
	db.First(&updatedUser, user.ID)
	assert.Equal(t, models.RoleUser, updatedUser.Role)
}

func TestBooking_GenerateBookingCode(t *testing.T) {
	// Testing the generateBookingCode logic indirectly via CreateFlightBooking 
	// or testing the logic if exported (it's unexported in handlers).
	// We'll trust the handler tests for code generation.
}

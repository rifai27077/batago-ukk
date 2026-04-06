package service

import (
	"bytes"
	"fmt"

	"github.com/jung-kurt/gofpdf/v2"
	"github.com/rifai27077/batago-backend/internal/models"
)

// GenerateTicketPDF generates a PDF for a flight ticket or hotel voucher
func GenerateTicketPDF(booking models.Booking, detail interface{}) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(15, 15, 15)
	pdf.SetAutoPageBreak(true, 15)
	pdf.AddPage()

	// --- Branding Colors ---
	// BataGo Teal (#14B8A6) -> (20, 184, 166)
	pTeal := []int{20, 184, 166}
	pDark := []int{17, 24, 39}      // #111827
	pGray := []int{107, 114, 128}   // #6B7280
	pLight := []int{243, 244, 246}  // #F3F4F6
	
	// Helper for mock barcode
	drawFakeBarcode := func(x, y, maxW, h float64, seedText string) {
		pdf.SetFillColor(pDark[0], pDark[1], pDark[2])
		cX := x
		for i := 0; i < len(seedText)*5; i++ {
			bw := float64((i*7%4)+1) * 0.4 // Bar width
			gw := float64((i*11%3)+1) * 0.4 // Gap width
			if cX+bw > x+maxW {
				break
			}
			pdf.Rect(cX, y, bw, h, "F")
			cX += bw + gw
		}
	}

	// --- 1. HEADER RECTANGLE ---
	pdf.SetFillColor(pTeal[0], pTeal[1], pTeal[2])
	pdf.Rect(0, 0, 210, 40, "F")

	// Logo Section
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Arial", "B", 28)
	pdf.Text(15, 25, "BataGo")

	pdf.SetFont("Arial", "", 10)
	pdf.Text(16, 33, "Your Premium Travel Partner")

	// Title Section
	docTitle := "E-TICKET"
	if booking.Type == models.BookingTypeHotel {
		docTitle = "HOTEL VOUCHER"
	}
	pdf.SetFont("Arial", "B", 18)
	pdf.SetXY(110, 15)
	pdf.CellFormat(85, 10, docTitle, "", 0, "R", false, 0, "")

	// Status Badge
	pdf.SetFont("Arial", "B", 10)
	pdf.SetDrawColor(255, 255, 255)
	pdf.SetLineWidth(0.5)
	pdf.Rect(165, 25, 30, 8, "D") // Transparent outline
	pdf.SetXY(165, 25)
	pdf.CellFormat(30, 8, "CONFIRMED", "", 0, "C", false, 0, "")

	pdf.SetY(45)

	// --- 2. BOOKING SUMMARY ---
	// Outline Box
	pdf.SetDrawColor(230, 230, 230)
	pdf.SetFillColor(pLight[0], pLight[1], pLight[2])
	pdf.Rect(15, 45, 180, 22, "FD")

	pdf.SetXY(20, 50)
	pdf.SetFont("Arial", "B", 8)
	pdf.SetTextColor(pGray[0], pGray[1], pGray[2])
	pdf.Cell(45, 4, "ORDER NUMBER")
	pdf.Cell(45, 4, "BOOKING DATE")
	pdf.Cell(45, 4, "PAYMENT METHOD")
	pdf.Cell(45, 4, "TOTAL AMOUNT")

	pdf.SetXY(20, 55)
	pdf.SetFont("Arial", "B", 11)
	pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
	pdf.Cell(45, 6, booking.BookingCode)
	pdf.Cell(45, 6, booking.CreatedAt.Format("02 Jan 2006"))
	pdf.Cell(45, 6, "MIDTRANS")
	
	pdf.SetTextColor(pTeal[0], pTeal[1], pTeal[2])
	
	rawTotal := int64(booking.TotalAmount)
	var amountStr string
	if rawTotal >= 1000000 {
		amountStr = fmt.Sprintf("Rp %d.%03d.%03d", rawTotal/1000000, (rawTotal%1000000)/1000, rawTotal%1000)
	} else if rawTotal >= 1000 {
		amountStr = fmt.Sprintf("Rp %d.%03d", rawTotal/1000, rawTotal%1000)
	} else {
		amountStr = fmt.Sprintf("Rp %d", rawTotal)
	}
	
	pdf.Cell(45, 6, amountStr)

	pdf.SetY(75)

	// --- 3. TICKET CONTENT ---
	if booking.Type == models.BookingTypeFlight {
		fb, ok := detail.(*models.FlightBooking)
		if ok {
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 8, "FLIGHT DETAILS")
			pdf.Ln(8)

			// Outer Boarding Pass Container
			startY := pdf.GetY()
			boxHeight := 75.0
			pdf.SetLineWidth(0.3)
			pdf.SetDrawColor(200, 200, 200)
			pdf.Rect(15, startY, 180, boxHeight, "D")
			
			// Dashed Tear-off line
			pdf.SetDashPattern([]float64{2, 2}, 0)
			pdf.Line(140, startY, 140, startY+boxHeight)
			pdf.SetDashPattern([]float64{}, 0) // reset straight

			// Top Brand/Airline Strip
			pdf.SetFillColor(pDark[0], pDark[1], pDark[2])
			pdf.Rect(15, startY, 180, 10, "F")
			
			pdf.SetXY(18, startY+2)
			pdf.SetTextColor(255, 255, 255)
			pdf.SetFont("Arial", "B", 10)
			pdf.Cell(80, 6, fb.Flight.Airline)
			
			pdf.SetFont("Arial", "B", 9)
			pdf.SetXY(145, startY+2)
			pdf.Cell(45, 6, "BOARDING PASS")

			// Left Side Main Content
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			
			// Codes Row
			pdf.SetXY(20, startY+15)
			pdf.SetFont("Arial", "B", 24)
			pdf.Cell(40, 10, fb.Flight.DepartureAirport.Code)
			
			// Chevron / Flight Time
			pdf.SetFont("Arial", "B", 14)
			pdf.SetTextColor(pTeal[0], pTeal[1], pTeal[2])
			pdf.Cell(40, 10, ">> + >>")
			
			pdf.SetFont("Arial", "B", 24)
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.Cell(40, 10, fb.Flight.ArrivalAirport.Code)

			// Cities Row
			pdf.SetXY(20, startY+26)
			pdf.SetFont("Arial", "", 10)
			pdf.SetTextColor(pGray[0], pGray[1], pGray[2])
			pdf.Cell(40, 5, fb.Flight.DepartureAirport.City)
			pdf.SetX(100)
			pdf.Cell(40, 5, fb.Flight.ArrivalAirport.City)

			// Times Row
			pdf.SetXY(20, startY+32)
			pdf.SetFont("Arial", "B", 10)
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.Cell(40, 5, fb.Flight.DepartureTime.Format("02 Jan, 15:04"))
			pdf.SetX(100)
			pdf.Cell(40, 5, fb.Flight.ArrivalTime.Format("02 Jan, 15:04"))

			// Flight & Class
			pdf.SetXY(20, startY+45)
			pdf.SetFont("Arial", "B", 8)
			pdf.SetTextColor(pGray[0], pGray[1], pGray[2])
			pdf.Cell(40, 4, "FLIGHT")
			pdf.Cell(40, 4, "CLASS")
			pdf.Cell(40, 4, "GATE")

			pdf.SetXY(20, startY+49)
			pdf.SetFont("Arial", "B", 12)
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.Cell(40, 6, fb.Flight.FlightNumber)
			pdf.Cell(40, 6, string(fb.Class))
			pdf.Cell(40, 6, "-") // Gate usually TBD

			// Right Side (Tear-off Stub)
			stubX := 145.0
			pdf.SetXY(stubX, startY+15)
			pdf.SetFont("Arial", "B", 14)
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.Cell(0, 6, fb.Flight.DepartureAirport.Code+" - "+fb.Flight.ArrivalAirport.Code)
			
			pdf.SetXY(stubX, startY+25)
			pdf.SetFont("Arial", "B", 8)
			pdf.SetTextColor(pGray[0], pGray[1], pGray[2])
			pdf.Cell(0, 4, "DEPARTURE")
			
			pdf.SetXY(stubX, startY+29)
			pdf.SetFont("Arial", "B", 10)
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.Cell(0, 5, fb.Flight.DepartureTime.Format("15:04"))

			// Mock Barcode
			drawFakeBarcode(stubX, startY+45, 45, 12, booking.BookingCode+fb.Flight.Airline)
			pdf.SetXY(stubX, startY+58)
			pdf.SetFont("Arial", "", 8)
			pdf.Cell(45, 4, booking.BookingCode)

			pdf.SetY(startY + boxHeight + 10)

			// Passenger List
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 8, "PASSENGERS")
			pdf.Ln(6)

			// Table Header
			pdf.SetFillColor(pTeal[0], pTeal[1], pTeal[2])
			pdf.SetTextColor(255, 255, 255)
			pdf.SetFont("Arial", "B", 9)
			pdf.CellFormat(10, 8, "#", "B", 0, "C", true, 0, "")
			pdf.CellFormat(90, 8, "PASSENGER NAME", "B", 0, "L", true, 0, "")
			pdf.CellFormat(40, 8, "TYPE", "B", 0, "C", true, 0, "")
			pdf.CellFormat(40, 8, "SEAT", "B", 1, "C", true, 0, "")

			// Table Rows
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.SetFont("Arial", "", 10)
			for i, p := range booking.Passengers {
				if i%2 == 0 {
					pdf.SetFillColor(pLight[0], pLight[1], pLight[2])
				} else {
					pdf.SetFillColor(255, 255, 255)
				}
				pdf.CellFormat(10, 9, fmt.Sprintf("%d", i+1), "B", 0, "C", true, 0, "")
				pdf.CellFormat(90, 9, p.Name, "B", 0, "L", true, 0, "")
				pdf.CellFormat(40, 9, string(p.Type), "B", 0, "C", true, 0, "")
				pdf.CellFormat(40, 9, p.SeatNumber, "B", 1, "C", true, 0, "")
			}
		}
	} else if booking.Type == models.BookingTypeHotel {
		hb, ok := detail.(*models.HotelBooking)
		if ok {
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 8, "HOTEL RESERVATION DETAILS")
			pdf.Ln(8)

			// Elegant Hotel Card
			startY := pdf.GetY()
			
			pdf.SetFillColor(pLight[0], pLight[1], pLight[2])
			pdf.SetDrawColor(220, 220, 220)
			pdf.SetLineWidth(0.3)
			pdf.Rect(15, startY, 180, 70, "FD")
			
			// Hotel Name Header
			pdf.SetFillColor(pDark[0], pDark[1], pDark[2])
			pdf.Rect(15, startY, 180, 12, "F")
			pdf.SetXY(20, startY+3)
			pdf.SetTextColor(255, 255, 255)
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(0, 7, hb.RoomType.Hotel.Name)

			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.SetXY(20, startY+18)
			pdf.SetFont("Arial", "", 10)
			pdf.MultiCell(130, 5, hb.RoomType.Hotel.Address, "", "L", false)

			// Dates Grid
			pdf.SetXY(20, startY+35)
			pdf.SetFont("Arial", "B", 8)
			pdf.SetTextColor(pGray[0], pGray[1], pGray[2])
			pdf.Cell(45, 4, "CHECK-IN")
			pdf.Cell(45, 4, "CHECK-OUT")
			pdf.Cell(45, 4, "ROOM TYPE")
			pdf.Cell(45, 4, "GUESTS")

			pdf.SetXY(20, startY+40)
			pdf.SetFont("Arial", "B", 11)
			pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
			pdf.Cell(45, 6, hb.CheckIn.Format("02 Jan 2006"))
			pdf.Cell(45, 6, hb.CheckOut.Format("02 Jan 2006"))
			pdf.Cell(45, 6, hb.RoomType.Name)
			pdf.Cell(45, 6, fmt.Sprintf("%d Guests", hb.Guests))

			// Voucher Code Highlight
			pdf.SetXY(20, startY+53)
			pdf.SetFillColor(pTeal[0], pTeal[1], pTeal[2])
			pdf.SetTextColor(255, 255, 255)
			pdf.SetFont("Arial", "B", 10)
			vCode := fmt.Sprintf("VOUCHER NO: VC-%06d", booking.ID)
			pdf.CellFormat(55, 9, vCode, "", 0, "C", true, 0, "")

			drawFakeBarcode(135, startY+48, 55, 14, booking.BookingCode+"HOTEL")

			pdf.SetY(startY + 85)
		}
	}

	// --- 4. FOOTER / TERMS ---
	// Force the footer onto the exact same page regardless of passenger count limits
	pdf.SetAutoPageBreak(false, 0)
	pdf.SetY(240)

	pdf.SetDrawColor(pTeal[0], pTeal[1], pTeal[2])
	pdf.SetLineWidth(0.8)
	pdf.Line(15, pdf.GetY(), 195, pdf.GetY()) // Teal Separator Line
	
	pdf.Ln(6)
	pdf.SetFont("Arial", "B", 10)
	pdf.SetTextColor(pDark[0], pDark[1], pDark[2])
	pdf.Cell(0, 5, "Important Information:")
	
	pdf.Ln(6)
	pdf.SetFont("Arial", "", 8)
	pdf.SetTextColor(pGray[0], pGray[1], pGray[2])
	
	notes := []string{
		"1. Please present this E-Ticket and a valid Photo ID (KTP/Passport) at check-in.",
		"2. For flights: Check-in opens 2 hours before departure and closes strictly 45 minutes prior to takeoff.",
		"3. For hotels: Standard check-in time is 14:00 and check-out is 12:00 local time (subject to property policy).",
		"4. All times shown are local times at the destination.",
		"5. Need help? Contact our 24/7 Premium Support at support@batago.travel or +62 21 555-0123.",
	}
	for _, note := range notes {
		pdf.Cell(0, 5, note)
		pdf.Ln(5)
	}

	// Page Footer / Branding Note
	pdf.SetY(275)
	pdf.SetFont("Arial", "I", 8)
	pdf.SetTextColor(pTeal[0], pTeal[1], pTeal[2])
	pdf.CellFormat(0, 10, "Protected and Confirmed by BataGo Engine  \u2022  www.batago.travel", "", 0, "C", false, 0, "")

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

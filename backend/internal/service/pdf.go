package service

import (
	"bytes"
	"fmt"
	"strings"

	"github.com/jung-kurt/gofpdf/v2"
	"github.com/rifai27077/batago-backend/internal/models"
)

// GenerateTicketPDF generates a PDF for a flight ticket or hotel voucher
func GenerateTicketPDF(booking models.Booking, detail interface{}) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// Colors
	primaryBlue := []int{0, 102, 204}
	textGray := []int{80, 80, 80}
	lightBg := []int{245, 247, 250}

	// Branding Header
	pdf.SetFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
	pdf.Rect(0, 0, 210, 40, "F")
	
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Arial", "B", 28)
	pdf.Text(15, 25, "BataGo")
	
	pdf.SetFont("Arial", "", 12)
	pdf.Text(160, 25, "E-Ticket & Confirmation")

	pdf.SetY(45)
	pdf.SetX(15)

	// Booking Summary Grid
	pdf.SetFillColor(lightBg[0], lightBg[1], lightBg[2])
	pdf.Rect(10, 50, 190, 30, "F")
	
	pdf.SetTextColor(textGray[0], textGray[1], textGray[2])
	pdf.SetFont("Arial", "B", 10)
	pdf.SetXY(15, 55)
	pdf.Cell(0, 5, "BOOKING REFERENCE")
	pdf.SetXY(15, 70)
	pdf.Cell(0, 5, "BOOKING DATE")
	pdf.SetXY(140, 55)
	pdf.Cell(0, 5, "PAYMENT STATUS")

	pdf.SetTextColor(0, 0, 0)
	pdf.SetFont("Arial", "B", 16)
	pdf.SetXY(15, 60)
	pdf.Cell(0, 7, booking.BookingCode)
	
	pdf.SetFont("Arial", "", 12)
	pdf.SetXY(15, 75)
	pdf.Cell(0, 5, booking.CreatedAt.Format("02 January 2006"))
	
	pdf.SetTextColor(0, 150, 0)
	pdf.SetFont("Arial", "B", 14)
	pdf.SetXY(140, 60)
	pdf.Cell(0, 7, strings.ToUpper(string(booking.PaymentStatus)))

	pdf.Ln(25)

	if booking.Type == models.BookingTypeFlight {
		fb, ok := detail.(*models.FlightBooking)
		if ok {
			pdf.SetTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
			pdf.SetFont("Arial", "B", 16)
			pdf.Cell(0, 10, "Flight Information")
			pdf.Ln(10)

			// Flight Detail Box
			pdf.SetDrawColor(230, 230, 230)
			pdf.SetFillColor(255, 255, 255)
			pdf.Rect(10, 95, 190, 45, "DF")
			
			pdf.SetTextColor(0, 0, 0)
			pdf.SetFont("Arial", "B", 14)
			pdf.SetXY(15, 100)
			pdf.Cell(0, 7, fb.Flight.Airline)
			pdf.SetFont("Arial", "", 12)
			pdf.SetTextColor(textGray[0], textGray[1], textGray[2])
			pdf.CellFormat(0, 7, fb.Flight.FlightNumber+" | "+string(fb.Class), "", 0, "R", false, 0, "")

			pdf.Ln(12)
			pdf.SetX(15)
			
			// From -> To
			pdf.SetTextColor(0, 0, 0)
			pdf.SetFont("Arial", "B", 18)
			pdf.Cell(30, 10, fb.Flight.DepartureAirport.Code)
			pdf.SetFont("Arial", "", 12)
			pdf.Cell(60, 10, " --------------> ")
			pdf.SetFont("Arial", "B", 18)
			pdf.Cell(30, 10, fb.Flight.ArrivalAirport.Code)
			
			pdf.Ln(8)
			pdf.SetX(15)
			pdf.SetFont("Arial", "", 10)
			pdf.SetTextColor(textGray[0], textGray[1], textGray[2])
			pdf.Cell(90, 5, fb.Flight.DepartureAirport.City)
			pdf.Cell(90, 5, fb.Flight.ArrivalAirport.City)

			pdf.Ln(15)
			
			// Passenger List
			pdf.SetX(10)
			pdf.SetTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
			pdf.SetFont("Arial", "B", 16)
			pdf.Cell(0, 10, "Passenger List")
			pdf.Ln(10)

			pdf.SetTextColor(0, 0, 0)
			pdf.SetFont("Arial", "B", 11)
			pdf.SetFillColor(lightBg[0], lightBg[1], lightBg[2])
			pdf.CellFormat(80, 10, "NAME", "1", 0, "L", true, 0, "")
			pdf.CellFormat(50, 10, "TYPE", "1", 0, "C", true, 0, "")
			pdf.CellFormat(60, 10, "SEAT", "1", 1, "C", true, 0, "")

			pdf.SetFont("Arial", "", 11)
			for _, p := range booking.Passengers {
				pdf.CellFormat(80, 10, p.Name, "1", 0, "L", false, 0, "")
				pdf.CellFormat(50, 10, string(p.Type), "1", 0, "C", false, 0, "")
				pdf.CellFormat(60, 10, p.SeatNumber, "1", 1, "C", false, 0, "")
			}
		}
	} else if booking.Type == models.BookingTypeHotel {
		hb, ok := detail.(*models.HotelBooking)
		if ok {
			pdf.SetTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
			pdf.SetFont("Arial", "B", 16)
			pdf.Cell(0, 10, "Hotel Accommodation")
			pdf.Ln(10)

			// Hotel info box
			pdf.SetDrawColor(230, 230, 230)
			pdf.SetFillColor(255, 255, 255)
			pdf.Rect(10, 95, 190, 50, "DF")
			
			pdf.SetTextColor(0, 0, 0)
			pdf.SetFont("Arial", "B", 14)
			pdf.SetXY(15, 100)
			pdf.Cell(0, 7, hb.RoomType.Hotel.Name)
			
			pdf.SetXY(15, 107)
			pdf.SetFont("Arial", "", 10)
			pdf.SetTextColor(textGray[0], textGray[1], textGray[2])
			pdf.MultiCell(180, 5, hb.RoomType.Hotel.Address, "", "L", false)

			// Stay Details Grid
			pdf.SetY(122)
			pdf.SetX(15)
			pdf.SetFont("Arial", "B", 10)
			pdf.SetTextColor(textGray[0], textGray[1], textGray[2])
			pdf.Cell(60, 5, "CHECK-IN")
			pdf.Cell(60, 5, "CHECK-OUT")
			pdf.Cell(60, 5, "GUESTS/ROOM")

			pdf.SetXY(15, 127)
			pdf.SetTextColor(0, 0, 0)
			pdf.SetFont("Arial", "B", 12)
			pdf.Cell(60, 7, hb.CheckIn.Format("02 Jan 2006"))
			pdf.Cell(60, 7, hb.CheckOut.Format("02 Jan 2006"))
			pdf.Cell(60, 7, fmt.Sprintf("%d Guests | %s", hb.Guests, hb.RoomType.Name))

			pdf.Ln(25)
			pdf.SetX(15)
			pdf.SetFont("Arial", "B", 12)
			pdf.SetTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
			pdf.Cell(40, 7, "Voucher Code:")
			pdf.SetFont("Arial", "B", 14)
			
			// We might want to pass the voucher code specifically, 
			// but for now we'll use a placeholder or generic code if not provided
			pdf.Cell(0, 7, fmt.Sprintf("VC-%d", booking.ID+1000)) 
		}
	}

	pdf.SetY(260)
	pdf.SetFont("Arial", "I", 9)
	pdf.SetTextColor(128, 128, 128)
	pdf.MultiCell(0, 4, "Important Notes:\n- For flights, please arrive at the airport at least 2-3 hours before departure.\n- Present a valid ID card or Passport alongside this e-ticket/voucher.\n- For support, contact support@batago.travel", "", "C", false)

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

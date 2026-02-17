"use client";

import { useState } from "react";
import BookingCard from "./BookingCard";
import { Plane, Bed, Filter, FileText } from "lucide-react";

// Mock Data
const MOCK_BOOKINGS = [
  {
    id: "B-12345",
    type: "flight",
    status: "upcoming",
    date: "12 Aug, 2026",
    price: "IDR 1.250.000",
    details: {
      title: "Jakarta (CGK) → Bali (DPS)",
      subtitle: "One-way flight",
      image: "https://images.unsplash.com/photo-1542296332-2e44a996aa0a?q=80&w=300&auto=format&fit=crop",
      description: "Flight to Bali",
      airline: "Garuda Indonesia",
      flightNumber: "GA 404",
      departureTime: "08:00 AM",
      arrivalTime: "10:50 AM",
      duration: "1h 50m",
    },
  },
  {
    id: "B-67890",
    type: "hotel",
    status: "upcoming",
    date: "15 Aug - 18 Aug, 2026",
    price: "IDR 4.500.000",
    details: {
      title: "The Ritz-Carlton Bali",
      subtitle: "Nusa Dua, Bali",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop",
      description: "Luxury stay in Bali",
      checkIn: "Sun, 15 Aug",
      checkOut: "Wed, 18 Aug",
      guests: "2 Guests",
      rooms: "1 Room",
    },
  },
  {
    id: "B-11223",
    type: "flight",
    status: "completed",
    date: "10 Jan, 2026",
    price: "IDR 950.000",
    details: {
      title: "Surabaya (SUB) → Jakarta (CGK)",
      subtitle: "One-way flight",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=300&auto=format&fit=crop",
      description: "Flight to Jakarta",
      airline: "Lion Air",
      flightNumber: "JT 690",
      departureTime: "06:00 AM",
      arrivalTime: "07:30 AM",
      duration: "1h 30m",
    },
  },
] as const;

type FilterType = "all" | "flight" | "hotel";

export default function BookingList() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    if (filter === "all") return true;
    return booking.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            filter === "all"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          All Bookings
        </button>
        <div className="w-px h-6 bg-gray-200" />
        <button
          onClick={() => setFilter("flight")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            filter === "flight"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:bg-gray-50"
          }`}
        >
          <Plane className="w-4 h-4" />
          Flights
        </button>
        <button
          onClick={() => setFilter("hotel")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            filter === "hotel"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:bg-gray-50"
          }`}
        >
          <Bed className="w-4 h-4" />
          Stays
        </button>
      </div>

      {/* Booking List */}
      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            //@ts-ignore - Mock data typing is simplified
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
            <p className="text-muted">You haven't made any bookings in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import { Plane, Bed, Filter, FileText, Loader2, Search, SortAsc } from "lucide-react";
import { getMyBookings, getToken } from "@/lib/api";

// Fallback mock data for when not logged in or API is unavailable
const MOCK_BOOKINGS = [
  {
    id: "B-12345",
    type: "flight" as const,
    status: "upcoming" as const,
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
    type: "hotel" as const,
    status: "upcoming" as const,
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
    type: "flight" as const,
    status: "completed" as const,
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
];

type FilterType = "all" | "flight" | "hotel";

interface BookingItem {
  id: string;
  internalID: number;
  type: "flight" | "hotel";
  status: "upcoming" | "completed" | "cancelled";
  paymentStatus: string;
  date: string;
  price: string;
  details: {
    title: string;
    subtitle: string;
    image: string;
    description: string;
    airline?: string;
    flightNumber?: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    rooms?: string;
  };
}

export default function BookingList() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "amount">("latest");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadBookings() {
      const token = getToken();
      if (!token) {
        setIsLoggedIn(false);
        setBookings([]);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);
      try {
        const res = await getMyBookings(filter === "all" ? undefined : filter);
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((b: any) => ({
            id: b.booking_code || String(b.ID),
            internalID: b.ID,
            type: b.type as "flight" | "hotel",
            status: (b.booking_status === "COMPLETED" || b.booking_status === "completed" ? "completed" : b.booking_status === "CANCELLED" || b.booking_status === "cancelled" ? "cancelled" : "upcoming") as "upcoming" | "completed" | "cancelled",
            paymentStatus: b.payment_status,
            date: new Date(b.CreatedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
            price: `IDR ${b.total_amount.toLocaleString("id-ID")}`,
            details: {
              title: b.partner?.company_name || (b.type === "flight" ? "Flight Booking" : "Hotel Booking"),
              subtitle: b.booking_code,
              image: "",
              description: `Booking ${b.booking_code}`,
            },
          }));
          setBookings(mapped);
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, [filter]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.type === filter;
    const matchesSearch = 
      booking.details.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.details.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === "amount") {
        const amtA = parseInt(a.price.replace(/[^\d]/g, "")) || 0;
        const amtB = parseInt(b.price.replace(/[^\d]/g, "")) || 0;
        return amtB - amtA;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Login notice */}
      {!isLoggedIn && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
          You are not logged in. Showing sample bookings. <a href="/login" className="underline font-semibold">Login</a> to see your real bookings.
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-full md:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ${
                filter === "all"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              All
            </button>
            <div className="w-px h-6 bg-gray-200 shrink-0" />
            <button
              onClick={() => setFilter("flight")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ${
                filter === "hotel"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted hover:bg-gray-50"
              }`}
            >
              <Bed className="w-4 h-4" />
              Stays
            </button>

            <div className="w-px h-6 bg-gray-200 shrink-0 ml-1" />
            <div className="flex items-center gap-2 px-2 shrink-0">
                <SortAsc className="w-4 h-4 text-gray-400" />
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 cursor-pointer hover:text-primary transition-colors focus:ring-0"
                >
                    <option value="latest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="amount">Amount</option>
                </select>
            </div>
          </div>

          <div className="relative group flex-1 md:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search by code or name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
              />
          </div>
      </div>

      {/* Booking List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sortedBookings.length > 0 ? (
          sortedBookings.map((booking) => (
            //@ts-ignore - Simplified typing for flexibility
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 md:p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
                {searchQuery ? "No results found" : "No bookings yet"}
            </h3>
            <p className="text-muted mb-10 max-w-sm mx-auto">
                {searchQuery ? `We couldn't find any bookings matching "${searchQuery}".` : "You haven't made any bookings yet. Start planning your next adventure today!"}
            </p>
            
            {!searchQuery && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="/flights" className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm">
                        Find Flights
                    </a>
                    <a href="/stays" className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 text-foreground font-bold rounded-xl hover:bg-gray-200 transition-all text-sm">
                        Find Hotels
                    </a>
                </div>
            )}
            
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery("")}
                    className="text-primary font-bold hover:underline"
                >
                    Clear Search
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

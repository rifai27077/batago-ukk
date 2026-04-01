"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Download, Eye, Filter, Plane, Building2 } from "lucide-react";
import { useDateRange } from "@/components/partner/dashboard/DateRangeContext";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import StatusBadge from "@/components/partner/dashboard/StatusBadge";
import type { StatusType } from "@/components/partner/dashboard/StatusBadge";
import Pagination from "@/components/partner/dashboard/Pagination";
import { getPartnerBookings } from "@/lib/api";

interface BaseBookingItem {
  id: string;
  amount: string;
  status: StatusType;
  createdAt: string;
}

interface HotelBookingItem extends BaseBookingItem {
  type: "hotel";
  guest: string;
  property: string;
  checkIn: string;
  checkOut: string;
}

interface AirlineBookingItem extends BaseBookingItem {
  type: "airline";
  passenger: string;
  flightNumber: string;
  route: string;
  date: string;
  seatClass: string;
}

type BookingItem = HotelBookingItem | AirlineBookingItem;



const tabs = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export default function BookingsPage() {
  const { dateRange } = useDateRange();
  const { partnerType } = usePartner();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from API
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await getPartnerBookings({ page: 1, limit: 100 });
        if (res.data && res.data.length > 0) {
          const mapped: BookingItem[] = res.data.map((b) => {
            const statusMap: Record<string, StatusType> = {
              NEW: "pending",
              CONFIRMED: "confirmed",
              CHECKED_IN: "confirmed",
              COMPLETED: "completed",
              CANCELLED: "cancelled",
            };
            const createdDate = new Date(b.CreatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
            if (b.type === "flight") {
              const f = b.flight_booking;
              let route = "-";
              let flightNumber = b.booking_code;
              let dateStr = createdDate;
              let classStr = "Economy";
              
              if (f && f.flight) {
                 route = `${f.flight.departure_airport?.code || '?'} - ${f.flight.arrival_airport?.code || '?'}`;
                 flightNumber = f.flight.flight_number || flightNumber;
                 if (f.flight.departure_time) {
                    dateStr = new Date(f.flight.departure_time).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                 }
                 classStr = f.class || classStr;
              }

              return {
                id: b.booking_code,
                type: "airline" as const,
                passenger: b.user?.name || "Guest",
                flightNumber,
                route,
                date: dateStr,
                seatClass: classStr,
                status: statusMap[b.booking_status] || "pending",
                amount: `Rp ${b.total_amount.toLocaleString("id-ID")}`,
                createdAt: createdDate,
              };
            }
            
            const h = b.hotel_booking;
            let propertyName = "-";
            let checkInStr = createdDate;
            let checkOutStr = "-";

            if (h) {
               propertyName = h.room_type?.hotel?.name || "-";
               if (h.check_in) checkInStr = new Date(h.check_in).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
               if (h.check_out) checkOutStr = new Date(h.check_out).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
            }

            return {
              id: b.booking_code,
              type: "hotel" as const,
              guest: b.user?.name || "Guest",
              property: propertyName,
              checkIn: checkInStr,
              checkOut: checkOutStr,
              status: statusMap[b.booking_status] || "pending",
              amount: `Rp ${b.total_amount.toLocaleString("id-ID")}`,
              createdAt: createdDate,
            };
          });
          setBookings(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const rawData = bookings;

  const filtered = useMemo(() => {
    return rawData.filter((b) => {
      // Search Logic
      const searchTerm = search.toLowerCase();
      let matchSearch = false;
      if (b.type === "hotel") {
        matchSearch = b.guest.toLowerCase().includes(searchTerm) || b.id.toLowerCase().includes(searchTerm);
      } else {
        matchSearch = b.passenger.toLowerCase().includes(searchTerm) || b.id.toLowerCase().includes(searchTerm) || b.flightNumber.toLowerCase().includes(searchTerm);
      }

      // Date Range Logic
      let itemDate: Date | null = null;
      const year = new Date().getFullYear();

      if (b.type === "hotel") {
        const checkInParts = b.checkIn.split(" ");
        const day = parseInt(checkInParts[0]);
        const monthStr = checkInParts[1];
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(monthStr);
        if (monthIndex >= 0) itemDate = new Date(year, monthIndex, day);
      } else {
        // e.g., "16 Feb 2026"
        itemDate = new Date(b.date);
      }

      const inDateRange = 
        !itemDate ||
        ((!dateRange.from || itemDate >= dateRange.from) &&
        (!dateRange.to || itemDate <= dateRange.to));

      if (!inDateRange) return false;

      // Tab Logic
      if (activeTab === "all") return matchSearch;
      if (activeTab === "today") return matchSearch && b.status === "confirmed"; // Simplified mock logic
      if (activeTab === "upcoming") return matchSearch && (b.status === "confirmed" || b.status === "pending");
      return matchSearch && b.status === activeTab;
    });
  }, [activeTab, search, dateRange, rawData]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {partnerType === "hotel" ? "Bookings" : "Passenger List"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {filtered.length} total {partnerType === "hotel" ? "bookings" : "passengers"} found
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm border border-gray-100 dark:border-slate-700">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tabs */}
          <div className="flex overflow-x-auto bg-gray-100 dark:bg-slate-900 rounded-xl p-1 shrink-0 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.value
                    ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl px-3 py-2.5 gap-2 flex-1 border border-gray-100 dark:border-slate-800 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={partnerType === "hotel" ? "Search by guest name or booking ID..." : "Search by passenger, flight, or PNR..."}
              value={search}
              onChange={handleSearchChange}
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 w-full"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {paginatedData.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Booking ID</th>
                  {partnerType === "hotel" ? (
                    <>
                      <th className="text-left px-5 py-3 font-semibold">Guest</th>
                      <th className="text-left px-5 py-3 font-semibold">Room</th>
                      <th className="text-left px-5 py-3 font-semibold">Check-in</th>
                      <th className="text-left px-5 py-3 font-semibold">Check-out</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left px-5 py-3 font-semibold">Passenger</th>
                      <th className="text-left px-5 py-3 font-semibold">Flight Info</th>
                      <th className="text-left px-5 py-3 font-semibold">Date</th>
                      <th className="text-left px-5 py-3 font-semibold">Seat</th>
                    </>
                  )}
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                  <th className="text-center px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {paginatedData.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-slate-400">#{booking.id}</td>
                    
                    {booking.type === "hotel" ? (
                      <>
                        <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{booking.guest}</td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.property}</td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.checkIn}</td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.checkOut}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{booking.passenger}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 dark:text-slate-200">{booking.flightNumber}</span>
                            <span className="text-xs text-gray-500">{booking.route}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.date}</td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.seatClass}</td>
                      </>
                    )}

                    <td className="px-5 py-3.5"><StatusBadge status={booking.status} /></td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800 dark:text-slate-200">{booking.amount}</td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        href={`/partner/dashboard/bookings/${booking.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-700">
            {paginatedData.map((booking) => (
              <Link
                href={`/partner/dashboard/bookings/${booking.id}`}
                key={booking.id}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {booking.type === "hotel" ? (
                    <>
                      <p className="font-semibold text-gray-800 dark:text-slate-200 text-sm truncate">{booking.guest}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{booking.property} · {booking.checkIn} — {booking.checkOut}</p>
                    </>
                  ) : (
                    <>
                       <p className="font-semibold text-gray-800 dark:text-slate-200 text-sm truncate">{booking.passenger}</p>
                       <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{booking.flightNumber} · {booking.route} · {booking.date}</p>
                    </>
                  )}
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">#{booking.id}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="font-semibold text-sm text-gray-800 dark:text-slate-200">{booking.amount}</p>
                  <StatusBadge status={booking.status} className="mt-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Filter className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No bookings found</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}

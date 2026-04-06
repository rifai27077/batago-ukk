"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Moon, CreditCard, MessageSquare, Ban, CheckCircle2, Printer, RefreshCw, Loader2, Plane } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { StatusType } from "./StatusBadge";
import { getPartnerBookings, updatePartnerBookingStatus } from "@/lib/api";

interface BookingDetailData {
  id: string;
  status: StatusType;
  type: "hotel" | "airline";
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  property: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  specialRequest: string;
  // Airline fields
  flightNumber?: string;
  route?: string;
  seatClass?: string;
  payment: {
    method: string;
    total: string;
    breakdown: { label: string; amount: string }[];
  };
  createdAt: string;
}

interface BookingDetailProps {
  bookingId?: string;
}

export default function BookingDetail({ bookingId }: BookingDetailProps) {
  const [booking, setBooking] = useState<BookingDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchBooking = useCallback(async () => {
    if (!bookingId) {
      setError("No booking ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch from partner bookings and find the matching one
      const res = await getPartnerBookings({ page: 1, limit: 100 });
      const found = res.data?.find((b) => b.booking_code === bookingId);

      if (!found) {
        setError("Booking not found");
        return;
      }

      const statusMap: Record<string, StatusType> = {
        NEW: "pending",
        CONFIRMED: "confirmed",
        CHECKED_IN: "confirmed",
        COMPLETED: "completed",
        CANCELLED: "cancelled",
        REFUNDED: "refunded",
      };

      const isHotel = found.type === "hotel";
      const h = found.hotel_booking;
      const f = found.flight_booking;

      const totalAmount = found.total_amount || 0;
      const commission = Math.round(totalAmount * 0.1);
      const net = totalAmount - commission;

      const fmt = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;

      let nights = 0;
      let checkInStr = "-";
      let checkOutStr = "-";

      if (isHotel && h) {
        if (h.check_in && h.check_out) {
          checkInStr = new Date(h.check_in).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
          checkOutStr = new Date(h.check_out).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
          nights = Math.ceil((new Date(h.check_out).getTime() - new Date(h.check_in).getTime()) / (1000 * 60 * 60 * 24));
        }
      }

      const data: BookingDetailData = {
        id: found.booking_code,
        status: statusMap[found.booking_status] || "pending",
        type: isHotel ? "hotel" : "airline",
        guest: {
          name: found.user?.name || "Guest",
          email: found.user?.email || "-",
          phone: "-",
        },
        property: isHotel ? (h?.room_type?.hotel?.name || "-") : (f?.flight?.departure_airport?.code && f?.flight?.arrival_airport?.code ? `${f.flight.departure_airport.code} → ${f.flight.arrival_airport.code}` : "-"),
        roomType: isHotel ? (h?.room_type?.name || "-") : (f?.class || "Economy"),
        checkIn: checkInStr,
        checkOut: checkOutStr,
        nights,
        guests: 1,
        specialRequest: "",
        flightNumber: f?.flight?.flight_number,
        route: f?.flight?.departure_airport?.code && f?.flight?.arrival_airport?.code ? `${f.flight.departure_airport.code} - ${f.flight.arrival_airport.code}` : undefined,
        seatClass: f?.class,
        payment: {
          method: found.payment_status === "PAID" ? "Online Payment" : "Pending",
          total: fmt(totalAmount),
          breakdown: [
            { label: isHotel ? `${h?.room_type?.name || "Room"} × ${nights} night${nights > 1 ? "s" : ""}` : `${f?.flight?.flight_number || "Flight"} - ${f?.class || "Economy"}`, amount: fmt(totalAmount) },
            { label: "Tax & Service (included)", amount: "Rp 0" },
            { label: "Platform Commission (10%)", amount: `-${fmt(commission)}` },
            { label: "Net Revenue", amount: fmt(net) },
          ],
        },
        createdAt: new Date(found.CreatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      };

      setBooking(data);
    } catch (err: any) {
      console.error("Failed to fetch booking", err);
      setError(err.message || "Failed to load booking");
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleUpdateStatus = async (status: string) => {
    if (!bookingId || !confirm(`Are you sure you want to change status to ${status}?`)) return;
    try {
      setUpdating(true);
      await updatePartnerBookingStatus(bookingId, status);
      await fetchBooking();
    } catch (err: any) {
      alert(err.message || "Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-500 dark:text-slate-400">Loading booking details...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <Link href="/partner/dashboard/bookings" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </Link>
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center">
          <p className="text-lg font-semibold">{error || "Booking not found"}</p>
          <p className="text-sm mt-1">Please check the booking ID and try again.</p>
        </div>
      </div>
    );
  }

  const isAirline = booking.type === "airline";

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/partner/dashboard/bookings"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">#{booking.id}</h1>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Created {booking.createdAt}</p>
          </div>
        </div>
        <div className="flex gap-2 ml-11 sm:ml-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl transition-colors border border-gray-200 dark:border-slate-700">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 text-primary rounded-xl transition-colors border border-primary/10 dark:border-primary/20">
            <MessageSquare className="w-4 h-4" /> Message Guest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Guest Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              {isAirline ? "Passenger Information" : "Guest Information"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Full Name</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.guest.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.guest.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stay / Flight Details */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              {isAirline ? "Flight Details" : "Stay Details"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {isAirline ? (
                <>
                  <div className="flex items-start gap-3">
                    <Plane className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Flight</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.flightNumber || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Route</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.route || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Class</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.seatClass || "-"}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Check-in</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.checkIn}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Check-out</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.checkOut}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Moon className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Duration</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.nights} Nights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Guests</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.guests} Adults</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isAirline && (
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Property & Room</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.property}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{booking.roomType}</p>
                  </div>
                </div>
              </div>
            )}

            {booking.specialRequest && (
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">Special Request</p>
                <p className="text-sm text-gray-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl px-4 py-3 border border-amber-100 dark:border-amber-500/20">
                  {booking.specialRequest}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Payment + Actions */}
        <div className="space-y-5">
          {/* Payment */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Payment</h2>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              <span className="text-sm text-gray-600 dark:text-slate-300">{booking.payment.method}</span>
            </div>
            <div className="space-y-2.5">
              {booking.payment.breakdown.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between text-sm ${
                    i === booking.payment.breakdown.length - 1 
                      ? "pt-2.5 border-t border-gray-100 dark:border-slate-700 font-bold text-gray-900 dark:text-white" 
                      : "text-gray-600 dark:text-slate-400"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={item.amount.startsWith("-") ? "text-red-500" : ""}>{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Actions</h2>
            <div className="space-y-2">
              <button 
                disabled={updating || booking.status === "completed" || booking.status === "cancelled"}
                onClick={() => handleUpdateStatus("COMPLETED")}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark as Completed
              </button>
              <button 
                disabled={updating || booking.status === "refunded" || booking.payment.method === "Pay at Hotel"}
                onClick={() => handleUpdateStatus("REFUNDED")}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-slate-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 font-medium py-2.5 rounded-xl transition-colors text-sm border border-gray-200 dark:border-slate-600"
              >
                <RefreshCw className="w-4 h-4" /> Issue Refund
              </button>
              <button 
                disabled={updating || booking.status === "cancelled" || booking.status === "completed"}
                onClick={() => handleUpdateStatus("CANCELLED")}
                className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 disabled:opacity-50 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 font-medium py-2.5 rounded-xl transition-colors text-sm border border-red-100 dark:border-red-500/20"
              >
                <Ban className="w-4 h-4" /> Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

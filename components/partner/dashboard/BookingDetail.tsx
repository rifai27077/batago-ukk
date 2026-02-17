"use client";

import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Moon, CreditCard, MessageSquare, Ban, CheckCircle2, Printer, RefreshCw } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { StatusType } from "./StatusBadge";

interface BookingDetailData {
  id: string;
  status: StatusType;
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
  payment: {
    method: string;
    total: string;
    breakdown: { label: string; amount: string }[];
  };
  createdAt: string;
}

const mockBooking: BookingDetailData = {
  id: "BG-240216-001",
  status: "confirmed",
  guest: {
    name: "Ahmad Rifai",
    email: "ahmad.rifai@email.com",
    phone: "+62 812 3456 7890",
  },
  property: "Hotel Santika Premiere Batam",
  roomType: "Deluxe Room",
  checkIn: "16 Februari 2026",
  checkOut: "18 Februari 2026",
  nights: 2,
  guests: 2,
  specialRequest: "Late check-in sekitar jam 11 malam. Tolong siapkan extra pillow.",
  payment: {
    method: "BCA Virtual Account",
    total: "Rp 1.700.000",
    breakdown: [
      { label: "Deluxe Room × 2 nights", amount: "Rp 1.700.000" },
      { label: "Tax & Service (included)", amount: "Rp 0" },
      { label: "Platform Commission (10%)", amount: "-Rp 170.000" },
      { label: "Net Revenue", amount: "Rp 1.530.000" },
    ],
  },
  createdAt: "14 Februari 2026, 15:30 WIB",
};

interface BookingDetailProps {
  bookingId?: string;
}

export default function BookingDetail({ bookingId }: BookingDetailProps) {
  const booking = mockBooking; // In real app, fetch by bookingId

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
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Guest Information</h2>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{booking.guest.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Stay Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            </div>

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
              <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" /> Mark as Completed
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 font-medium py-2.5 rounded-xl transition-colors text-sm border border-gray-200 dark:border-slate-600">
                <RefreshCw className="w-4 h-4" /> Issue Refund
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 font-medium py-2.5 rounded-xl transition-colors text-sm border border-red-100 dark:border-red-500/20">
                <Ban className="w-4 h-4" /> Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

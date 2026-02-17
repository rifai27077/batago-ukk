"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, CreditCard, Ban, CheckCircle2, Building2, Plane, Eye } from "lucide-react";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "suspended";
  joined: string;
  totalBookings: number;
  totalSpent: string;
  loyaltyPoints: number;
}

interface BookingHistory {
  id: string;
  type: "hotel" | "flight";
  partner: string;
  date: string;
  amount: string;
  status: "confirmed" | "completed" | "cancelled";
}

const mockUser: UserDetail = {
  id: "USR-001",
  name: "Ahmad Rifai",
  email: "ahmad.rifai@email.com",
  phone: "+62 812 3456 7890",
  address: "Batam Centre, Kepulauan Riau",
  status: "active",
  joined: "12 Januari 2025",
  totalBookings: 15,
  totalSpent: "Rp 24.500.000",
  loyaltyPoints: 2450,
};

const mockBookingHistory: BookingHistory[] = [
  { id: "BG-240217-001", type: "hotel", partner: "Hotel Santika Batam", date: "17 Feb 2026", amount: "Rp 1.700.000", status: "confirmed" },
  { id: "BG-240210-012", type: "flight", partner: "Citilink", date: "10 Feb 2026", amount: "Rp 890.000", status: "completed" },
  { id: "BG-240205-008", type: "hotel", partner: "Swiss-Belhotel", date: "5 Feb 2026", amount: "Rp 2.400.000", status: "completed" },
  { id: "BG-240128-003", type: "flight", partner: "Batik Air", date: "28 Jan 2026", amount: "Rp 1.200.000", status: "completed" },
  { id: "BG-240115-019", type: "hotel", partner: "Harris Hotel", date: "15 Jan 2026", amount: "Rp 950.000", status: "cancelled" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  suspended: "bg-red-50 dark:bg-red-500/10 text-red-500",
};

const bookingStatusColors: Record<string, string> = {
  confirmed: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cancelled: "bg-red-50 dark:bg-red-500/10 text-red-500",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const user = mockUser; // In real app, fetch by id

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/users" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[user.status]}`}>
                {user.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">User ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2 ml-11 sm:ml-0">
          {user.status === "active" ? (
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-100 dark:border-red-500/20">
              <Ban className="w-4 h-4" /> Suspend User
            </button>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors border border-emerald-100 dark:border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" /> Activate User
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Full Name</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Address</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Booking History</h2>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{mockBookingHistory.length} bookings found</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">ID</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Type</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Partner</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Date</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Amount</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookingHistory.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-gray-600 dark:text-slate-300">{b.id}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${b.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"}`}>
                          {b.type === "hotel" ? <Building2 className="w-3 h-3 inline mr-1" /> : <Plane className="w-3 h-3 inline mr-1" />}
                          {b.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden md:table-cell">{b.partner}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden md:table-cell">{b.date}</td>
                      <td className="px-5 py-3 font-semibold text-gray-800 dark:text-slate-200">{b.amount}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${bookingStatusColors[b.status]}`}>{b.status}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/admin/bookings/${b.id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors inline-flex">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Account Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Account Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400">Member since</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.joined}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400">Total Spent</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.totalSpent}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400">Total Bookings</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400">Loyalty Points</span>
                </div>
                <span className="text-sm font-semibold text-primary">{user.loyaltyPoints.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 text-primary font-medium py-2.5 rounded-xl transition-colors text-sm border border-primary/10 dark:border-primary/20">
                <Mail className="w-4 h-4" /> Send Email
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 font-medium py-2.5 rounded-xl transition-colors text-sm border border-gray-200 dark:border-slate-600">
                <Shield className="w-4 h-4" /> Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Star, DollarSign, TrendingUp, FileCheck, Ban, CheckCircle2, Eye, Plane } from "lucide-react";

interface PartnerDetail {
  id: string;
  name: string;
  type: "hotel" | "airline";
  status: "active" | "pending" | "suspended";
  email: string;
  phone: string;
  address: string;
  commission: string;
  joined: string;
  totalRevenue: string;
  totalBookings: number;
  rating: number;
  documents: { name: string; status: "verified" | "pending" | "rejected" }[];
}

interface RecentBooking {
  id: string;
  guest: string;
  date: string;
  amount: string;
  status: "confirmed" | "completed" | "cancelled";
}

const mockPartner: PartnerDetail = {
  id: "PTR-001",
  name: "Hotel Santika Premiere Batam",
  type: "hotel",
  status: "active",
  email: "gm@santika-batam.com",
  phone: "+62 778 123 456",
  address: "Jl. Imam Bonjol No.1, Nagoya, Batam",
  commission: "10%",
  joined: "15 Januari 2025",
  totalRevenue: "Rp 125.000.000",
  totalBookings: 342,
  rating: 4.6,
  documents: [
    { name: "Business License (SIUP)", status: "verified" },
    { name: "Tax ID (NPWP)", status: "verified" },
    { name: "Hotel Star Certificate", status: "verified" },
    { name: "Fire Safety Permit", status: "pending" },
  ],
};

const mockRecentBookings: RecentBooking[] = [
  { id: "BG-240217-001", guest: "Ahmad Rifai", date: "17 Feb 2026", amount: "Rp 1.700.000", status: "confirmed" },
  { id: "BG-240216-003", guest: "Budi Santoso", date: "16 Feb 2026", amount: "Rp 2.400.000", status: "confirmed" },
  { id: "BG-240215-005", guest: "Rudi Hartono", date: "15 Feb 2026", amount: "Rp 950.000", status: "completed" },
  { id: "BG-240212-011", guest: "Maya Sari", date: "12 Feb 2026", amount: "Rp 1.500.000", status: "completed" },
  { id: "BG-240210-018", guest: "Dewi Lestari", date: "10 Feb 2026", amount: "Rp 3.100.000", status: "cancelled" },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Active" },
  pending: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  suspended: { color: "bg-red-50 dark:bg-red-500/10 text-red-500", label: "Suspended" },
};

const bookingStatusColors: Record<string, string> = {
  confirmed: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cancelled: "bg-red-50 dark:bg-red-500/10 text-red-500",
};

const docStatusColors: Record<string, string> = {
  verified: "text-emerald-500",
  pending: "text-amber-500",
  rejected: "text-red-500",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const partner = mockPartner; // In real app, fetch by id

  const TypeIcon = partner.type === "hotel" ? Building2 : Plane;
  const typeColor = partner.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500" : "bg-violet-50 dark:bg-violet-500/10 text-violet-500";

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/partners" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${typeColor}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{partner.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[partner.status].color}`}>
                  {statusConfig[partner.status].label}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Partner ID: {id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-11 sm:ml-0">
          {partner.status === "pending" && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-100 dark:border-red-500/20">
                <Ban className="w-4 h-4" /> Reject
              </button>
            </>
          )}
          {partner.status === "active" && (
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-100 dark:border-red-500/20">
              <Ban className="w-4 h-4" /> Suspend Partner
            </button>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: partner.totalRevenue, icon: DollarSign, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Total Bookings", value: partner.totalBookings.toString(), icon: TrendingUp, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
          { label: "Commission Rate", value: partner.commission, icon: DollarSign, color: "text-primary bg-primary/10" },
          { label: "Rating", value: `${partner.rating} / 5.0`, icon: Star, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} mb-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{partner.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{partner.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Address</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{partner.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
              <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View all →</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">ID</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Guest</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Date</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Amount</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-gray-600 dark:text-slate-300">{b.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-slate-200">{b.guest}</td>
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
          {/* Account Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Account Info</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400">Joined</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{partner.joined}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400">Type</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${partner.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"}`}>{partner.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-500 dark:text-slate-400">Commission</span>
                </div>
                <span className="text-sm font-semibold text-primary">{partner.commission}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Documents</h2>
            <div className="space-y-2.5">
              {partner.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className={`w-4 h-4 ${docStatusColors[doc.status]}`} />
                    <span className="text-sm text-gray-700 dark:text-slate-300">{doc.name}</span>
                  </div>
                  <span className={`text-[10px] font-medium capitalize ${docStatusColors[doc.status]}`}>{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

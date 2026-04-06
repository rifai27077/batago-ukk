"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Star, DollarSign, TrendingUp, Ban, CheckCircle2, Eye, Plane, Loader2 } from "lucide-react";
import { getAdminPartnerDetail, updatePartnerStatus } from "@/lib/api";
import { formatRp } from "@/lib/utils";

interface PartnerDetail {
  id: number;
  name: string;
  type: string;
  status: string;
  email: string;
  phone: string;
  address: string;
  commission: string;
  joined: string;
  total_revenue: number;
  total_bookings: number;
  rating: number;
}

interface RecentBooking {
  id: string;
  guest: string;
  date: string;
  amount: number;
  status: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Active" },
  approved: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Active" },
  pending: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  suspended: { color: "bg-red-50 dark:bg-red-500/10 text-red-500", label: "Suspended" },
  rejected: { color: "bg-red-50 dark:bg-red-500/10 text-red-500", label: "Rejected" },
};

const bookingStatusColors: Record<string, string> = {
  confirmed: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cancelled: "bg-red-50 dark:bg-red-500/10 text-red-500",
  new: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getAdminPartnerDetail(id);
        setPartner(res.data);
        setRecentBookings(res.recent_bookings || []);
      } catch (err: any) {
        setError(err.message || "Failed to load partner detail");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAction = async (action: string) => {
    if (!partner) return;
    try {
      setActionLoading(true);
      await updatePartnerStatus(partner.id, action);
      // Refresh data
      const res = await getAdminPartnerDetail(id);
      setPartner(res.data);
    } catch (err: any) {
      alert(err.message || "Failed to update partner");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <p className="text-red-500 text-sm">{error || "Partner not found"}</p>
        <Link href="/admin/partners" className="text-sm text-primary hover:underline">← Back to Partners</Link>
      </div>
    );
  }

  const TypeIcon = partner.type === "hotel" ? Building2 : Plane;
  const typeColor = partner.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500" : "bg-violet-50 dark:bg-violet-500/10 text-violet-500";
  const statusCfg = statusConfig[partner.status] || statusConfig.pending;

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
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Partner ID: {partner.id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-11 sm:ml-0">
          {partner.status === "pending" && (
            <>
              <button
                onClick={() => handleAction("approve")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> {actionLoading ? "..." : "Approve"}
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-100 dark:border-red-500/20 disabled:opacity-50"
              >
                <Ban className="w-4 h-4" /> Reject
              </button>
            </>
          )}
          {(partner.status === "active" || partner.status === "approved") && (
            <button
              onClick={() => handleAction("suspend")}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-100 dark:border-red-500/20 disabled:opacity-50"
            >
              <Ban className="w-4 h-4" /> {actionLoading ? "..." : "Suspend Partner"}
            </button>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatRp(partner.total_revenue), icon: DollarSign, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Total Bookings", value: partner.total_bookings.toString(), icon: TrendingUp, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
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
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{partner.phone || "—"}</p>
                </div>
              </div>
              {partner.address && (
                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Address</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{partner.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
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
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No bookings yet</td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-gray-600 dark:text-slate-300">{b.id}</td>
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-slate-200">{b.guest}</td>
                        <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden md:table-cell">{b.date}</td>
                        <td className="px-5 py-3 font-semibold text-gray-800 dark:text-slate-200">{formatRp(b.amount)}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${bookingStatusColors[b.status] || bookingStatusColors.new}`}>{b.status === "new" ? "pending" : b.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Link href={`/admin/bookings/${b.id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors inline-flex">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
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
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Eye, Building2, Plane, Loader2 } from "lucide-react";
import Pagination from "@/components/partner/dashboard/Pagination";
import { getAdminBookings } from "@/lib/api";
import { formatRp } from "@/lib/utils";

interface Booking {
  id: number;
  booking_code: string;
  guest: string;
  partner: string;
  type: string;
  amount: number;
  commission: number;
  status: string;
  date: string;
}



const statusConfig: Record<string, { color: string; label: string }> = {
  confirmed: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Confirmed" },
  new: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  pending: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  cancelled: { color: "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400", label: "Cancelled" },
  completed: { color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", label: "Completed" },
  refunded: { color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", label: "Refunded" },
  disputed: { color: "bg-red-50 dark:bg-red-500/10 text-red-500", label: "Disputed" },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [summary, setSummary] = useState({ confirmed: 0, pending: 0, cancelled: 0, refunded: 0, disputed: 0 });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminBookings({
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });
      setBookings(res.data || []);
      setTotalItems(res.meta.total);
      setSummary(res.summary);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, typeFilter, currentPage, itemsPerPage]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const totalAll = summary.confirmed + summary.pending + summary.cancelled + summary.refunded + summary.disputed;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Oversight</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Monitor all transactions across the platform</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: totalItems || totalAll, color: "text-gray-600 dark:text-slate-300" },
          { label: "Confirmed", value: summary.confirmed, color: "text-emerald-500" },
          { label: "Pending", value: summary.pending, color: "text-amber-500" },
          { label: "Cancelled", value: summary.cancelled, color: "text-gray-500" },
          { label: "Refunded", value: summary.refunded, color: "text-blue-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-100 dark:border-slate-700 shadow-sm text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by ID or guest name..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-slate-800">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="new">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700">
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-slate-800">
              <option value="all">All Types</option>
              <option value="hotel">Hotel</option>
              <option value="flight">Flight</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Booking ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Guest</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Partner</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden lg:table-cell">Commission</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const cfg = statusConfig[b.status] || statusConfig.pending;
                  return (
                    <tr key={b.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-600 dark:text-slate-300">{b.booking_code}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-slate-200">{b.guest}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {b.type === "hotel" ? <Building2 className="w-3.5 h-3.5 text-blue-400" /> : <Plane className="w-3.5 h-3.5 text-violet-400" />}
                          {b.partner}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${b.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"}`}>{b.type}</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{formatRp(b.amount)}</td>
                      <td className="px-5 py-3.5 text-emerald-500 font-medium hidden lg:table-cell">{formatRp(b.commission)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/bookings/${b.booking_code}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {bookings.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400 dark:text-slate-500">No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }} />
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Eye, RefreshCw, Ban, Building2, Plane, Download } from "lucide-react";
import Pagination from "@/components/partner/dashboard/Pagination";

interface Booking {
  id: string;
  guest: string;
  partner: string;
  type: "hotel" | "flight";
  amount: string;
  commission: string;
  status: "confirmed" | "pending" | "cancelled" | "refunded" | "disputed";
  date: string;
}

const mockBookings: Booking[] = [
  { id: "BG-240217-001", guest: "Ahmad Rifai", partner: "Hotel Santika Batam", type: "hotel", amount: "Rp 1.700.000", commission: "Rp 170.000", status: "confirmed", date: "17 Feb 2026" },
  { id: "BG-240217-002", guest: "Siti Nurhaliza", partner: "Citilink", type: "flight", amount: "Rp 890.000", commission: "Rp 71.200", status: "confirmed", date: "17 Feb 2026" },
  { id: "BG-240216-003", guest: "Budi Santoso", partner: "Swiss-Belhotel", type: "hotel", amount: "Rp 2.400.000", commission: "Rp 288.000", status: "pending", date: "16 Feb 2026" },
  { id: "BG-240216-004", guest: "Dewi Lestari", partner: "Batik Air", type: "flight", amount: "Rp 1.200.000", commission: "Rp 84.000", status: "cancelled", date: "16 Feb 2026" },
  { id: "BG-240215-005", guest: "Rudi Hartono", partner: "Harris Hotel", type: "hotel", amount: "Rp 950.000", commission: "Rp 95.000", status: "confirmed", date: "15 Feb 2026" },
  { id: "BG-240215-006", guest: "Anisa Putri", partner: "Citilink", type: "flight", amount: "Rp 650.000", commission: "Rp 52.000", status: "refunded", date: "15 Feb 2026" },
  { id: "BG-240214-007", guest: "Fajar Nugroho", partner: "Hotel Santika Batam", type: "hotel", amount: "Rp 3.200.000", commission: "Rp 320.000", status: "disputed", date: "14 Feb 2026" },
  { id: "BG-240214-008", guest: "Maya Sari", partner: "Wings Air", type: "flight", amount: "Rp 480.000", commission: "Rp 38.400", status: "confirmed", date: "14 Feb 2026" },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  confirmed: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Confirmed" },
  pending: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  cancelled: { color: "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400", label: "Cancelled" },
  refunded: { color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", label: "Refunded" },
  disputed: { color: "bg-red-50 dark:bg-red-500/10 text-red-500", label: "Disputed" },
};

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredBookings = mockBookings.filter((b) => {
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || b.guest.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesType = typeFilter === "all" || b.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Oversight</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Monitor all transactions across the platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: mockBookings.length, color: "text-gray-600 dark:text-slate-300" },
          { label: "Confirmed", value: mockBookings.filter(b => b.status === "confirmed").length, color: "text-emerald-500" },
          { label: "Pending", value: mockBookings.filter(b => b.status === "pending").length, color: "text-amber-500" },
          { label: "Refunded", value: mockBookings.filter(b => b.status === "refunded").length, color: "text-blue-500" },
          { label: "Disputed", value: mockBookings.filter(b => b.status === "disputed").length, color: "text-red-500" },
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
          <input type="text" placeholder="Search by ID or guest name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-slate-800 [&>option]:text-gray-700 [&>option]:dark:text-slate-200">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-slate-800 [&>option]:text-gray-700 [&>option]:dark:text-slate-200">
              <option value="all">All Types</option>
              <option value="hotel">Hotel</option>
              <option value="flight">Flight</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
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
              {paginatedBookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600 dark:text-slate-300">{b.id}</td>
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
                  <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{b.amount}</td>
                  <td className="px-5 py-3.5 text-emerald-500 font-medium hidden lg:table-cell">{b.commission}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[b.status].color}`}>{statusConfig[b.status].label}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/bookings/${b.id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                      {b.status === "disputed" && <button className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-gray-400 hover:text-blue-500 transition-colors" title="Refund"><RefreshCw className="w-4 h-4" /></button>}
                      {b.status === "confirmed" && <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Cancel"><Ban className="w-4 h-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredBookings.length} itemsPerPage={itemsPerPage} onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }} />
      </div>
    </div>
  );
}

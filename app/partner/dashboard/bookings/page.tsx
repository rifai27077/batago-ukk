"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Download, Eye, Filter } from "lucide-react";
import StatusBadge from "@/components/partner/dashboard/StatusBadge";
import type { StatusType } from "@/components/partner/dashboard/StatusBadge";
import Pagination from "@/components/partner/dashboard/Pagination";

interface BookingItem {
  id: string;
  guest: string;
  property: string;
  checkIn: string;
  checkOut: string;
  status: StatusType;
  amount: string;
  createdAt: string;
}

const mockBookings: BookingItem[] = [
  { id: "BG-240216-001", guest: "Ahmad Rifai", property: "Deluxe Room", checkIn: "16 Feb", checkOut: "18 Feb", status: "confirmed", amount: "Rp 1.700.000", createdAt: "14 Feb" },
  { id: "BG-240216-002", guest: "Budi Pratama", property: "Suite Room", checkIn: "17 Feb", checkOut: "20 Feb", status: "pending", amount: "Rp 4.500.000", createdAt: "14 Feb" },
  { id: "BG-240215-003", guest: "Siti Nurhaliza", property: "Family Room", checkIn: "20 Feb", checkOut: "22 Feb", status: "confirmed", amount: "Rp 4.400.000", createdAt: "13 Feb" },
  { id: "BG-240215-004", guest: "Reza Arap", property: "Standard Room", checkIn: "15 Feb", checkOut: "16 Feb", status: "completed", amount: "Rp 650.000", createdAt: "12 Feb" },
  { id: "BG-240214-005", guest: "Dewi Lestari", property: "Deluxe Room", checkIn: "14 Feb", checkOut: "15 Feb", status: "cancelled", amount: "Rp 850.000", createdAt: "11 Feb" },
  { id: "BG-240213-006", guest: "Tono Sucipto", property: "Suite Room", checkIn: "13 Feb", checkOut: "16 Feb", status: "completed", amount: "Rp 6.750.000", createdAt: "10 Feb" },
  { id: "BG-240212-007", guest: "Maya Sari", property: "Deluxe Room", checkIn: "12 Feb", checkOut: "14 Feb", status: "completed", amount: "Rp 1.700.000", createdAt: "9 Feb" },
  { id: "BG-240211-008", guest: "Joko Widodo", property: "Presidential Suite", checkIn: "11 Feb", checkOut: "13 Feb", status: "completed", amount: "Rp 12.000.000", createdAt: "8 Feb" },
  { id: "BG-240210-009", guest: "Lisa Blackpink", property: "Family Room", checkIn: "10 Feb", checkOut: "12 Feb", status: "cancelled", amount: "Rp 4.400.000", createdAt: "7 Feb" },
  { id: "BG-240209-010", guest: "Raisa Andriana", property: "Deluxe Room", checkIn: "9 Feb", checkOut: "11 Feb", status: "completed", amount: "Rp 1.700.000", createdAt: "6 Feb" },
];

const tabs = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filtered = useMemo(() => {
    return mockBookings.filter((b) => {
      const matchSearch =
        b.guest.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase());

      if (activeTab === "all") return matchSearch;
      if (activeTab === "today") return matchSearch && b.status === "confirmed";
      if (activeTab === "upcoming") return matchSearch && (b.status === "confirmed" || b.status === "pending");
      return matchSearch && b.status === activeTab;
    });
  }, [activeTab, search]);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{mockBookings.length} total bookings</p>
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
          <div className="flex overflow-x-auto bg-gray-100 dark:bg-slate-900 rounded-xl p-1 flex-shrink-0 no-scrollbar">
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
              placeholder="Search by guest name or booking ID..."
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
                  <th className="text-left px-5 py-3 font-semibold">Guest</th>
                  <th className="text-left px-5 py-3 font-semibold">Room</th>
                  <th className="text-left px-5 py-3 font-semibold">Check-in</th>
                  <th className="text-left px-5 py-3 font-semibold">Check-out</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                  <th className="text-center px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {paginatedData.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-slate-400">#{booking.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{booking.guest}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.property}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.checkIn}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{booking.checkOut}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={booking.status} /></td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800 dark:text-slate-200">{booking.amount}</td>
                    <td className="px-5 py-3.5 text-center">
                      <Link
                        href={`/partner/dashboard/bookings/${booking.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
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
                  <p className="font-semibold text-gray-800 dark:text-slate-200 text-sm truncate">{booking.guest}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{booking.property} · {booking.checkIn} — {booking.checkOut}</p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">#{booking.id}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
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

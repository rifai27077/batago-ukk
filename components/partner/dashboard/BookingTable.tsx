"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { StatusType } from "./StatusBadge";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";

interface Booking {
  id: string;
  guest: string;
  property: string;
  date: string;
  status: StatusType;
  amount: string;
}

import { getPartnerBookings } from "@/lib/api";

interface BookingTableProps {
  bookings?: Booking[];
  showViewAll?: boolean;
  compact?: boolean;
  itemsPerPage?: number;
  showPagination?: boolean;
}

export default function BookingTable({
  bookings: initialBookings,
  showViewAll = true,
  compact = false,
  itemsPerPage: initialItemsPerPage = 5,
  showPagination = false,
}: BookingTableProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings || []);
  const [isLoading, setIsLoading] = useState(!initialBookings);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  useEffect(() => {
    if (initialBookings) {
      setBookings(initialBookings);
      setIsLoading(false);
      return;
    }

    async function fetchBookings() {
      try {
        const res = await getPartnerBookings({ page: 1, limit: 10 });
        if (res.data) {
          const mapped: Booking[] = res.data.map((b: any) => ({
            id: b.booking_code,
            guest: b.user?.name || "Guest",
            property: b.type === "hotel" ? "Room" : "Flight",
            date: new Date(b.CreatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
            status: b.booking_status.toLowerCase() as StatusType,
            amount: `Rp ${b.total_amount.toLocaleString("en-US")}`,
          }));
          setBookings(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch bookings for table", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [initialBookings]);

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    if (!showPagination) return bookings;
    const start = (currentPage - 1) * itemsPerPage;
    return bookings.slice(start, start + itemsPerPage);
  }, [bookings, currentPage, itemsPerPage, showPagination]);

  const handleItemsPerPageChange = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Bookings</h3>
          {!compact && (
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {showPagination ? `${bookings.length} total bookings` : `${bookings.length} recent bookings`}
            </p>
          )}
        </div>
        {showViewAll && (
          <Link
            href="/partner/dashboard/bookings"
            className="text-sm text-primary font-semibold hover:underline"
          >
            View All
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="p-10 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading bookings...</p>
        </div>
      ) : paginatedBookings.length === 0 ? (
        <EmptyState
          variant="booking"
          title="No bookings yet"
          description="Incoming bookings will appear here. Make sure your listing is active!"
          compact
        />
      ) : (
        <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 text-xs tracking-wider">
              <th className="text-left px-5 py-3 font-semibold">Booking ID</th>
              <th className="text-left px-5 py-3 font-semibold">Guest</th>
              <th className="text-left px-5 py-3 font-semibold">Room</th>
              <th className="text-left px-5 py-3 font-semibold">Date</th>
              <th className="text-left px-5 py-3 font-semibold">Status</th>
              <th className="text-right px-5 py-3 font-semibold">Amount</th>
              <th className="text-center px-5 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
            {paginatedBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-slate-400">#{booking.id}</td>
                <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{booking.guest}</td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-slate-300">{booking.property}</td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-slate-300">{booking.date}</td>
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

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-700 flex-1">
        {paginatedBookings.map((booking) => (
          <Link
            href={`/partner/dashboard/bookings/${booking.id}`}
            key={booking.id}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-slate-200 text-sm truncate">{booking.guest}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{booking.property} · {booking.date}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-mono mt-0.5">#{booking.id}</p>
            </div>
            <div className="text-right ml-4 shrink-0">
              <p className="font-semibold text-sm text-gray-800 dark:text-slate-200">{booking.amount}</p>
              <StatusBadge status={booking.status} className="mt-1" />
            </div>
          </Link>
        ))}
      </div>
        </>
      )}

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={bookings.length}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}

export type { Booking };

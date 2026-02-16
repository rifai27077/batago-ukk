"use client";

import { useState, useMemo } from "react";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import ListingCard from "@/components/partner/dashboard/ListingCard";
import type { Listing } from "@/components/partner/dashboard/ListingCard";
import Pagination from "@/components/partner/dashboard/Pagination";
import EmptyState from "@/components/partner/dashboard/EmptyState";

const mockListings: Listing[] = [
  {
    id: "1",
    name: "Hotel Santika Premiere Batam",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Batam, Kepulauan Riau",
    rating: 4.6,
    reviewCount: 128,
    rooms: 45,
    occupancy: 78,
    status: "active",
    type: "hotel",
  },
  {
    id: "2",
    name: "Santika Beach Resort",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Nongsa, Batam",
    rating: 4.8,
    reviewCount: 96,
    rooms: 32,
    occupancy: 92,
    status: "active",
    type: "hotel",
  },
  {
    id: "3",
    name: "Santika City Hotel",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Nagoya, Batam",
    rating: 4.3,
    reviewCount: 64,
    rooms: 28,
    occupancy: 55,
    status: "active",
    type: "hotel",
  },
  {
    id: "4",
    name: "Villa Paradise Bintan",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Lagoi, Bintan",
    rating: 4.9,
    reviewCount: 42,
    rooms: 12,
    occupancy: 85,
    status: "draft",
    type: "hotel",
  },
  {
    id: "5",
    name: "Santika Express Airport",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Hang Nadim, Batam",
    rating: 4.1,
    reviewCount: 31,
    rooms: 20,
    occupancy: 38,
    status: "inactive",
    type: "hotel",
  },
  {
    id: "6",
    name: "The Grand Waterfront Hotel",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Waterfront City, Batam",
    rating: 4.7,
    reviewCount: 205,
    rooms: 60,
    occupancy: 88,
    status: "active",
    type: "hotel",
  },
];

const statusFilters = ["All", "Active", "Draft", "Inactive"] as const;

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filtered = useMemo(() => {
    return mockListings.filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || l.status === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{mockListings.length} properties listed</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4" />
          Add New Listing
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl px-3 py-2.5 gap-2 flex-1 border border-gray-100 dark:border-slate-700 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-colors">
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={handleSearchChange}
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-slate-500 w-full"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1 flex-shrink-0">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => handleFilterChange(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1 flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white dark:bg-slate-800 shadow-sm text-gray-800 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white dark:bg-slate-800 shadow-sm text-gray-800 dark:text-white" : "text-gray-400 dark:text-slate-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {paginatedData.length > 0 ? (
        <div className="space-y-4">
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
            {paginatedData.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
          <EmptyState
            variant="search"
            title="Tidak ada listing ditemukan"
            description="Coba ubah kata kunci pencarian atau filter yang digunakan."
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import ListingCard from "@/components/partner/dashboard/ListingCard";
import type { Listing } from "@/components/partner/dashboard/ListingCard";
import Pagination from "@/components/partner/dashboard/Pagination";
import EmptyState from "@/components/partner/dashboard/EmptyState";
import AddListingModal from "@/components/partner/dashboard/AddListingModal";
import { getPartnerListings, createPartnerListing, deletePartnerListing, updatePartnerListing } from "@/lib/api";

const statusFilters = ["All", "Active", "Draft", "Inactive"] as const;

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await getPartnerListings({ page: 1, limit: 100 });
        if (res.data && res.data.length > 0) {
          console.log("DEBUG RAW API DATA:", JSON.stringify(res.data[0], null, 2));
          const mapped: Listing[] = res.data.map((l) => {
            let imageUrl = l.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
            
            // If it's a relative path from our own backend, make sure it has the base URL
            if (imageUrl.startsWith("uploads/") || imageUrl.startsWith("/uploads/")) {
              imageUrl = `http://localhost:8080${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }
            
            console.log(`DEBUG IMAGE for "${l.name}": raw=${l.images?.[0]?.url}, final=${imageUrl}`);

            return {
              id: String(l.ID),
              name: l.name,
              image: imageUrl,
              location: l.address || (l.city?.name ? `${l.city.name}, ${l.city.country}` : ""),
              rating: l.rating || 0,
              reviewCount: l.total_reviews || 0,
              rooms: l.room_count || l.rooms || 0,
              occupancy: l.occupancy || 0,
              status: (l.status?.toLowerCase() || "active") as "active" | "draft" | "inactive",
              type: (l.type?.toLowerCase() || "hotel") as any,
            };
          });
          setListings(mapped);
          setTotalListings(res.meta.total);
        }
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchListings();
  }, []);

  const handleSaveListing = async (data: any) => {
    try {
      let imageUrl = "";
      
      // Handle image upload if exists
      if (data.image && data.image instanceof File) {
        console.log("DEBUG: Starting image upload for file:", data.image.name);
        try {
          const { uploadListingImage } = await import("@/lib/api");
          const uploadRes = await uploadListingImage(data.image);
          console.log("DEBUG: Image upload result:", uploadRes);
          imageUrl = uploadRes.url;
          console.log("DEBUG: Uploaded image URL:", imageUrl);
        } catch (uploadErr) {
          console.error("DEBUG ERROR: Image upload failed:", uploadErr);
          alert("Failed to upload image. Please try again.");
          return; // Stop further execution if image upload fails
        }
      } else {
        console.log("DEBUG: No image file to upload or invalid image data.");
      }

      const listingData = {
        name: data.name,
        city_id: data.city_id || 1,
        description: data.description || "",
        address: data.address || data.location || "",
        type: data.type || "hotel",
        rooms: parseInt(data.rooms) || 1,
        price: data.price,
        amenities: data.amenities || [],
        image_url: imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      console.log("DEBUG: Saving listing with data:", listingData);
      if (editingListing) {
        // Update existing listing
        await updatePartnerListing(Number(editingListing.id), listingData);
        console.log("DEBUG: Partner listing updated successfully.");
      } else {
        // Create new listing
        await createPartnerListing(listingData);
        console.log("DEBUG: Partner listing created successfully.");
      }
      
      const res = await getPartnerListings({ page: 1, limit: 100 });
      if (res.data) {
        console.log("DEBUG: Fetched updated listings after creation:", res.data);
        const mapped: Listing[] = res.data.map((l) => {
          let imageUrl = l.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
          
          if (imageUrl.startsWith("uploads/") || imageUrl.startsWith("/uploads/")) {
            imageUrl = `http://localhost:8080${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
          }

          return {
            id: String(l.ID),
            name: l.name,
            image: imageUrl,
            location: l.address || (l.city?.name ? `${l.city.name}, ${l.city.country}` : ""),
            rating: l.rating || 0,
            reviewCount: l.total_reviews || 0,
            rooms: l.room_count || l.rooms || 0,
            occupancy: l.occupancy || 0,
            status: (l.status?.toLowerCase() || "active") as "active" | "draft" | "inactive",
            type: (l.type?.toLowerCase() || "hotel") as any,
          };
        });
        setListings(mapped);
        setTotalListings(res.meta.total);
      }
    } catch (err) {
      console.error("Failed to create listing", err);
      alert("Failed to create listing: " + (err instanceof Error ? err.message : "Unknown error"));
    }
    setIsAddModalOpen(false);
    setEditingListing(null);
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setIsAddModalOpen(true);
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await deletePartnerListing(Number(id));
      setListings((prev) => prev.filter((l) => l.id !== id));
      setTotalListings((prev) => prev - 1);
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Failed to delete listing: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected listings?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => deletePartnerListing(Number(id))));
      setListings((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      setTotalListings((prev) => prev - selectedIds.length);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete listings", err);
      alert("Failed to delete some listings.");
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      await Promise.all(selectedIds.map((id) => updatePartnerListing(Number(id), { status: newStatus })));
      setListings((prev) =>
        prev.map((l) =>
          selectedIds.includes(l.id) ? { ...l, status: newStatus as "active" | "draft" | "inactive" } : l
        )
      );
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to update listings", err);
      alert("Failed to update some listings.");
    }
  };

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || l.status === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, listings]);

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
    setSelectedIds([]); // Clear selection on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setSelectedIds([]); // Clear selection on search change
  };

  const handleItemsPerPageChange = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  const handleSelectListing = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((l) => l.id));
    }
  };

  return (
    <div className="space-y-5 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{totalListings} properties listed</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add New Listing
        </button>
      </div>

      <AddListingModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setEditingListing(null); }} 
        onSave={handleSaveListing}
        editData={editingListing ? {
          id: editingListing.id,
          name: editingListing.name,
          type: editingListing.type,
          location: editingListing.location,
          rooms: editingListing.rooms,
          price: "",
        } : null}
      />

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl px-3 py-2.5 gap-2 flex-1 border border-gray-100 dark:border-slate-700 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-colors">
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={handleSearchChange}
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-slate-500 w-full"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1 shrink-0">
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
          <div className="hidden sm:flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1 shrink-0">
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
        
        {/* Bulk Selection Header */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
           <button 
             onClick={handleSelectAll}
             className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary transition-colors flex items-center gap-2"
           >
             <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedIds.length > 0 && selectedIds.length === paginatedData.length ? "bg-primary border-primary text-white" : "border-gray-300 dark:border-slate-600"}`}>
                {selectedIds.length > 0 && selectedIds.length === paginatedData.length && <Plus className="w-3 h-3 rotate-45" />} {/* Using Plus rotated as check/partial check hack for now since Check is not imported */}
             </div>
             {selectedIds.length === paginatedData.length ? "Deselect All" : "Select All"}
           </button>
           <span className="text-sm text-gray-400 dark:text-slate-500">
             {selectedIds.length} properties selected
           </span>
        </div>
      </div>

      {/* Listings Grid */}
      {paginatedData.length > 0 ? (
        <div className="space-y-4">
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
            {paginatedData.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                selectable={true}
                selected={selectedIds.includes(listing.id)}
                onSelect={handleSelectListing}
                onEdit={handleEditListing}
                onDelete={handleDeleteListing}
              />
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

      {/* Sticky Bulk Selection Action Bar */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xl rounded-2xl p-2 flex items-center gap-2 transition-all duration-300 z-40 ${
          selectedIds.length > 0 ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
        style={{ minWidth: "320px" }}
      >
         <div className="bg-gray-100 dark:bg-slate-900 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-200 mr-2">
            {selectedIds.length} Selected
         </div>
         <button 
           onClick={() => handleBulkStatusChange("active")}
           className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 transition-colors"
         >
             Mark Active
         </button>
         <button 
           onClick={() => handleBulkStatusChange("inactive")}
           className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 transition-colors"
         >
             Mark Inactive
         </button>
         <button 
           onClick={handleBulkDelete}
           className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 transition-colors flex items-center gap-2"
         >
             Delete
         </button>
      </div>
    </div>
  );
}

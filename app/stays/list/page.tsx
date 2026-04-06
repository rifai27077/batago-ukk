"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import StaysListingSearchHeader from "@/components/stays/list/StaysListingSearchHeader";
import StaysFilters from "@/components/stays/list/StaysFilters";
import StaysSortTabs from "@/components/stays/list/StaysSortTabs";
import StaysCard from "@/components/stays/list/StaysCard";
import StaysSkeleton from "@/components/stays/list/StaysSkeleton";
import { searchHotels, HotelResult, getFavourites, toggleFavourite } from "@/lib/api";
import { toast } from "react-hot-toast";

// Fallback data for when backend is unavailable
const fallbackStays = [
  {
    id: 1001,
    name: "The Ritz-Carlton Bali",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Nusa Dua, Bali",
    rating: 4.8,
    reviews: 1240,
    price: "Rp 4.500.000",
    pricePerNight: "Rp 4.500.000",
    priceValue: 4500000,
    amenities: ["Pool", "Spa", "Beachfront", "Breakfast included"]
  },
  {
    id: 1002,
    name: "Ayana Resort and Spa",
    image: "https://images.unsplash.com/photo-1571896349842-6e53ce41be67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Jimbaran, Bali",
    rating: 4.7,
    reviews: 3500,
    price: "Rp 3.800.000",
    pricePerNight: "Rp 3.800.000",
    priceValue: 3800000,
    amenities: ["Rock Bar", "12 Pools", "Private Beach", "Golf"]
  },
  {
    id: 1003,
    name: "Padma Resort Legian",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Legian, Bali",
    rating: 4.6,
    reviews: 2100,
    price: "Rp 2.900.000",
    pricePerNight: "Rp 2.900.000",
    priceValue: 2900000,
    amenities: ["Infinity Pool", "Kids Club", "Garden", "Yoga"]
  },
];

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function mapHotelToCard(hotel: HotelResult) {
  const primaryImage = hotel.images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.url || hotel.images?.[0]?.url || "";
  const cityName = hotel.city?.name || "";
  const country = hotel.city?.country || "Indonesia";
  const amenities = hotel.facilities?.map((f) => f.name) || [];
  const price = hotel.lowest_price || 0;

  return {
    id: hotel.ID,
    name: hotel.name,
    image: imageUrl,
    location: `${cityName}, ${country}`,
    rating: hotel.rating || 0,
    reviews: hotel.total_reviews || 0,
    price: formatPrice(price),
    pricePerNight: formatPrice(price),
    priceValue: price,
    amenities,
  };
}

function HotelListingContent() {
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<ReturnType<typeof mapHotelToCard>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

  // Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [activeSort, setActiveSort] = useState("recommended");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Fetch hotels from API
  useEffect(() => {
    async function fetchHotels() {
      setIsLoading(true);
      try {
        const location = searchParams.get("location") || "";
        const checkIn = searchParams.get("checkIn") || "";
        const checkOut = searchParams.get("checkOut") || "";
        const guests = searchParams.get("guests") || "";

        const res = await searchHotels({
          city: location,
          checkin: checkIn,
          checkout: checkOut,
          guests: guests ? parseInt(guests) : undefined,
          limit: 20,
        });

        if (res && res.data) {
          setHotels(res.data.map(mapHotelToCard));
          setTotalCount(res.meta ? res.meta.total : res.data.length);
          setUsingFallback(false);
        } else {
          setHotels(fallbackStays);
          setTotalCount(fallbackStays.length);
          setUsingFallback(true);
        }
      } catch {
        setHotels(fallbackStays);
        setTotalCount(fallbackStays.length);
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHotels();
  }, [searchParams]);

  // Fetch Favourites independently
  useEffect(() => {
    async function fetchFavs() {
      import("@/lib/api").then(({ getToken }) => {
        if (!getToken()) return;
        getFavourites("hotel").then(res => {
          if (res.data) {
            const ids = res.data.map((f: any) => f.hotel_id);
            setFavouriteIds(ids);
          }
        }).catch(err => console.error("Failed to fetch favourites", err));
      });
    }
    fetchFavs();
  }, []);

  const handleToggleFav = async (hotelId: number) => {
    if (hotelId === 0) {
      toast.error("Please login to save favourites");
      return;
    }
    try {
      const res = await toggleFavourite("hotel", undefined, hotelId);
      if (res.is_favourite) {
        setFavouriteIds(prev => [...prev, hotelId]);
        toast.success("Added to favourites");
      } else {
        setFavouriteIds(prev => prev.filter(id => id !== hotelId));
        toast.success("Removed from favourites");
      }
    } catch (err) {
      toast.error("Failed to toggle favourite");
    }
  };

  const handleFilterChange = (changeFn: () => void) => {
    changeFn();
  };

  const filteredAndSortedStays = useMemo(() => {
    let result = hotels.filter((stay) => {
      const parsedMinPrice = minPrice ? Number(minPrice) : null;
      const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;
      const matchesMinPrice = parsedMinPrice === null || stay.priceValue >= parsedMinPrice;
      const matchesMaxPrice = parsedMaxPrice === null || stay.priceValue <= parsedMaxPrice;
      const matchesRating = stay.rating >= minRating;
      const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(a => stay.amenities.includes(a));
      return matchesMinPrice && matchesMaxPrice && matchesRating && matchesAmenities;
    });

    if (activeSort === "cheapest") {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (activeSort === "best") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [hotels, minPrice, maxPrice, minRating, selectedAmenities, activeSort]);

  const availableAmenities = useMemo(() => {
    const all = hotels.flatMap(h => h.amenities);
    return [...new Set(all)];
  }, [hotels]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      {/* Search Header Section */}
      <div className="pt-24 pb-8 lg:pb-12 bg-gray-50/30 px-4 lg:px-6">
        <Suspense fallback={<div className="h-[200px] animate-pulse bg-gray-100 rounded-2xl" />}>
          <StaysListingSearchHeader />
        </Suspense>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-6 py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/stays" className="hover:text-primary transition-colors">Stays</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-primary">List</span>
        </div>

        {/* Fallback Notice */}
        {usingFallback && !isLoading && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Note:</strong> Showing sample data. Refine your search or check backend connection.
            </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-4">
             <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-[4px] shadow-md transition-all active:scale-95"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filter Results</span>
             </button>
          </div>

          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:w-[280px] shrink-0">
            <StaysFilters 
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={(v) => handleFilterChange(() => setMinPrice(v))}
                onMaxPriceChange={(v) => handleFilterChange(() => setMaxPrice(v))}
                minRating={minRating}
                onRatingChange={(r) => handleFilterChange(() => setMinRating(r))}
                availableAmenities={availableAmenities}
                selectedAmenities={selectedAmenities}
                onAmenityChange={(a) => handleFilterChange(() => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(i => i !== a) : [...prev, a]))}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
             <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
             />
             <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6">
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-bold text-foreground">Filters</h2>
                      <button 
                         onClick={() => setIsMobileFilterOpen(false)}
                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                         <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                      </button>
                   </div>
                   <StaysFilters 
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onMinPriceChange={(v) => handleFilterChange(() => setMinPrice(v))}
                        onMaxPriceChange={(v) => handleFilterChange(() => setMaxPrice(v))}
                        minRating={minRating}
                        onRatingChange={(r) => handleFilterChange(() => setMinRating(r))}
                        availableAmenities={availableAmenities}
                        selectedAmenities={selectedAmenities}
                        onAmenityChange={(a) => handleFilterChange(() => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(i => i !== a) : [...prev, a]))}
                   />
                   <div className="mt-8 pt-6 border-t border-gray-100">
                      <button 
                         onClick={() => setIsMobileFilterOpen(false)}
                         className="w-full bg-primary text-white font-bold py-3 rounded-[4px]"
                      >
                         Show Results
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Listings Area */}
          <div className="flex-1 min-w-0">
            <StaysSortTabs 
                activeSort={activeSort}
                onSortChange={(id) => handleFilterChange(() => setActiveSort(id))}
            />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                 <p className="text-sm font-bold text-foreground">
                    Showing {filteredAndSortedStays.length} of <span className="text-secondary">{totalCount} places</span>
                 </p>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                    <StaysSkeleton key={idx} />
                ))
              ) : filteredAndSortedStays.length > 0 ? (
                filteredAndSortedStays.map((stay) => (
                    <StaysCard 
                        key={stay.id} 
                        {...stay} 
                        isFavourite={favouriteIds.includes(stay.id)}
                        onToggle={() => handleToggleFav(stay.id)}
                    />
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-lg font-bold text-foreground mb-2">No hotels found</p>
                    <p className="text-muted">Try adjusting your filters to find more results.</p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {!isLoading && filteredAndSortedStays.length > 0 && (
                <div className="mt-12">
                    <button className="w-full bg-[#112211] text-white font-bold py-4 rounded-[4px] hover:bg-black transition-all text-sm tracking-wider">
                        Show more results
                    </button>
                </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function HotelListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HotelListingContent />
    </Suspense>
  );
}

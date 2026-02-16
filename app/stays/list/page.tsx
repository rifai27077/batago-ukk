"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import StaysListingSearchHeader from "@/components/stays/list/StaysListingSearchHeader";
import StaysFilters from "@/components/stays/list/StaysFilters";
import StaysSortTabs from "@/components/stays/list/StaysSortTabs";
import StaysCard from "@/components/stays/list/StaysCard";
import StaysSkeleton from "@/components/stays/list/StaysSkeleton";

const initialStays = [
  {
    name: "The Ritz-Carlton Bali",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Nusa Dua, Bali",
    rating: 4.8,
    reviews: 1240,
    price: "Rp. 4.500.000",
    pricePerNight: "Rp. 4.500.000",
    priceValue: 4500000,
    amenities: ["Pool", "Spa", "Beachfront", "Breakfast included"]
  },
  {
    name: "Ayana Resort and Spa",
    image: "https://images.unsplash.com/photo-1571896349842-6e53ce41be67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Jimbaran, Bali",
    rating: 4.7,
    reviews: 3500,
    price: "Rp. 3.800.000",
    pricePerNight: "Rp. 3.800.000",
    priceValue: 3800000,
    amenities: ["Rock Bar", "12 Pools", "Private Beach", "Golf"]
  },
  {
    name: "Padma Resort Legian",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Legian, Bali",
    rating: 4.6,
    reviews: 2100,
    price: "Rp. 2.900.000",
    pricePerNight: "Rp. 2.900.000",
    priceValue: 2900000,
    amenities: ["Infinity Pool", "Kids Club", "Garden", "Yoga"]
  },
  {
    name: "Hard Rock Hotel Bali",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Kuta, Bali",
    rating: 4.4,
    reviews: 4200,
    price: "Rp. 1.800.000",
    pricePerNight: "Rp. 1.800.000",
    priceValue: 1800000,
    amenities: ["Live Music", "Water Slides", "Central Location", "Gym"]
  },
  {
    name: "Potato Head Suites",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    location: "Seminyak, Bali",
    rating: 4.9,
    reviews: 890,
    price: "Rp. 5.200.000",
    pricePerNight: "Rp. 5.200.000",
    priceValue: 5200000,
    amenities: ["Beach Club", "Sustainable", "Art Installation", "Sunset View"]
  }
];

export default function HotelListingPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [activeSort, setActiveSort] = useState("recommended");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFreebies, setSelectedFreebies] = useState<string[]>([]);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (changeFn: () => void) => {
    setIsLoading(true);
    changeFn();
    setTimeout(() => setIsLoading(false), 600);
  };

  const filteredAndSortedStays = useMemo(() => {
    let result = initialStays.filter(stay => {
        // Price Filter
        const parsedMinPrice = minPrice ? Number(minPrice) : null;
        const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;
        const matchesMinPrice = parsedMinPrice === null || stay.priceValue >= parsedMinPrice;
        const matchesMaxPrice = parsedMaxPrice === null || stay.priceValue <= parsedMaxPrice;

        // Rating Filter
        const matchesRating = stay.rating >= minRating;

        // Amenity Filter (Mock logic: loose match for demo)
        // In real app, check if stay.amenities includes all selectedAmenities
        // Here we just return true to not hide everything since data is sparse
        const matchesAmenities = true; 

        return matchesMinPrice && matchesMaxPrice && matchesRating && matchesAmenities;
    });

    // Sort
    if (activeSort === "cheapest") {
        result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (activeSort === "best") {
        result.sort((a, b) => b.rating - a.rating);
    } 
    // "recommended" is default order

    return result;
  }, [minPrice, maxPrice, minRating, activeSort, selectedAmenities]);

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
                selectedAmenities={selectedAmenities}
                onAmenityChange={(a) => handleFilterChange(() => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(i => i !== a) : [...prev, a]))}
                selectedFreebies={selectedFreebies}
                onFreebieChange={(f) => handleFilterChange(() => setSelectedFreebies(prev => prev.includes(f) ? prev.filter(i => i !== f) : [...prev, f]))}
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
                        selectedAmenities={selectedAmenities}
                        onAmenityChange={(a) => handleFilterChange(() => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(i => i !== a) : [...prev, a]))}
                        selectedFreebies={selectedFreebies}
                        onFreebieChange={(f) => handleFilterChange(() => setSelectedFreebies(prev => prev.includes(f) ? prev.filter(i => i !== f) : [...prev, f]))}
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
                    Showing {filteredAndSortedStays.length} of <span className="text-secondary">{initialStays.length} places</span>
                 </p>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                    <StaysSkeleton key={idx} />
                ))
              ) : filteredAndSortedStays.length > 0 ? (
                filteredAndSortedStays.map((stay, idx) => (
                    <StaysCard 
                        key={idx} 
                        {...stay} 
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

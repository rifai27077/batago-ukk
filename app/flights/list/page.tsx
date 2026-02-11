"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ListingSearchHeader from "@/components/flights/list/ListingSearchHeader";
import FlightFilters from "@/components/flights/list/FlightFilters";
import FlightSortTabs from "@/components/flights/list/FlightSortTabs";
import FlightCard from "@/components/flights/list/FlightCard";
import FlightSkeleton from "@/components/flights/list/FlightSkeleton";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const initialFlights = [
  {
    airline: "Emirates",
    logo: "https://www.vectorlogo.zone/logos/emirates/emirates-icon.svg",
    departureTime: "12:00 pm",
    arrivalTime: "01:28 pm",
    duration: "2h 28m",
    durationMinutes: 148,
    type: "Non-stop",
    route: "EWR-BNA",
    price: 1100000,
    rating: 4.2,
    reviews: 54,
  },
  {
    airline: "Fly Dubai",
    logo: "https://www.vectorlogo.zone/logos/flydubai/flydubai-icon.svg",
    departureTime: "11:50 am",
    arrivalTime: "02:10 pm",
    duration: "2h 20m",
    durationMinutes: 140,
    type: "Non-stop",
    route: "EWR-BNA",
    price: 950000,
    rating: 3.8,
    reviews: 42,
  },
  {
    airline: "Qatar",
    logo: "https://www.vectorlogo.zone/logos/qatar_airways/qatar_airways-icon.svg",
    departureTime: "01:30 pm",
    arrivalTime: "04:15 pm",
    duration: "2h 45m",
    durationMinutes: 165,
    type: "Non-stop",
    route: "EWR-BNA",
    price: 1250000,
    rating: 4.8,
    reviews: 128,
  },
  {
    airline: "Etihad",
    logo: "https://www.vectorlogo.zone/logos/etihad_airways/etihad_airways-icon.svg",
    departureTime: "06:00 pm",
    arrivalTime: "08:28 pm",
    duration: "2h 28m",
    durationMinutes: 148,
    type: "Non-stop",
    route: "EWR-BNA",
    price: 1150000,
    rating: 4.5,
    reviews: 86,
  },
];

export default function FlightListingPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minDeparture, setMinDeparture] = useState("");
  const [maxDeparture, setMaxDeparture] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [activeSort, setActiveSort] = useState("cheapest");

  // Helper: parse "12:00 pm" => minutes from midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toLowerCase();
    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Helper: parse "HH:MM" (24h) => minutes from midnight
  const parseInputTimeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

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

  const handleAirlineToggle = (airline: string) => {
    handleFilterChange(() => {
      setSelectedAirlines(prev => 
        prev.includes(airline) 
          ? prev.filter(a => a !== airline) 
          : [...prev, airline]
      );
    });
  };

  const filteredAndSortedFlights = useMemo(() => {
    const result = initialFlights.filter(flight => {
        const matchesAirline = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);

        // Price filter: only apply if user has entered a value
        const parsedMinPrice = minPrice ? Number(minPrice) : null;
        const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;
        const matchesMinPrice = parsedMinPrice === null || flight.price >= parsedMinPrice;
        const matchesMaxPrice = parsedMaxPrice === null || flight.price <= parsedMaxPrice;

        // Departure time filter: only apply if user has entered a value
        const flightMinutes = parseTimeToMinutes(flight.departureTime);
        const parsedMinDep = minDeparture ? parseInputTimeToMinutes(minDeparture) : null;
        const parsedMaxDep = maxDeparture ? parseInputTimeToMinutes(maxDeparture) : null;
        const matchesMinDep = parsedMinDep === null || flightMinutes >= parsedMinDep;
        const matchesMaxDep = parsedMaxDep === null || flightMinutes <= parsedMaxDep;

        const matchesRating = flight.rating >= minRating;
        return matchesAirline && matchesMinPrice && matchesMaxPrice && matchesMinDep && matchesMaxDep && matchesRating;
    });

    // Sort
    result.sort((a, b) => {
        if (activeSort === "cheapest") return a.price - b.price;
        if (activeSort === "quickest") return a.durationMinutes - b.durationMinutes;
        if (activeSort === "best") return b.rating - a.rating;
        return 0;
    });

    return result;
  }, [selectedAirlines, minPrice, maxPrice, minDeparture, maxDeparture, minRating, activeSort]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      {/* Search Header Section */}
      <div className="pt-24 pb-8 lg:pb-12 bg-gray-50/30 px-4 lg:px-6">
        <Suspense fallback={<div className="h-[200px] animate-pulse bg-gray-100 rounded-2xl" />}>
          <ListingSearchHeader />
        </Suspense>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-6 py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/flights" className="hover:text-primary transition-colors">Flights</Link>
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
            <FlightFilters 
                selectedAirlines={selectedAirlines}
                onAirlineChange={handleAirlineToggle}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={(v) => handleFilterChange(() => setMinPrice(v))}
                onMaxPriceChange={(v) => handleFilterChange(() => setMaxPrice(v))}
                minDeparture={minDeparture}
                maxDeparture={maxDeparture}
                onMinDepartureChange={(v) => handleFilterChange(() => setMinDeparture(v))}
                onMaxDepartureChange={(v) => handleFilterChange(() => setMaxDeparture(v))}
                minRating={minRating}
                onRatingChange={(r) => handleFilterChange(() => setMinRating(r))}
            />
          </div>

          {/* Mobile Filter Drawer (Slide-over) */}
          <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
             {/* Backdrop */}
             <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
             />
             
             {/* Drawer Content */}
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
                   <FlightFilters 
                        selectedAirlines={selectedAirlines}
                        onAirlineChange={handleAirlineToggle}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onMinPriceChange={(v) => handleFilterChange(() => setMinPrice(v))}
                        onMaxPriceChange={(v) => handleFilterChange(() => setMaxPrice(v))}
                        minDeparture={minDeparture}
                        maxDeparture={maxDeparture}
                        onMinDepartureChange={(v) => handleFilterChange(() => setMinDeparture(v))}
                        onMaxDepartureChange={(v) => handleFilterChange(() => setMaxDeparture(v))}
                        minRating={minRating}
                        onRatingChange={setMinRating}
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
            <FlightSortTabs 
                activeSort={activeSort}
                onSortChange={(id) => handleFilterChange(() => setActiveSort(id))}
            />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                 <p className="text-sm font-bold text-foreground">
                    Showing {filteredAndSortedFlights.length} of <span className="text-secondary">{initialFlights.length} places</span>
                 </p>
                 <div className="flex items-center gap-2 text-sm font-bold text-foreground cursor-pointer self-end sm:self-auto">
                    Sort by <span className="text-foreground/60 font-bold uppercase tracking-tight">{activeSort}</span>
                    <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                 </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                    <FlightSkeleton key={idx} />
                ))
              ) : filteredAndSortedFlights.length > 0 ? (
                filteredAndSortedFlights.map((flight, idx) => (
                    <FlightCard 
                        key={idx} 
                        {...flight} 
                        price={`Rp. ${flight.price.toLocaleString('id-ID')}`}
                    />
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-lg font-bold text-foreground mb-2">No flights found</p>
                    <p className="text-muted">Try adjusting your filters to find more results.</p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {!isLoading && filteredAndSortedFlights.length > 0 && (
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

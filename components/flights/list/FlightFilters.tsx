"use client";

import { ChevronUp } from "lucide-react";

interface FlightFiltersProps {
  selectedAirlines: string[];
  onAirlineChange: (airline: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  minDeparture: string;
  maxDeparture: string;
  onMinDepartureChange: (value: string) => void;
  onMaxDepartureChange: (value: string) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export default function FlightFilters({
  selectedAirlines,
  onAirlineChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minDeparture,
  maxDeparture,
  onMinDepartureChange,
  onMaxDepartureChange,
  minRating,
  onRatingChange,
}: FlightFiltersProps) {
  return (
    <aside className="space-y-10 pr-6 border-r border-foreground/10 h-full">
      <h2 className="text-xl font-bold text-foreground mb-8">Filters</h2>

      {/* Price Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Price</h3>
          <ChevronUp className="w-4 h-4 text-black" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5">Min</label>
            <input
              type="number"
              placeholder="e.g. 500000"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5">Max</label>
            <input
              type="number"
              placeholder="e.g. 2000000"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
        </div>
        <p className="text-[11px] text-foreground/40">Leave empty to show all prices</p>
      </div>

      {/* Departure Time Filter */}
      <div className="space-y-4 pt-4 border-t border-foreground/10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Departure Time</h3>
          <ChevronUp className="w-4 h-4 text-black" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5">From</label>
            <input
              type="time"
              value={minDeparture}
              onChange={(e) => onMinDepartureChange(e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-foreground/60 mb-1.5">To</label>
            <input
              type="time"
              value={maxDeparture}
              onChange={(e) => onMaxDepartureChange(e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
        </div>
        <p className="text-[11px] text-foreground/40">Leave empty to show all departure times</p>
      </div>

      {/* Rating Filter */}
      <div className="space-y-6 pt-4 border-t border-foreground/10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Rating</h3>
          <ChevronUp className="w-4 h-4 text-black" />
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((rate) => (
            <button 
              key={rate} 
              onClick={() => onRatingChange(rate)}
              className={`flex-1 py-1.5 border rounded text-xs font-bold transition-colors ${
                minRating === rate 
                  ? "bg-primary text-white border-primary" 
                  : "border-primary text-foreground hover:bg-primary/10"
              }`}
            >
              {rate}+
            </button>
          ))}
        </div>
      </div>

      {/* Airlines Filter */}
      <div className="space-y-6 pt-4 border-t border-foreground/10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Airlines</h3>
          <ChevronUp className="w-4 h-4 text-black" />
        </div>
        <div className="space-y-4">
          {['Emirates', 'Fly Dubai', 'Qatar', 'Etihad'].map((airline) => (
            <label key={airline} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedAirlines.includes(airline)}
                onChange={() => onAirlineChange(airline)}
                className="w-4 h-4 rounded-sm border-foreground/20 text-primary focus:ring-primary accent-primary" 
              />
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Trips Filter */}
      <div className="space-y-6 pt-4 border-t border-foreground/10 pb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Trips</h3>
          <ChevronUp className="w-4 h-4 text-black" />
        </div>
        <div className="space-y-4">
          {['Round trip', 'On Way', 'Multi-City', 'My Dates Are Flexible'].map((trip) => (
            <label key={trip} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-sm border-foreground/20 text-primary focus:ring-primary accent-primary" />
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{trip}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}

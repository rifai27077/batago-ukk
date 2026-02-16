"use client";

import { ChevronUp } from "lucide-react";

interface StaysFiltersProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  selectedAmenities: string[];
  onAmenityChange: (amenity: string) => void;
  selectedFreebies: string[];
  onFreebieChange: (freebie: string) => void;
}

export default function StaysFilters({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minRating,
  onRatingChange,
  selectedAmenities,
  onAmenityChange,
  selectedFreebies,
  onFreebieChange
}: StaysFiltersProps) {
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

      {/* Freebies Filter */}
      <div className="space-y-6 pt-4 border-t border-foreground/10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Freebies</h3>
          <ChevronUp className="w-4 h-4 text-black" />
        </div>
        <div className="space-y-4">
          {['Free breakfast', 'Free parking', 'Free internet', 'Free cancellation'].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedFreebies.includes(item)}
                onChange={() => onFreebieChange(item)}
                className="w-4 h-4 rounded-sm border-foreground/20 text-primary focus:ring-primary accent-primary" 
              />
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="space-y-6 pt-4 border-t border-foreground/10 pb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Amenities</h3>
          <ChevronUp className="w-4 h-4 text-black" />
        </div>
        <div className="space-y-4">
          {['24hr front desk', 'Air-conditioned', 'Fitness', 'Pool'].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedAmenities.includes(item)}
                onChange={() => onAmenityChange(item)}
                className="w-4 h-4 rounded-sm border-foreground/20 text-primary focus:ring-primary accent-primary" 
              />
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}

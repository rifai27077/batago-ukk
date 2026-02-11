"use client";

import { Search, ArrowLeftRight, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ListingSearchHeader() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "Jakarta (CGK)";
  const to = searchParams.get("to") || "Bali (DPS)";
  const depart = searchParams.get("depart") || "2026-05-15";
  const returnDate = searchParams.get("return");
  const passengers = searchParams.get("passengers") || "1";
  const cabinClass = searchParams.get("class") || "economy";

  const dateDisplay = returnDate ? `${depart} - ${returnDate}` : depart;
  const passengerDisplay = `${passengers} Passenger, ${cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1)}`;
  const tripType = returnDate ? "Return" : "One Way";

  return (
    <div className="bg-white shadow-[0_4px_16px_rgba(17,34,17,0.05)] rounded-2xl p-4 md:p-5 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-3 items-end">
        
        {/* From - To */}
        <div className="lg:col-span-3">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-foreground font-semibold z-10">From - To</label>
            <div className="flex items-center gap-2 border border-foreground/20 rounded px-3 py-2.5 hover:border-primary focus-within:border-primary transition-all">
              <input 
                type="text" 
                defaultValue={`${from} - ${to}`}
                className="w-full text-sm font-semibold text-foreground bg-transparent outline-none placeholder:text-muted"
                readOnly
              />
              <ArrowLeftRight className="w-4 h-4 text-foreground shrink-0" />
            </div>
          </div>
        </div>

        {/* Trip Type */}
        <div className="lg:col-span-2">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-foreground font-semibold z-10">Trip</label>
            <div className="relative">
              <select 
                className="w-full appearance-none border border-foreground/20 rounded px-3 py-2.5 text-sm font-semibold text-foreground bg-transparent outline-none focus:border-primary transition-all pr-10"
                defaultValue={tripType}
                disabled
              >
                <option value="Return">Return</option>
                <option value="One Way">One Way</option>
              </select>
              <ChevronDown className="w-4 h-4 text-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Depart - Return */}
        <div className="lg:col-span-3">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-foreground font-semibold z-10">Depart - Return</label>
            <div className="flex items-center gap-2 border border-foreground/20 rounded px-3 py-2.5 hover:border-primary focus-within:border-primary transition-all">
              <input 
                type="text" 
                defaultValue={dateDisplay} 
                className="w-full text-sm font-semibold text-foreground bg-transparent outline-none"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Passenger - Class */}
        <div className="lg:col-span-3">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-foreground font-semibold z-10">Passenger - Class</label>
            <div className="flex items-center gap-3 border border-foreground/20 rounded px-3 py-2.5 hover:border-primary focus-within:border-primary transition-all">
              <input 
                type="text" 
                defaultValue={passengerDisplay} 
                className="w-full text-sm font-semibold text-foreground bg-transparent outline-none"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1">
          <button className="w-full h-[41px] bg-primary hover:bg-primary-hover text-white rounded flex items-center justify-center transition-all">
            <Search className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}

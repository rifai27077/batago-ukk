"use client";

import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function StaysListingSearchHeader() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "Bali, Indonesia";
  const checkIn = searchParams.get("checkIn") || "2026-05-15";
  const checkOut = searchParams.get("checkOut") || "2026-05-20";
  const guests = searchParams.get("guests") || "2";
  const rooms = searchParams.get("rooms") || "1";

  const dateDisplay = `${checkIn} - ${checkOut}`;
  const guestDisplay = `${guests} Guests, ${rooms} Room`;

  return (
    <div className="bg-white shadow-[0_4px_16px_rgba(17,34,17,0.05)] rounded-2xl p-4 md:p-5 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-3 items-end">
        
        {/* Destination */}
        <div className="lg:col-span-4">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-foreground font-semibold z-10">Destination</label>
            <div className="flex items-center gap-2 border border-foreground/20 rounded px-3 py-2.5 hover:border-primary focus-within:border-primary transition-all">
              <MapPin className="w-4 h-4 text-foreground shrink-0" />
              <input 
                type="text" 
                defaultValue={location}
                className="w-full text-sm font-semibold text-foreground bg-transparent outline-none placeholder:text-muted"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Check-in - Check-out */}
        <div className="lg:col-span-4">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-foreground font-semibold z-10">Check-in - Check-out</label>
            <div className="flex items-center gap-2 border border-foreground/20 rounded px-3 py-2.5 hover:border-primary focus-within:border-primary transition-all">
              <Calendar className="w-4 h-4 text-foreground shrink-0" />
              <input 
                type="text" 
                defaultValue={dateDisplay} 
                className="w-full text-sm font-semibold text-foreground bg-transparent outline-none"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Rooms & Guests */}
        <div className="lg:col-span-3">
          <div className="relative group">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-foreground font-semibold z-10">Rooms & Guests</label>
            <div className="flex items-center gap-3 border border-foreground/20 rounded px-3 py-2.5 hover:border-primary focus-within:border-primary transition-all">
              <Users className="w-4 h-4 text-foreground shrink-0" />
              <input 
                type="text" 
                defaultValue={guestDisplay} 
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

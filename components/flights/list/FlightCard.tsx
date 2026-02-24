"use client";

import Image from "next/image";
import Link from "next/link";

interface FlightCardProps {
  airline: string;
  logo: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  type: string;
  route: string;
  price: string;
  rating: number;
  reviews: number;
  id?: number;
  isFavourite?: boolean;
  onToggle?: () => void;
}

export default function FlightCard({
  airline,
  logo,
  departureTime,
  arrivalTime,
  duration,
  type,
  route,
  price,
  rating,
  reviews,
  id = 1,
  isFavourite = false,
  onToggle,
}: FlightCardProps) {
  return (
    <div className="bg-white rounded-[12px] shadow-[0_4px_16px_rgba(17,34,17,0.05)] p-0 hover:shadow-[0_4px_24px_rgba(17,34,17,0.08)] transition-all flex flex-col lg:flex-row overflow-hidden border border-foreground/5">
      {/* Airline Logo Section */}
      <div className="p-6 lg:p-8 flex items-center justify-center lg:w-48 shrink-0 border-b lg:border-b-0 lg:border-r border-foreground/5">
        <div className="relative w-24 h-24 lg:w-32 lg:h-32">
          <Image 
            src={logo} 
            alt={airline} 
            fill 
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
        {/* Top: Rating and Meta */}
        <div className="flex items-start justify-between mb-8">
           <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 border border-primary text-foreground text-xs font-bold rounded-[4px]">
                    {rating.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-foreground">Very Good</span>
                <span className="text-sm text-foreground/50 font-medium">{reviews} reviews</span>
           </div>
           {/* starts from (desktop view) */}
           <div className="hidden lg:block text-right">
                <p className="text-[10px] text-foreground/50 font-bold tracking-wider">Starting From</p>
                <p className="text-xl font-bold text-secondary">{price}</p>
           </div>
        </div>

        {/* Middle: Flight Times and Route */}
        <div className="space-y-6">
             {/* Flight Row 1 */}
             <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <input type="checkbox" className="w-5 h-5 border-foreground/20 rounded-[4px] accent-primary cursor-pointer" />
                    <div>
                        <p className="text-lg font-bold text-foreground leading-none">{departureTime} - {arrivalTime}</p>
                        <p className="text-xs text-foreground/40 font-bold mt-1 tracking-tight">{airline}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-foreground/60">{type}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground/80">{duration}</span>
                    <span className="text-xs text-foreground/40 font-bold mt-1 tracking-tight">{route}</span>
                </div>
             </div>

             {/* Flight Row 2 (Mocking return) */}
             <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <input type="checkbox" className="w-5 h-5 border-foreground/20 rounded-[4px] accent-primary cursor-pointer" />
                    <div>
                        <p className="text-lg font-bold text-foreground leading-none">{departureTime} - {arrivalTime}</p>
                        <p className="text-xs text-foreground/40 font-bold mt-1 tracking-tight">{airline}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-foreground/60">{type}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground/80">{duration}</span>
                    <span className="text-xs text-foreground/40 font-bold mt-1 tracking-tight">{route}</span>
                </div>
             </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 pt-8 border-t border-foreground/5 flex items-center gap-4">
             <button 
                onClick={(e) => {
                  e.preventDefault();
                  onToggle?.();
                }}
                className={`w-12 h-12 rounded-[4px] border ${isFavourite ? "bg-primary/10 border-primary text-primary" : "border-foreground/10 text-foreground"} flex items-center justify-center hover:bg-foreground/5 transition-colors shrink-0`}
             >
                <svg className={`w-5 h-5 ${isFavourite ? "fill-primary" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
             </button>
              <Link href="/flights/list/1" className="flex-1 bg-primary hover:bg-primary/80 text-white font-bold py-3.5 px-6 rounded-[4px] transition-all text-sm tracking-wider flex items-center justify-center">
                View Deals
              </Link>
        </div>
      </div>
    </div>
  );
}

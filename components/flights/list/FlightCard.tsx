"use client";

import Image from "next/image";
import Link from "next/link";
import { Plane, Clock, ShieldCheck, Briefcase } from "lucide-react";

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
  const routes = route.split(" - ");
  const fromCity = routes[0] || "From";
  const toCity = routes[1] || "To";

  return (
    <div className="bg-white rounded-[16px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-0 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all overflow-hidden border border-gray-100 mb-4 group">
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Side: Flight Info */}
        <div className="flex-1 p-5 md:p-6 pb-4 lg:pb-6">
           
           {/* Header: Airline & Tags */}
           <div className="flex items-center gap-4 mb-6">
              <div className="relative w-10 h-10 md:w-12 md:h-12 border border-gray-100 rounded-full bg-white p-1 shadow-sm shrink-0 overflow-hidden">
                <div className="w-full h-full rounded-full bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {airline ? airline.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'FL'}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">{airline}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted font-medium">
                   <span className="flex items-center gap-1 text-green-600"><ShieldCheck className="w-3 h-3" /> Extra safe</span>
                   <span>•</span>
                   <span>Flight ID-{id}10</span>
                </div>
              </div>
           </div>

           {/* Middle: Timeline row (Outbound) */}
           <div className="flex items-center justify-between w-full">
               
               {/* Depart */}
               <div className="text-left w-1/4">
                 <p className="text-2xl font-black text-foreground tracking-tight">{departureTime}</p>
                 <p className="text-xs font-bold text-muted uppercase mt-1">{fromCity}</p>
               </div>

               {/* Timeline graphic */}
               <div className="flex-1 flex flex-col items-center px-4 relative">
                  <p className="text-xs font-bold text-foreground bg-gray-100 px-3 py-1 rounded-full z-10 mb-2">{duration}</p>
                  <div className="w-full flex items-center relative z-0">
                     <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                     <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                     <Plane className="w-4 h-4 text-gray-300 absolute left-1/2 -translate-x-1/2 -top-1.5" />
                     <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-primary/20"></div>
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase mt-2">{type}</p>
               </div>

               {/* Arrive */}
               <div className="text-right w-1/4">
                 <p className="text-2xl font-black text-foreground tracking-tight">{arrivalTime}</p>
                 <p className="text-xs font-bold text-muted uppercase mt-1">{toCity}</p>
               </div>

           </div>

           {/* Features / Baggage */}
           <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted bg-gray-50 px-2.5 py-1 rounded-md">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Cabin 7kg</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted bg-gray-50 px-2.5 py-1 rounded-md">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Baggage 20kg</span>
              </div>
           </div>

        </div>

        {/* Right Side: Price & Action */}
        <div className="lg:w-64 bg-gray-50/80 p-5 md:p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-gray-100">
           
           <div className="text-left lg:text-center">
             <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Total Price</p>
             <p className="text-2xl font-black text-secondary leading-none">{price}</p>
             <p className="text-[10px] text-muted mt-1 font-medium">per pax / includes tax</p>
           </div>

           <div className="flex items-center gap-3 lg:w-full lg:mt-6">
              {/* Heart icon */}
              <button 
                 onClick={(e) => {
                   e.preventDefault();
                   onToggle?.();
                 }}
                 className={`w-10 h-10 rounded-full ${isFavourite ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-white text-gray-400 hover:bg-gray-100 border border-gray-200"} flex items-center justify-center transition-colors shrink-0 shadow-sm`}
              >
                 <svg className={`w-5 h-5 ${isFavourite ? "fill-red-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
              </button>
              
              <Link href="/flights/list/1" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm shadow-md shadow-primary/20 hover:-translate-y-0.5 text-center w-full block">
                Select
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users, Plane, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ListingSearchHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const from = searchParams.get("from") || "Jakarta (CGK)";
  const to = searchParams.get("to") || "Bali (DPS)";
  const depart = searchParams.get("depart") || "2026-05-15";
  const returnDate = searchParams.get("return");
  const passengers = searchParams.get("passengers") || "1";
  const cabinClass = searchParams.get("class") || "economy";

  const dateDisplay = returnDate ? `${depart} - ${returnDate}` : depart;
  const passengerDisplay = `${passengers} Passenger • ${cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1)}`;
  const tripType = returnDate ? "Round Trip" : "One Way";

  // State to simulate expanding to full search
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-[20px] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] mx-auto max-w-7xl relative z-20 border border-gray-100 overflow-hidden transition-all duration-300">
       
       <div className="p-4 md:p-5">
           {!isExpanded ? (
               // Compact / Summary View
               <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  
                  <div className="flex flex-1 flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
                     
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                           <Plane className="w-6 h-6 text-primary rotate-45" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                             <p className="text-sm font-bold text-foreground">{from}</p>
                             <span className="text-muted">→</span>
                             <p className="text-sm font-bold text-foreground">{to}</p>
                           </div>
                           <p className="text-xs text-muted font-medium mt-0.5">{tripType}</p>
                        </div>
                     </div>

                     <div className="hidden md:block h-10 w-px bg-gray-200"></div>

                     <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start pl-16 md:pl-0">
                       <div>
                         <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Date</p>
                         <p className="text-sm font-bold text-foreground mt-0.5">{dateDisplay}</p>
                       </div>
                       <div>
                         <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Passengers</p>
                         <p className="text-sm font-bold text-foreground mt-0.5">{passengerDisplay}</p>
                       </div>
                     </div>

                  </div>

                  <button 
                     onClick={() => setIsExpanded(true)}
                     className="w-full md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                     Change Search
                  </button>

               </div>
           ) : (
               // Expanded Mock View (just redirecting to homepage or simulating form)
               <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-lg text-foreground">Change Flight Search</h3>
                     <button onClick={() => setIsExpanded(false)} className="text-sm font-bold text-primary hover:underline">Cancel</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                     <div className="md:col-span-1 border border-gray-200 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-bold text-muted uppercase">From</p>
                        <input className="w-full text-sm font-bold text-foreground outline-none mt-1" defaultValue={from} />
                     </div>
                     <div className="md:col-span-1 border border-gray-200 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-bold text-muted uppercase">To</p>
                        <input className="w-full text-sm font-bold text-foreground outline-none mt-1" defaultValue={to} />
                     </div>
                     <div className="md:col-span-1 border border-gray-200 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-bold text-muted uppercase">Date</p>
                        <input type="date" className="w-full text-sm font-bold text-foreground outline-none mt-1" defaultValue={depart} />
                     </div>
                     <div className="md:col-span-1">
                        <button onClick={() => { setIsExpanded(false); router.refresh(); }} className="w-full h-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                           <Search className="w-5 h-5" /> Search
                        </button>
                     </div>
                  </div>
               </div>
           )}
       </div>

    </div>
  );
}

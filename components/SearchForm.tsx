"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plane, 
  Bed, 
  User, 
  Users, 
  Calendar, 
  Search, 
  MapPin, 
  Circle, 
  ArrowLeftRight, 
  Tag,
  Minus,
  Plus,
  ChevronDown,
  Building,
  Navigation
} from "lucide-react";

type TabType = "flights" | "hotels";
type CabinClass = "economy" | "business" | "first";

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface HotelGuests {
  rooms: number;
  adults: number;
  children: number;
}

// Dummy data for autosuggest
const flightAirports = [
  { code: "CGK", name: "Soekarno-Hatta International", city: "Jakarta", country: "Indonesia" },
  { code: "DPS", name: "Ngurah Rai International", city: "Bali", country: "Indonesia" },
  { code: "JOG", name: "Adisucipto International", city: "Yogyakarta", country: "Indonesia" },
  { code: "SUB", name: "Juanda International", city: "Surabaya", country: "Indonesia" },
  { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "KUL", name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "Malaysia" },
];

const hotelCities = [
  { name: "Bali", country: "Indonesia", type: "Region" },
  { name: "Jakarta", country: "Indonesia", type: "City" },
  { name: "Bandung", country: "Indonesia", type: "City" },
  { name: "Yogyakarta", country: "Indonesia", type: "City" },
  { name: "Singapore", country: "Singapore", type: "City" },
  { name: "Tokyo", country: "Japan", type: "City" },
];

const CounterButton = ({ onDecrement, onIncrement, value, minDisabled }: { onDecrement: () => void; onIncrement: () => void; value: number; minDisabled: boolean }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onDecrement(); }}
      disabled={minDisabled}
      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${minDisabled ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-primary text-primary hover:bg-primary hover:text-white"}`}
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="w-6 text-center font-semibold text-foreground">{value}</span>
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onIncrement(); }}
      className="w-8 h-8 rounded-full border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

export default function SearchForm({ mode = "all" }: { mode?: "all" | "flights" | "hotels" }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(mode === "hotels" ? "hotels" : "flights");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
  
  // Dropdown UI states
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  // Search State
  const [fromLocation, setFromLocation] = useState(flightAirports[0]);
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  
  const [toLocation, setToLocation] = useState(flightAirports[1]);
  const [toSearchQuery, setToSearchQuery] = useState("");

  const [departDate, setDepartDate] = useState("2026-05-15");
  const [returnDate, setReturnDate] = useState("2026-05-20");

  const [passengers, setPassengers] = useState<Passengers>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [hotelGuests, setHotelGuests] = useState<HotelGuests>({
    rooms: 1,
    adults: 2,
    children: 0,
  });

  // Hotel search state
  const [location, setLocation] = useState(hotelCities[0]);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("2026-05-15");
  const [checkOut, setCheckOut] = useState("2026-05-20");

  const passengerRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) setShowPassengerDropdown(false);
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) setShowGuestDropdown(false);
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) setShowFromDropdown(false);
      if (toRef.current && !toRef.current.contains(event.target as Node)) setShowToDropdown(false);
      if (locRef.current && !locRef.current.contains(event.target as Node)) setShowLocationDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const totalGuests = hotelGuests.adults + hotelGuests.children;

  const updatePassenger = (type: keyof Passengers, increment: boolean) => {
    setPassengers((prev) => {
      const newValue = increment ? prev[type] + 1 : prev[type] - 1;
      if (type === "adults" && newValue < 1) return prev;
      if (type === "adults" && newValue > 9) return prev;
      if (type === "children" && newValue < 0) return prev;
      if (type === "children" && newValue > 9) return prev;
      if (type === "infants" && newValue < 0) return prev;
      if (type === "infants" && newValue > prev.adults) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const updateHotelGuests = (type: keyof HotelGuests, increment: boolean) => {
    setHotelGuests((prev) => {
      const newValue = increment ? prev[type] + 1 : prev[type] - 1;
      if (type === "rooms" && newValue < 1) return prev;
      if (type === "rooms" && newValue > 8) return prev;
      if (type === "adults" && newValue < 1) return prev;
      if (type === "adults" && newValue > 16) return prev;
      if (type === "children" && newValue < 0) return prev;
      if (type === "children" && newValue > 6) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const handleSearch = () => {
    if (activeTab === "flights") {
      const sp = new URLSearchParams({
        from: `${fromLocation.city} (${fromLocation.code})`,
        to: `${toLocation.city} (${toLocation.code})`,
        depart: departDate,
        return: tripType === "roundtrip" ? returnDate : "",
        passengers: totalPassengers.toString(),
        class: cabinClass
      });
      router.push(`/flights/list?${sp.toString()}`);
    } else {
      const sp = new URLSearchParams({
        location: location.name,
        checkIn: checkIn,
        checkOut: checkOut,
        rooms: hotelGuests.rooms.toString(),
        guests: totalGuests.toString()
      });
      router.push(`/stays/list?${sp.toString()}`);
    }
  };

  const cabinClasses: { value: CabinClass; label: string }[] = [
    { value: "economy", label: "Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First Class" },
  ];

  return (
    <div className="bg-white rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] max-w-6xl mx-auto relative z-10 font-sans border border-gray-100">
      {/* Search Header / Tabs */}
      {mode === "all" ? (
        <div className="flex border-b border-gray-100 bg-gray-50/50 rounded-t-[24px]">
          <button
            onClick={() => setActiveTab("flights")}
            className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-bold transition-all relative rounded-tl-[24px] ${activeTab === "flights" ? "text-primary bg-white" : "text-muted hover:text-foreground hover:bg-white/50"}`}
          >
            <Plane className={`w-5 h-5 ${activeTab === "flights" ? "text-primary" : "text-muted"}`} />
            Flights
            {activeTab === "flights" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary" />}
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-bold transition-all relative rounded-tr-[24px] ${activeTab === "hotels" ? "text-primary bg-white" : "text-muted hover:text-foreground hover:bg-white/50"}`}
          >
            <Bed className={`w-5 h-5 ${activeTab === "hotels" ? "text-primary" : "text-muted"}`} />
            Hotels & Homes
            {activeTab === "hotels" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary" />}
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/10 p-5 flex items-center gap-3 text-primary font-bold rounded-t-[24px]">
          {mode === "flights" ? (
             <><Plane className="w-5 h-5" /> Search Flights</>
          ) : (
             <><Bed className="w-5 h-5" /> Find the Perfect Stay</>
          )}
        </div>
      )}

      <div className="p-6 md:p-8">
        {activeTab === "flights" ? (
          <div className="space-y-6">
            {/* Options Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex bg-gray-100/80 p-1 rounded-full w-fit">
                <button
                  onClick={() => setTripType("roundtrip")}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tripType === "roundtrip" ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                >
                  Round-trip
                </button>
                <button
                  onClick={() => setTripType("oneway")}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${tripType === "oneway" ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                >
                  One-way
                </button>
              </div>

              <div className="flex gap-2">
                {cabinClasses.map((cls) => (
                  <button
                    key={cls.value}
                    onClick={() => setCabinClass(cls.value)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      cabinClass === cls.value
                        ? "bg-primary/10 text-primary"
                        : "bg-transparent text-muted hover:bg-gray-100"
                    }`}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 relative">
              {/* FROM */}
              <div className="md:col-span-6 lg:col-span-3 border border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-2xl px-4 py-3 relative cursor-pointer group transition-all" ref={fromRef}>
                <div onClick={() => setShowFromDropdown(true)}>
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">From</p>
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary rotate-45 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-foreground truncate text-base leading-tight">
                        {fromLocation.city} ({fromLocation.code})
                      </p>
                      <p className="text-xs text-muted truncate">{fromLocation.name}</p>
                    </div>
                  </div>
                </div>

                {/* From Dropdown */}
                {showFromDropdown && (
                  <div className="absolute top-[110%] left-0 w-full md:w-[350px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                     <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <Search className="w-4 h-4 text-muted" />
                          <input 
                            autoFocus
                            type="text" 
                            className="bg-transparent text-sm w-full outline-none font-medium text-foreground"
                            placeholder="City or airport code"
                            value={fromSearchQuery}
                            onChange={(e) => setFromSearchQuery(e.target.value)}
                          />
                        </div>
                     </div>
                     <div className="max-h-64 overflow-y-auto p-2">
                       <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2">Popular Cities</p>
                       {flightAirports.filter(a => a.city.toLowerCase().includes(fromSearchQuery.toLowerCase()) || a.code.toLowerCase().includes(fromSearchQuery.toLowerCase())).map((apt) => (
                          <div 
                            key={apt.code} 
                            onClick={() => { 
                              if (apt.code === toLocation.code) setToLocation(fromLocation);
                              setFromLocation(apt); 
                              setShowFromDropdown(false); 
                            }}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                          >
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                 <Navigation className="w-4 h-4 text-muted" />
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-foreground leading-tight">{apt.city}, {apt.country}</p>
                                 <p className="text-xs text-muted mt-0.5">{apt.name}</p>
                               </div>
                             </div>
                             <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-muted">{apt.code}</span>
                          </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>

              {/* Swap Button - Absolute centered safely on desktop */}
              <div className="hidden lg:flex absolute left-[25%] top-1/2 -translate-y-1/2 -ml-[20px] z-20 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center cursor-pointer hover:shadow-md hover:border-primary/50 transition-all text-primary"
                   onClick={() => {
                      const temp = fromLocation;
                      setFromLocation(toLocation);
                      setToLocation(temp);
                   }}>
                 <ArrowLeftRight className="w-4 h-4" />
              </div>

              {/* Mobile swap */}
              <div className="lg:hidden flex justify-center -my-3 relative z-20">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-primary shadow-sm"
                     onClick={() => {
                        const temp = fromLocation;
                        setFromLocation(toLocation);
                        setToLocation(temp);
                     }}>
                   <ArrowLeftRight className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* TO */}
              <div className="md:col-span-6 lg:col-span-3 border border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-2xl px-4 py-3 relative cursor-pointer group transition-all" ref={toRef}>
                 <div onClick={() => setShowToDropdown(true)}>
                    <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">To</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-secondary shrink-0" />
                      <div className="overflow-hidden">
                        <p className="font-bold text-foreground truncate text-base leading-tight">
                          {toLocation.city} ({toLocation.code})
                        </p>
                        <p className="text-xs text-muted truncate">{toLocation.name}</p>
                      </div>
                    </div>
                 </div>

                 {/* To Dropdown */}
                {showToDropdown && (
                  <div className="absolute top-[110%] left-0 w-full md:w-[350px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                     <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <Search className="w-4 h-4 text-muted" />
                          <input 
                            autoFocus
                            type="text" 
                            className="bg-transparent text-sm w-full outline-none font-medium text-foreground"
                            placeholder="City or airport code"
                            value={toSearchQuery}
                            onChange={(e) => setToSearchQuery(e.target.value)}
                          />
                        </div>
                     </div>
                     <div className="max-h-64 overflow-y-auto p-2">
                       <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2">Popular Cities</p>
                       {flightAirports.filter(a => a.city.toLowerCase().includes(toSearchQuery.toLowerCase()) || a.code.toLowerCase().includes(toSearchQuery.toLowerCase())).map((apt) => (
                          <div 
                            key={apt.code} 
                            onClick={() => { 
                              if (apt.code === fromLocation.code) setFromLocation(toLocation);
                              setToLocation(apt); 
                              setShowToDropdown(false); 
                            }}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                          >
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                 <Navigation className="w-4 h-4 text-muted" />
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-foreground leading-tight">{apt.city}, {apt.country}</p>
                                 <p className="text-xs text-muted mt-0.5">{apt.name}</p>
                               </div>
                             </div>
                             <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-muted">{apt.code}</span>
                          </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>

              {/* DATES */}
              <div className="md:col-span-6 lg:col-span-4 border border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-2xl px-4 py-3 group transition-all relative">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  {tripType === "roundtrip" ? "Depart - Return" : "Depart Date"}
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      type="date"
                      value={departDate} 
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="w-full text-sm font-bold text-foreground bg-transparent outline-none appearance-none" 
                    />
                    {tripType === "roundtrip" && (
                      <>
                        <span className="text-muted shrink-0">-</span>
                        <input 
                          type="date"
                          value={returnDate} 
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full text-sm font-bold text-foreground bg-transparent outline-none appearance-none" 
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* PASSENGERS */}
              <div className="md:col-span-6 lg:col-span-2 border border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-2xl px-3 py-3 group transition-all relative cursor-pointer" ref={passengerRef}>
                <div onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}>
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Passengers</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      <p className="font-bold text-foreground text-sm truncate shrink-0">
                        {totalPassengers} Px
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted transition-transform shrink-0 ${showPassengerDropdown ? "rotate-180 text-primary" : ""}`} />
                  </div>
                </div>

                {/* Passenger Dropdown */}
                {showPassengerDropdown && (
                  <div className="absolute top-[110%] right-0 w-full md:w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">Adults</p>
                          <p className="text-xs text-muted font-medium">Age 12+</p>
                        </div>
                        <CounterButton value={passengers.adults} onDecrement={() => updatePassenger("adults", false)} onIncrement={() => updatePassenger("adults", true)} minDisabled={passengers.adults <= 1} />
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                        <div>
                          <p className="font-bold text-foreground">Children</p>
                          <p className="text-xs text-muted font-medium">Age 2-11</p>
                        </div>
                        <CounterButton value={passengers.children} onDecrement={() => updatePassenger("children", false)} onIncrement={() => updatePassenger("children", true)} minDisabled={passengers.children <= 0} />
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                        <div>
                          <p className="font-bold text-foreground">Infants</p>
                          <p className="text-xs text-muted font-medium">Under 2 (on lap)</p>
                        </div>
                        <CounterButton value={passengers.infants} onDecrement={() => updatePassenger("infants", false)} onIncrement={() => updatePassenger("infants", true)} minDisabled={passengers.infants <= 0} />
                      </div>
                      
                      <button type="button" onClick={() => setShowPassengerDropdown(false)} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors mt-2">
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ---------------
             HOTEL MODE 
             --------------- */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              
              {/* LOCATION */}
              <div className="md:col-span-6 lg:col-span-5 border border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-2xl px-4 py-3 relative cursor-pointer group transition-all" ref={locRef}>
                <div onClick={() => setShowLocationDropdown(true)}>
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Destination</p>
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-base truncate leading-tight">
                        {location.name}
                      </p>
                      <p className="text-xs text-muted truncate">{location.type} • {location.country}</p>
                    </div>
                  </div>
                </div>

                {showLocationDropdown && (
                  <div className="absolute top-[110%] left-0 w-full md:w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                     <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <Search className="w-4 h-4 text-muted" />
                          <input 
                            autoFocus
                            type="text" 
                            className="bg-transparent text-sm w-full outline-none font-medium text-foreground"
                            placeholder="Search city, region, or landmark"
                            value={locationSearchQuery}
                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                          />
                        </div>
                     </div>
                     <div className="max-h-64 overflow-y-auto p-2">
                       <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2">Popular Destinations</p>
                       {hotelCities.filter(a => a.name.toLowerCase().includes(locationSearchQuery.toLowerCase())).map((cty, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => { setLocation(cty); setShowLocationDropdown(false); }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                          >
                             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                               <MapPin className="w-5 h-5 text-primary" />
                             </div>
                             <div>
                               <p className="text-sm font-bold text-foreground">{cty.name}</p>
                               <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-muted mt-0.5 inline-block">{cty.type}</span>
                               <span className="text-xs text-muted ml-2">{cty.country}</span>
                             </div>
                          </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>

              {/* DATES */}
              <div className="md:col-span-6 lg:col-span-4 border border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-2xl px-4 py-3 group transition-all relative">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Check-in - Check-out</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      type="date"
                      value={checkIn} 
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-sm font-bold text-foreground bg-transparent outline-none appearance-none" 
                    />
                    <span className="text-muted shrink-0">-</span>
                    <input 
                      type="date"
                      value={checkOut} 
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-sm font-bold text-foreground bg-transparent outline-none appearance-none" 
                    />
                  </div>
                </div>
              </div>

              {/* GUESTS */}
              <div className="md:col-span-6 lg:col-span-3 border border-gray-200 hover:border-primary/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-2xl px-3 py-3 group transition-all relative cursor-pointer" ref={guestRef}>
                <div onClick={() => setShowGuestDropdown(!showGuestDropdown)}>
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Guests & Rooms</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary shrink-0" />
                      <div className="overflow-hidden">
                        <p className="font-bold text-foreground text-sm truncate leading-tight shrink-0">
                          {totalGuests} Guest{totalGuests > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted transition-transform shrink-0 ${showGuestDropdown ? "rotate-180 text-primary" : ""}`} />
                  </div>
                </div>

                {/* Guest Dropdown */}
                {showGuestDropdown && (
                  <div className="absolute top-[110%] right-0 w-full md:w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">Rooms</p>
                        </div>
                        <CounterButton value={hotelGuests.rooms} onDecrement={() => updateHotelGuests("rooms", false)} onIncrement={() => updateHotelGuests("rooms", true)} minDisabled={hotelGuests.rooms <= 1} />
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                        <div>
                          <p className="font-bold text-foreground">Adults</p>
                          <p className="text-xs text-muted font-medium">Age 18+</p>
                        </div>
                        <CounterButton value={hotelGuests.adults} onDecrement={() => updateHotelGuests("adults", false)} onIncrement={() => updateHotelGuests("adults", true)} minDisabled={hotelGuests.adults <= 1} />
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                        <div>
                          <p className="font-bold text-foreground">Children</p>
                          <p className="text-xs text-muted font-medium">0-17 years</p>
                        </div>
                        <CounterButton value={hotelGuests.children} onDecrement={() => updateHotelGuests("children", false)} onIncrement={() => updateHotelGuests("children", true)} minDisabled={hotelGuests.children <= 0} />
                      </div>
                      
                      <button type="button" onClick={() => setShowGuestDropdown(false)} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors mt-2">
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Global Action Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Promo */}
          <div className="flex items-center gap-2 group cursor-pointer w-full sm:w-auto">
             <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
               <Tag className="w-4 h-4 text-green-600" />
             </div>
             <div>
               <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Apply Promo Code</p>
               <p className="text-[10px] text-muted uppercase font-bold">Save more on your booking</p>
             </div>
          </div>

          <button 
            onClick={handleSearch}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95"
          >
            <Search className="w-5 h-5" />
            Search {activeTab === "flights" ? "Flights" : "Hotels"}
          </button>
        </div>

      </div>
    </div>
  );
}

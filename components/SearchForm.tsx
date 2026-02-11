"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  ChevronDown
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

const CounterButton = ({ onDecrement, onIncrement, value, minDisabled }: { onDecrement: () => void; onIncrement: () => void; value: number; minDisabled: boolean }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={onDecrement}
      disabled={minDisabled}
      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${minDisabled ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-primary text-primary hover:bg-primary hover:text-white"}`}
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="w-6 text-center font-semibold text-foreground">{value}</span>
    <button
      type="button"
      onClick={onIncrement}
      className="w-8 h-8 rounded-full border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

export default function SearchForm() {
  const [activeTab, setActiveTab] = useState<TabType>("flights");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  
  // Search State
  const [fromLocation, setFromLocation] = useState("Jakarta (CGK)");
  const [toLocation, setToLocation] = useState("Bali (DPS)");
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

  const passengerRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setShowPassengerDropdown(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
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

  const cabinClasses: { value: CabinClass; label: string }[] = [
    { value: "economy", label: "Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First Class" },
  ];

  // Construct search URL
  const searchParams = new URLSearchParams({
    from: fromLocation,
    to: toLocation,
    depart: departDate,
    return: tripType === "roundtrip" ? returnDate : "",
    passengers: totalPassengers.toString(),
    class: cabinClass
  });

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto relative z-10">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("flights")}
          className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm font-semibold transition-all ${activeTab === "flights" ? "text-primary bg-primary/5 border-b-2 border-primary" : "text-muted hover:text-foreground hover:bg-gray-50"}`}
        >
          <Plane className="w-5 h-5" />
          Flights
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm font-semibold transition-all ${activeTab === "hotels" ? "text-primary bg-primary/5 border-b-2 border-primary" : "text-muted hover:text-foreground hover:bg-gray-50"}`}
        >
          <Bed className="w-5 h-5" />
          Hotels
        </button>
      </div>

      <div className="p-6">
        {activeTab === "flights" ? (
          <>
            {/* Trip Type & Class Selection - Side by side on desktop */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              {/* Trip Type */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === "roundtrip"}
                    onChange={() => setTripType("roundtrip")}
                    className="w-4 h-4 text-primary accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground">Round Trip</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === "oneway"}
                    onChange={() => setTripType("oneway")}
                    className="w-4 h-4 text-primary accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground">One Way</span>
                </label>
              </div>

              {/* Cabin Class - Next to trip type on desktop */}
              <div className="flex gap-2">
                {cabinClasses.map((cls) => (
                  <button
                    key={cls.value}
                    onClick={() => setCabinClass(cls.value)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      cabinClass === cls.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-muted hover:bg-gray-200"
                    }`}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flight Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* From */}
              <div className="md:col-span-3 relative">
                <label className="text-xs text-muted font-medium mb-1 block">From</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Circle className="w-5 h-5 text-primary shrink-0" />
                  <input 
                    type="text" 
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Jakarta (CGK)" 
                    className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" 
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-end justify-center pb-2">
                <button 
                  onClick={() => {
                    const temp = fromLocation;
                    setFromLocation(toLocation);
                    setToLocation(temp);
                  }}
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ArrowLeftRight className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <label className="text-xs text-muted font-medium mb-1 block">To</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <MapPin className="w-5 h-5 text-secondary shrink-0" />
                  <input 
                    type="text" 
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Bali (DPS)" 
                    className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" 
                  />
                </div>
              </div>

              {/* Departure Date */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted font-medium mb-1 block">Departure</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Calendar className="w-5 h-5 text-muted shrink-0" />
                  <input 
                    type="date"
                    value={departDate} 
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="flex-1 text-sm text-foreground bg-transparent outline-none font-medium" 
                  />
                </div>
              </div>

              {/* Return Date */}
              {tripType === "roundtrip" && (
                <div className="md:col-span-2">
                  <label className="text-xs text-muted font-medium mb-1 block">Return</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Calendar className="w-5 h-5 text-muted shrink-0" />
                    <input 
                        type="date" 
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="flex-1 text-sm text-foreground bg-transparent outline-none font-medium" 
                    />
                  </div>
                </div>
              )}

              {/* Passengers */}
              <div className={tripType === "roundtrip" ? "md:col-span-1" : "md:col-span-3"} ref={passengerRef}>
                <label className="text-xs text-muted font-medium mb-1 block">Passengers</label>
                <div
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary cursor-pointer transition-all relative"
                >
                  <Users className="w-5 h-5 text-muted shrink-0" />
                  <span className="text-sm text-foreground font-medium">{totalPassengers}</span>
                  <ChevronDown className={`w-4 h-4 text-muted ml-auto transition-transform ${showPassengerDropdown ? "rotate-180" : ""}`} />
                </div>

                {showPassengerDropdown && (
                  <div className="absolute mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 w-72 right-0 md:left-auto">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">Adults</p>
                          <p className="text-xs text-muted">Age 12 and above</p>
                        </div>
                        <CounterButton value={passengers.adults} onDecrement={() => updatePassenger("adults", false)} onIncrement={() => updatePassenger("adults", true)} minDisabled={passengers.adults <= 1} />
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="font-semibold text-foreground">Children</p>
                          <p className="text-xs text-muted">Age 2 - 11 years</p>
                        </div>
                        <CounterButton value={passengers.children} onDecrement={() => updatePassenger("children", false)} onIncrement={() => updatePassenger("children", true)} minDisabled={passengers.children <= 0} />
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="font-semibold text-foreground">Infants</p>
                          <p className="text-xs text-muted">Under 2 years (on lap)</p>
                        </div>
                        <CounterButton value={passengers.infants} onDecrement={() => updatePassenger("infants", false)} onIncrement={() => updatePassenger("infants", true)} minDisabled={passengers.infants <= 0} />
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 mt-2">
                        <p className="text-xs text-blue-700"><span className="font-semibold">Note:</span> Maximum infants equals number of adults</p>
                      </div>
                      <button type="button" onClick={() => setShowPassengerDropdown(false)} className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-colors">Done</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Hotel Search Fields */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="text-xs text-muted font-medium mb-1 block">City or hotel name</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-5 h-5 text-primary shrink-0" />
                <input type="text" placeholder="Bali, Indonesia" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted font-medium mb-1 block">Check-in</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Calendar className="w-5 h-5 text-muted shrink-0" />
                <input type="text" placeholder="15 Feb 2026" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted font-medium mb-1 block">Check-out</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Calendar className="w-5 h-5 text-muted shrink-0" />
                <input type="text" placeholder="17 Feb 2026" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
              </div>
            </div>

            <div className="md:col-span-4 relative" ref={guestRef}>
              <label className="text-xs text-muted font-medium mb-1 block">Rooms & Guests</label>
              <div onClick={() => setShowGuestDropdown(!showGuestDropdown)} className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary cursor-pointer transition-all">
                <User className="w-5 h-5 text-muted shrink-0" />
                <span className="text-sm text-foreground font-medium">{hotelGuests.rooms} Room{hotelGuests.rooms > 1 ? "s" : ""}, {totalGuests} Guest{totalGuests > 1 ? "s" : ""}</span>
                <ChevronDown className={`w-4 h-4 text-muted ml-auto transition-transform ${showGuestDropdown ? "rotate-180" : ""}`} />
              </div>

              {showGuestDropdown && (
                <div className="absolute mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 w-72 right-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold text-foreground">Rooms</p><p className="text-xs text-muted">Number of rooms</p></div>
                      <CounterButton value={hotelGuests.rooms} onDecrement={() => updateHotelGuests("rooms", false)} onIncrement={() => updateHotelGuests("rooms", true)} minDisabled={hotelGuests.rooms <= 1} />
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div><p className="font-semibold text-foreground">Adults</p><p className="text-xs text-muted">Age 17 and above</p></div>
                      <CounterButton value={hotelGuests.adults} onDecrement={() => updateHotelGuests("adults", false)} onIncrement={() => updateHotelGuests("adults", true)} minDisabled={hotelGuests.adults <= 1} />
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div><p className="font-semibold text-foreground">Children</p><p className="text-xs text-muted">Age 0 - 17 years</p></div>
                      <CounterButton value={hotelGuests.children} onDecrement={() => updateHotelGuests("children", false)} onIncrement={() => updateHotelGuests("children", true)} minDisabled={hotelGuests.children <= 0} />
                    </div>
                    <button type="button" onClick={() => setShowGuestDropdown(false)} className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">Done</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="mt-6 flex items-center justify-between">
          <button className="text-sm text-primary font-medium flex items-center gap-2 hover:underline">
            <Tag className="w-4 h-4" />
            Have a promo code?
          </button>
          <Link 
            href={`/flights/list?${searchParams.toString()}`} 
            className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search {activeTab === "flights" ? "Flights" : "Hotels"}
          </Link>
        </div>
      </div>
    </div>
  );
}

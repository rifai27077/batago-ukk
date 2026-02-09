"use client";

import { useState, useRef, useEffect } from "react";

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

export default function SearchForm() {
  const [activeTab, setActiveTab] = useState<TabType>("flights");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
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

  const CounterButton = ({ onDecrement, onIncrement, value, minDisabled }: { onDecrement: () => void; onIncrement: () => void; value: number; minDisabled: boolean }) => (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDecrement}
        disabled={minDisabled}
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${minDisabled ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-primary text-primary hover:bg-primary hover:text-white"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="w-6 text-center font-semibold text-foreground">{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        className="w-8 h-8 rounded-full border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );

  const cabinClasses: { value: CabinClass; label: string }[] = [
    { value: "economy", label: "Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First Class" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto relative z-10">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("flights")}
          className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm font-semibold transition-all ${activeTab === "flights" ? "text-primary bg-primary/5 border-b-2 border-primary" : "text-muted hover:text-foreground hover:bg-gray-50"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Flights
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm font-semibold transition-all ${activeTab === "hotels" ? "text-primary bg-primary/5 border-b-2 border-primary" : "text-muted hover:text-foreground hover:bg-gray-50"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
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
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
                  </svg>
                  <input type="text" placeholder="Jakarta (CGK)" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-end justify-center pb-2">
                <button className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <label className="text-xs text-muted font-medium mb-1 block">To</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="text" placeholder="Bali (DPS)" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
                </div>
              </div>

              {/* Departure Date */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted font-medium mb-1 block">Departure</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input type="text" placeholder="15 Feb 2026" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
                </div>
              </div>

              {/* Return Date */}
              {tripType === "roundtrip" && (
                <div className="md:col-span-2">
                  <label className="text-xs text-muted font-medium mb-1 block">Return</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input type="text" placeholder="20 Feb 2026" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
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
                  <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-foreground font-medium">{totalPassengers}</span>
                  <svg className={`w-4 h-4 text-muted ml-auto transition-transform ${showPassengerDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Bali, Indonesia" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted font-medium mb-1 block">Check-in</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="text" placeholder="15 Feb 2026" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted font-medium mb-1 block">Check-out</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="text" placeholder="17 Feb 2026" className="flex-1 text-sm text-foreground placeholder:text-muted bg-transparent outline-none font-medium" />
              </div>
            </div>

            <div className="md:col-span-4 relative" ref={guestRef}>
              <label className="text-xs text-muted font-medium mb-1 block">Rooms & Guests</label>
              <div onClick={() => setShowGuestDropdown(!showGuestDropdown)} className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-primary cursor-pointer transition-all">
                <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-foreground font-medium">{hotelGuests.rooms} Room{hotelGuests.rooms > 1 ? "s" : ""}, {totalGuests} Guest{totalGuests > 1 ? "s" : ""}</span>
                <svg className={`w-4 h-4 text-muted ml-auto transition-transform ${showGuestDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Have a promo code?
          </button>
          <button className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search {activeTab === "flights" ? "Flights" : "Hotels"}
          </button>
        </div>
      </div>
    </div>
  );
}

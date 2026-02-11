"use client";

import Image from "next/image";
import { Plane, Wifi, Info, Tv, Armchair, Clock } from "lucide-react";

interface FlightSegmentCardProps {
  dateLabel: string;
  duration: string;
  airline: string;
  aircraft: string;
  logo: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
}

export default function FlightSegmentCard({
  dateLabel,
  duration,
  airline,
  aircraft,
  logo,
  departureTime,
  departureAirport,
  arrivalTime,
  arrivalAirport,
}: FlightSegmentCardProps) {
  const amenities = [
    { icon: Plane, label: "Flight" },
    { icon: Wifi, label: "Wi-Fi" },
    { icon: Info, label: "Info" },
    { icon: Tv, label: "Entertainment" },
    { icon: Armchair, label: "Seat" },
  ];

  return (
    <section className="py-2 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[12px] border border-foreground/5 shadow-[0_4px_16px_rgba(17,34,17,0.05)] hover:shadow-[0_4px_24px_rgba(17,34,17,0.08)] transition-all duration-300 p-6 lg:p-8">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h3 className="text-lg font-bold text-foreground">{dateLabel}</h3>
            <div className="flex items-center gap-2 text-foreground/60 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {duration}
            </div>
          </div>

          {/* Main Flight Info */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* Airline Identity */}
            <div className="flex items-center gap-4 w-full md:w-auto min-w-[200px]">
              <div className="w-16 h-16 rounded-[4px] border border-foreground/10 bg-white p-3 shadow-sm flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={logo}
                    alt={airline}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{airline}</p>
                <p className="text-sm text-foreground/50 font-medium">
                  {aircraft}
                </p>
              </div>
            </div>

            {/* Flight Graphic */}
            <div className="flex-1 w-full flex items-center justify-between gap-6 px-4">
                <div className="text-center min-w-[80px]">
                    <span className="text-2xl font-bold text-foreground block">{departureTime}</span>
                    <span className="text-xs text-foreground/40 font-bold uppercase tracking-wider">{departureAirport}</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-2 relative">
                     <div className="w-full h-0.5 bg-gray-100 absolute top-1/2 -translate-y-1/2" />
                     <div className="bg-white px-2 z-10 relative">
                        <Plane className="w-6 h-6 text-primary rotate-90" />
                     </div>
                     <span className="text-xs text-foreground/30 font-medium z-10 bg-white px-2">Non-stop</span>
                </div>

                <div className="text-center min-w-[80px]">
                    <span className="text-2xl font-bold text-foreground block">{arrivalTime}</span>
                    <span className="text-xs text-foreground/40 font-bold uppercase tracking-wider">{arrivalAirport}</span>
                </div>
            </div>

            {/* Amenities (Desktop) */}
            <div className="hidden md:flex items-center gap-3 pl-8 border-l border-gray-50">
                {amenities.map((a, idx) => {
                    const Icon = a.icon;
                    return (
                        <div
                            key={idx}
                            className="w-10 h-10 rounded-[4px] bg-gray-50 hover:bg-primary/10 text-foreground/40 hover:text-primary transition-colors flex items-center justify-center cursor-pointer group"
                            title={a.label}
                        >
                            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </div>
                    );
                })}
            </div>

          </div>

          {/* Amenities (Mobile) */}
           <div className="flex md:hidden items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-50">
                {amenities.map((a, idx) => {
                    const Icon = a.icon;
                    return (
                        <div
                            key={idx}
                            className="w-10 h-10 rounded-[4px] bg-gray-50 text-foreground/40 flex items-center justify-center"
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                    );
                })}
            </div>

        </div>
      </div>
    </section>
  );
}

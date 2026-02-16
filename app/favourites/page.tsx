"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaysCard from "@/components/stays/list/StaysCard";
import FlightCard from "@/components/flights/list/FlightCard";

export default function FavouritesPage() {
  const [activeTab, setActiveTab] = useState<"flights" | "places">("places");

  const places = [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      name: "CVK Park Bosphorus Hotel Istanbul",
      location: "Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437",
      rating: 4.2,
      reviews: 371,
      price: "Rp 1.100.000",
      pricePerNight: "Rp 1.100.000",
      amenities: ["Breakfast Included", "Free Wifi", "Spa", "Pool", "Gym", "Parking"]
    },
    {
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
        name: "Eresin Hotels Sultanahmet - Boutique Class",
        location: "Kucukayasofya No. 40 Sultanahmet, Istanbul 34022",
        rating: 4.2,
        reviews: 54,
        price: "Rp 1.100.000",
        pricePerNight: "Rp 1.100.000",
        amenities: ["City View", "Free Wifi", "Restaurant", "Bar"]
    },
    {
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974",
        name: "Eresin Hotels Sultanahmet - Boutique Class",
        location: "Kucukayasofya No. 40 Sultanahmet, Istanbul 34022",
        rating: 4.2,
        reviews: 54,
        price: "Rp 1.100.000",
        pricePerNight: "Rp 1.100.000",
        amenities: ["City View", "Free Wifi", "Restaurant", "Bar"]
    }
  ];

  const flights = [
     {
        airline: "Emirates",
        logo: "https://www.vectorlogo.zone/logos/emirates/emirates-icon.svg",
        departureTime: "12:00 pm",
        arrivalTime: "01:28 pm",
        duration: "2h 28m",
        price: "Rp 1.200.000",
        rating: 4.2,
        reviews: 54,
        type: "Non-stop",
        route: "EWR - JFK"
     }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-6 py-8 pt-24 lg:pt-32 w-full">
         
         <h1 className="text-3xl font-bold text-foreground mb-8">Favourites</h1>

         {/* Tabs Container */}
         <div className="bg-white rounded-[12px] shadow-sm mb-8 overflow-hidden">
            <div className="flex border-b border-gray-100">
                <button 
                    onClick={() => setActiveTab("flights")}
                    className={`flex-1 py-4 text-left px-6 transition-all relative ${activeTab === "flights" ? "" : "hover:bg-gray-50"}`}
                >
                    <span className="block text-sm font-bold text-foreground mb-1">Flights</span>
                    <span className="block text-xs text-muted">{flights.length} marked</span>
                    {activeTab === "flights" && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#14b8a6]"></div>
                    )}
                </button>
                <div className="w-px bg-gray-100"></div>
                <button 
                    onClick={() => setActiveTab("places")}
                    className={`flex-1 py-4 text-left px-6 transition-all relative ${activeTab === "places" ? "" : "hover:bg-gray-50"}`}
                >
                    <span className="block text-sm font-bold text-foreground mb-1">Places</span>
                    <span className="block text-xs text-muted">{places.length} marked</span>
                    {activeTab === "places" && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#14b8a6]"></div>
                    )}
                </button>
            </div>
         </div>

         {/* Content */}
         <div className="space-y-6">
            {activeTab === "flights" && (
                <div className="space-y-4">
                    {flights.map((flight, idx) => (
                        <FlightCard key={idx} {...flight} />
                    ))}
                </div>
            )}

            {activeTab === "places" && (
                 <div className="space-y-4">
                    {places.map((place, idx) => (
                        <StaysCard key={idx} {...place} />
                    ))}
                 </div>
            )}
         </div>

      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaysCard from "@/components/stays/list/StaysCard";
import FlightCard from "@/components/flights/list/FlightCard";
import { getFavourites, toggleFavourite } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function FavouritesPage() {
  const [activeTab, setActiveTab] = useState<"flights" | "places">("places");
  const [places, setPlaces] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const res = await getFavourites();
      const allFavs = res.data || [];
      
      const hotelFavs = allFavs.filter((f: any) => f.type === "hotel").map((f: any) => ({
        ...f.hotel,
        isFavourite: true,
        // Map backend fields to frontend props if necessary
        image: f.hotel?.images?.find((img: any) => img.is_primary)?.url || f.hotel?.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        location: f.hotel?.address || f.hotel?.city?.name || "Unknown",
        pricePerNight: `Rp ${f.hotel?.base_price?.toLocaleString() || "0"}`,
        amenities: f.hotel?.facilities?.map((fac: any) => fac.name) || ["Free Wifi", "Air Conditioning"]
      }));

      const flightFavs = allFavs.filter((f: any) => f.type === "flight").map((f: any) => ({
        ...f.flight,
        isFavourite: true,
        // Map backend fields to frontend props
        id: f.flight?.ID,
        airline: f.flight?.airline || "Unknown",
        logo: "https://www.vectorlogo.zone/logos/emirates/emirates-icon.svg", // Mock logo for now
        departureTime: f.flight?.departure_time ? new Date(f.flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "12:00 PM",
        arrivalTime: f.flight?.arrival_time ? new Date(f.flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "02:00 PM",
        duration: `${f.flight?.duration || 0}m`,
        price: `Rp ${f.flight?.price?.toLocaleString() || "1.200.000"}`,
        rating: 4.2,
        reviews: 54,
        type: "Non-stop",
        route: `${f.flight?.departure_airport?.code || "ABC"} - ${f.flight?.arrival_airport?.code || "XYZ"}`
      }));

      setPlaces(hotelFavs);
      setFlights(flightFavs);
    } catch (error) {
      console.error("Failed to fetch favourites:", error);
      toast.error("Failed to load favourites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleToggleFav = async (type: "flight" | "hotel", id: number) => {
    try {
      await toggleFavourite(type, type === "flight" ? id : undefined, type === "hotel" ? id : undefined);
      // Immediately remove from UI
      if (type === "flight") {
        setFlights(prev => prev.filter(f => f.ID !== id));
      } else {
        setPlaces(prev => prev.filter(p => p.ID !== id));
      }
      toast.success("Favourites updated");
    } catch (error) {
      toast.error("Failed to update favourites");
    }
  };

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
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {activeTab === "flights" && (
                        <div className="space-y-4">
                            {flights.length > 0 ? (
                                flights.map((flight) => (
                                    <FlightCard 
                                      key={flight.ID} 
                                      {...flight} 
                                      onToggle={() => handleToggleFav("flight", flight.ID)}
                                    />
                                ))
                            ) : (
                                <div className="bg-white rounded-[12px] p-12 text-center shadow-sm">
                                    <p className="text-muted font-medium italic">No flight favourites yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "places" && (
                        <div className="space-y-4">
                            {places.length > 0 ? (
                                places.map((place) => (
                                    <StaysCard 
                                      key={place.ID} 
                                      {...place} 
                                      onToggle={() => handleToggleFav("hotel", place.ID)}
                                    />
                                ))
                            ) : (
                                <div className="bg-white rounded-[12px] p-12 text-center shadow-sm">
                                    <p className="text-muted font-medium italic">No place favourites yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
         </div>

      </main>

      <Footer />
    </div>
  );
}

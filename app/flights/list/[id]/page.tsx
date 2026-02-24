"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getFlightDetail } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlightDetailHero from "@/components/flights/detail/FlightDetailHero";
import EconomyFeatures from "@/components/flights/detail/EconomyFeatures";
import AirlinePolicies from "@/components/flights/detail/AirlinePolicies";
import FlightSegmentCard from "@/components/flights/detail/FlightSegmentCard";

import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function FlightDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [flightData, setFlightData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function transformData() {
      try {
        const res = await getFlightDetail(id);
        const flight = res.data.flight;
        const seats = res.data.seats;
        
        // Find economy class features or default
        const policies = [
            "Pre-flight cleaning, installation of cabin HEPA filters.",
            "Pre-flight health screening questions.",
        ];


        setFlightData({
            title: `${flight.airline} ${flight.flight_number}`,
            address: `${flight.departure_airport.city} to ${flight.arrival_airport.city}`,
            rating: 4.5, // Mock rating as it's not in flight model yet
            reviews: 120, // Mock reviews
            price: `Rp ${(seats.sort((a: any, b: any) => a.price - b.price)[0]?.price || 0).toLocaleString()} (Min)`,
            imageUrl: "https://images.unsplash.com/photo-1540339832862-474599807836?q=80&w=2000&auto=format&fit=crop",
            airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png", // Placeholder
            airlineName: flight.airline,
            aircraft: "Boeing 737", // Mock
            policies: policies,
            flight: flight,
            seats: seats
        });
      } catch (error) {
        console.error("Failed to fetch flight details", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
        transformData();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!flightData) {
    return <div className="min-h-screen flex items-center justify-center">Flight not found</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pb-12 lg:pb-24 pt-[72px]">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <Breadcrumbs items={[{ label: "Flights", href: "/flights" }, { label: `${flightData.flight.departure_airport.city} to ${flightData.flight.arrival_airport.city}` }]} />
        </div>

        {/* Hero Section */}
        <FlightDetailHero
          title={flightData.title}
          address={flightData.address}
          rating={flightData.rating}
          reviews={flightData.reviews}
          price={flightData.price}
          imageUrl={flightData.imageUrl}
        />

        {/* Features Section */}
        <EconomyFeatures />

        {/* Policies Section */}
        <AirlinePolicies 
            airlineName={flightData.airlineName} 
            policies={flightData.policies} 
        />

        {/* Flight Segments */}
        <div className="space-y-6 mt-6">
            <FlightSegmentCard
                dateLabel={`Depart ${new Date(flightData.flight.departure_time).toLocaleDateString()}`}
                duration={`${Math.floor(flightData.flight.duration / 60)}h ${flightData.flight.duration % 60}m`}
                airline={flightData.airlineName}
                aircraft={flightData.aircraft}
                logo={flightData.airlineLogo}
                departureTime={new Date(flightData.flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                departureAirport={`${flightData.flight.departure_airport.city} (${flightData.flight.departure_airport.code})`}
                arrivalTime={new Date(flightData.flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                arrivalAirport={`${flightData.flight.arrival_airport.city} (${flightData.flight.arrival_airport.code})`}
            />
        </div>
      </main>

      <Footer />
    </div>
  );
}

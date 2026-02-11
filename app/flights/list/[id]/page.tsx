"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlightDetailHero from "@/components/flights/detail/FlightDetailHero";
import EconomyFeatures from "@/components/flights/detail/EconomyFeatures";
import AirlinePolicies from "@/components/flights/detail/AirlinePolicies";
import FlightSegmentCard from "@/components/flights/detail/FlightSegmentCard";

export default function FlightDetailPage() {
  const flightData = {
    title: "Emirates A380 Airbus",
    address: "Gümüşsuyu Mah. İnönü Cad. No:8, Istanbul 34437",
    rating: 4.2,
    reviews: 54,
    price: "Rp. 1,200,000",
    imageUrl: "https://images.unsplash.com/photo-1540339832862-474599807836?q=80&w=2000&auto=format&fit=crop", 
    airlineLogo: "https://www.vectorlogo.zone/logos/emirates/emirates-icon.svg",
    airlineName: "Emirates",
    aircraft: "Airbus A320",
    policies: [
      "Pre-flight cleaning, installation of cabin HEPA filters.",
      "Pre-flight health screening questions.",
    ],
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pb-12 lg:pb-24">
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
                dateLabel="Return Wed, Dec 8"
                duration="2h 28m"
                airline={flightData.airlineName}
                aircraft={flightData.aircraft}
                logo={flightData.airlineLogo}
                departureTime="12:00 pm"
                departureAirport="Newark(EWR)"
                arrivalTime="12:00 pm"
                arrivalAirport="Newark(EWR)"
            />
             <FlightSegmentCard
                dateLabel="Return Wed, Dec 8"
                duration="2h 28m"
                airline={flightData.airlineName}
                aircraft={flightData.aircraft}
                logo={flightData.airlineLogo}
                departureTime="12:00 pm"
                departureAirport="Newark(EWR)"
                arrivalTime="12:00 pm"
                arrivalAirport="Newark(EWR)"
            />
        </div>
      </main>

      <Footer />
    </div>
  );
}

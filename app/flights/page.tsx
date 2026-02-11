import FlightHero from "@/components/flights/FlightHero";
import MapSection from "@/components/flights/MapSection";
import Destinations from "@/components/Destinations";
import Footer from "@/components/Footer";

export default function FlightSearchPage() {
  const flightDestinations = [
    {
      city: "Melbourne",
      country: "Australia",
      image: "https://images.unsplash.com/photo-1514395465013-2dc0ad8b955f?q=80&w=2070",
      priceFrom: 3200000,
    },
    {
      city: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
      priceFrom: 3200000,
    },
    {
      city: "London",
      country: "UK",
       image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070",
      priceFrom: 3200000,
    },
    {
      city: "Columbia",
      country: "USA",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1887",
      priceFrom: 3200000,
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <FlightHero />
      <MapSection />
      <Destinations 
        title="Fall into travel" 
        description="Going somewhere to celebrate this season? Whether you're going home or somewhere to roam, we've got the travel tools to get you to your destination."
        items={flightDestinations}
      />
      <Footer />
    </main>
  );
}

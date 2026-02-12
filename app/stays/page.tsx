import type { Metadata } from "next";
import Hero from "@/components/Hero";
import SearchForm from "@/components/SearchForm";
import MapSection from "@/components/MapSection";
import Destinations from "@/components/Destinations";
import Reviews from "@/components/Reviews";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Book Top Hotels | BataGo",
  description: "Find the best places to stay, from luxury hotels to cozy apartments, at unbeatable prices.",
};

export default function StaysSearchPage() {
  const stayDestinations = [
    {
      city: "Melbourne",
      country: "An amazing journey", // Mapping title to country as per current design or similar
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070",
      priceFrom: 1200000,
    },
    {
      city: "Paris",
      country: "A Paris Adventure",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
      priceFrom: 2500000,
    },
    {
      city: "London",
      country: "London eye adventure",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070",
      priceFrom: 2200000,
    },
    {
      city: "Columbia",
      country: "Amazing streets",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1887",
      priceFrom: 1800000,
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
        title={
          <>
            <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
                Make your travel whishlist, we&apos;ll do the rest
            </h1>
          </>
        }
        subtitle={
          <p className="text-white text-lg font-medium drop-shadow-md">
            Special offers to suit your plan
          </p>
        }
      >
        <SearchForm mode="hotels" />
      </Hero>
      <MapSection />
      <Destinations 
        title="Fall into travel"
        description="Going somewhere to celebrate this season? Whether you're going home or somewhere to roam, we've got the travel tools to get you to your destination."
        items={stayDestinations}
      />
      <Reviews />
      <Newsletter />
      <Footer />
    </main>
  );
}

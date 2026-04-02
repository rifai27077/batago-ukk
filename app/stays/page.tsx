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
      <Destinations />
      <Reviews />
      <Newsletter />
      <Footer />
    </main>
  );
}

import Hero from "./components/Hero";
import Partners from "@/components/Partners";
import Destinations from "@/components/Destinations";
import CTACards from "./components/CTACards";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Partners />
      <Destinations />
      <CTACards />
      <Features />
      <Reviews />
      <Newsletter />
      <Footer />
    </main>
  );
}

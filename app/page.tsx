import PartnerBanner from "@/components/partner/PartnerBanner";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SearchForm from "@/components/SearchForm";
import Partners from "@/components/Partners";
import Destinations from "@/components/Destinations";
import CTACards from "@/components/CTACards";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero>
        <SearchForm mode="all" />
      </Hero>
      <Partners />
      <Destinations />
      <CTACards />
      <Features />
      {/* <Newsletter /> */}
      <PartnerBanner />
      <Footer />
    </main>
  );
}

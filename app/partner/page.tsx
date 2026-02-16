"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnerHero from "@/components/partner/PartnerHero";
import PartnerBenefits from "@/components/partner/PartnerBenefits";
import PartnerSteps from "@/components/partner/PartnerSteps";
import PartnerFAQ from "@/components/partner/PartnerFAQ";
import Link from "next/link";

export default function PartnerPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header />
      
      <main className="flex-1">
        <PartnerHero />
        <PartnerBenefits />
        <PartnerSteps />
        <PartnerFAQ />

        {/* Final CTA */}
        <section className="py-24 bg-primary text-white text-center px-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to grow your business?</h2>
                <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                     Join the BataGo partner network today and start reaching more travelers.
                </p>
                <Link
                    href="/register-partner"
                    className="inline-block bg-white text-primary font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                >
                    Register Now
                </Link>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";

export default function PartnerBanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Partner with BataGo"
          fill
          className="object-cover brightness-[0.25]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Own a Hotel or Airline?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join the BataGo partner network and start reaching millions of travelers worldwide. 
          Boost your revenue with our powerful platform.
        </p>
        <Link
          href="/partner"
          className="inline-block bg-primary text-white hover:bg-primary/90 font-semibold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          Become a Partner
        </Link>
      </div>
    </section>
  );
}

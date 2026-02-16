"use client";

import Link from "next/link";
import Image from "next/image";

export default function PartnerHero() {
  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Partner with BataGo"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Grow Your Business with <span className="text-primary">BataGo</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of hotels and airlines reaching millions of travelers worldwide. 
          Boost your bookings and revenue today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                href="/register-partner"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
            >
                Become a Partner
            </Link>
            <Link
                href="#how-it-works"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold py-4 px-10 rounded-full text-lg transition-all"
            >
                Learn More
            </Link>
        </div>
      </div>
    </div>
  );
}

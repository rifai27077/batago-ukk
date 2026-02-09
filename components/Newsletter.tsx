"use client";

import Image from "next/image";

export default function Newsletter() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-primary/5 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Content */}
        <div className="flex-1 max-w-lg relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Subscribe <br />
            <span className="text-primary">Newsletter</span>
          </h2>
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-semibold text-foreground/80">
              The Travel
            </h3>
            <p className="text-muted text-sm md:text-base">
              Get inspired! Receive travel discounts, tips and behind the scenes stories.
            </p>
          </div>

          <form className="flex gap-4 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
            />
            <button className="bg-foreground text-white px-8 py-4 rounded-xl font-semibold hover:bg-black transition-colors shadow-lg">
              Subscribe
            </button>
          </form>
        </div>

        {/* Decorative Image */}
        <div className="flex-1 w-full max-w-md relative h-64 md:h-[400px]">
          <div className="absolute inset-0 bg-secondary/10 rounded-3xl transform rotate-6 scale-90 z-0"></div>
          <div className="relative h-full w-full bg-white rounded-3xl shadow-xl overflow-hidden z-10 transform hover:-translate-y-2 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1596423126780-0a2b02a28173?q=80&w=800"
              alt="Newsletter travel inspiration"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm">
              <p className="text-xs font-bold text-foreground">Travel.com</p>
              <p className="text-[10px] text-muted">Thinking of you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

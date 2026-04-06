"use client";

import { useState } from "react";
import Image from "next/image";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans">
      <div className="relative rounded-3xl overflow-hidden bg-primary/5 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Content */}
        <div className="flex-1 max-w-lg relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Subscribe <br />
            <span className="text-primary tracking-tight">Newsletter</span>
          </h2>
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-foreground/80 tracking-tight">
              The Travel
            </h3>
            <p className="text-muted text-sm md:text-base font-medium">
              Get inspired! Receive travel discounts, tips and behind the scenes stories.
            </p>
          </div>

          {isSubscribed ? (
            <div className="bg-primary/20 p-6 rounded-2xl border border-primary/30 animate-fade-in-up">
              <p className="text-primary font-bold text-center">Thanks for subscribing! Check your email soon. ✈️</p>
            </div>
          ) : (
            <form className="flex gap-4 flex-col sm:flex-row" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground font-medium"
              />
              <button 
                disabled={isLoading}
                className="bg-foreground text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>


        {/* Decorative Image */}
        <div className="flex-1 w-full max-w-md relative h-64 md:h-[400px]">
          <div className="absolute inset-0 bg-secondary/10 rounded-3xl transform rotate-6 scale-90 z-0"></div>
          <div className="relative h-full w-full bg-white rounded-3xl shadow-xl overflow-hidden z-10 transform hover:-translate-y-2 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&auto=format&fit=crop&w=800"
              alt="Newsletter travel inspiration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

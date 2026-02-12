"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

export default function HotelListingPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      {/* Search Header Section Placeholder */}
      <div className="pt-24 pb-8 lg:pb-12 bg-gray-50/30 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
            <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-6 py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/stays" className="hover:text-primary transition-colors">Stays</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-primary">List</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Filters Sidebar Placeholder */}
          <div className="hidden lg:block lg:w-[280px] shrink-0">
            <div className="h-[600px] bg-gray-50 rounded-2xl animate-pulse" />
          </div>

          {/* Listings Area */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="h-48 bg-gray-50 rounded-2xl animate-pulse" />
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-lg font-bold text-foreground mb-2">No hotels found</p>
                    <p className="text-muted">This page is currently under development.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

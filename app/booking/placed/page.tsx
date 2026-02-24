"use client";

import { Suspense } from "react";
import BookingPlaced from "@/components/bookings/BookingPlaced";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingPlacedPage() {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col font-sans">
      <Header />
      <main className="grow flex items-center justify-center px-6 py-12 mt-[72px]">
        <Suspense fallback={<div className="animate-pulse w-full max-w-5xl h-96 bg-gray-200 rounded-3xl" />}>
          <BookingPlaced />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

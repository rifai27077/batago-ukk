"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PassengerDetailsForm from "@/components/flights/booking/PassengerDetailsForm";
import PaymentMethods from "@/components/flights/booking/PaymentMethods";
import BookingInfoCard from "@/components/flights/booking/BookingInfoCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FlightBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-8 pt-24 lg:pt-32">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/flights" className="hover:text-primary transition-colors">Flights</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/flights/list" className="hover:text-primary transition-colors">List</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/flights/list/1" className="hover:text-primary transition-colors">Detail</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-primary">Booking</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Secure Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Login Prompt */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-foreground text-lg">Log in or Sign up to book faster</h3>
                        <p className="text-sm text-muted">Save your details for future bookings and earn points.</p>
                    </div>
                    <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all text-sm whitespace-nowrap">
                        Login Now
                    </button>
                </div>

                <PassengerDetailsForm />

                <PaymentMethods />

                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex items-center gap-6">
                    <p className="text-sm text-muted mb-1 text-center w-full">By clicking Complete Booking, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.</p>
                </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
                <BookingInfoCard />
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

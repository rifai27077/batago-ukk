"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Plane, Calendar, Clock, MapPin, Download, Share2, CreditCard, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import ReviewModal from "@/components/reviews/ReviewModal";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Mock Data Lookup (In a real app, fetch based on ID)
  // For demo purposes, we'll just display static data based on a conditional or just generic data
  const isFlight = id.startsWith("B-1") || id.startsWith("B-12"); 
  // Mock status checks based on ID patterns from BookingList
  const isCompleted = id.startsWith("B-11"); 

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col font-sans">
      <Header />

      <main className="grow max-w-4xl mx-auto px-6 py-8 md:py-12 w-full mt-[72px]">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Link href="/my-bookings" className="flex items-center gap-2 text-muted hover:text-primary transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Bookings</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-foreground">
                            {isFlight ? "Jakarta (CGK) → Bali (DPS)" : "The Ritz-Carlton Bali"}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isCompleted ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"}`}>
                            {isCompleted ? "Completed" : "Confirmed"}
                        </span>
                    </div>
                    <p className="text-muted">Booking ID: <span className="font-mono text-foreground font-bold">{id}</span></p>
                </div>
                <div className="flex gap-3">
                    {isCompleted && (
                        <button 
                            onClick={() => setIsReviewModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors"
                        >
                            <Star className="w-4 h-4" />
                            Write Review
                        </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
                        <Download className="w-4 h-4" />
                        Download E-Ticket
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-8">
                {/* Flight/Hotel Specific Details */}
                {isFlight ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Image src="https://images.unsplash.com/photo-1542296332-2e44a996aa0a?q=80&w=100&auto=format&fit=crop" width={48} height={48} alt="Airline" className="rounded-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Garuda Indonesia</h3>
                                    <p className="text-muted">Economy • GA 404</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted">Duration</p>
                                <p className="font-bold">1h 50m</p>
                            </div>
                        </div>

                        <div className="relative flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-200">
                             {/* Departure */}
                             <div className="text-left z-10">
                                 <p className="text-2xl font-bold text-foreground">08:00</p>
                                 <p className="text-sm text-muted mb-1">12 Aug 2026</p>
                                 <p className="font-semibold text-foreground">Jakarta (CGK)</p>
                                 <p className="text-xs text-muted">Soekarno-Hatta Intl</p>
                             </div>

                             {/* Flight Path Graphic */}
                             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 flex items-center justify-center">
                                 <div className="w-full h-px bg-gray-300 relative">
                                     <div className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
                                         <Plane className="w-5 h-5 fill-current rotate-90" />
                                     </div>
                                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                 </div>
                             </div>

                             {/* Arrival */}
                             <div className="text-right z-10">
                                 <p className="text-2xl font-bold text-foreground">10:50</p>
                                 <p className="text-sm text-muted mb-1">12 Aug 2026</p>
                                 <p className="font-semibold text-foreground">Bali (DPS)</p>
                                 <p className="text-xs text-muted">Ngurah Rai Intl</p>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
                            <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" fill alt="Hotel" className="object-cover" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Check-In</p>
                                    <p className="font-bold text-lg">Sun, 15 Aug 2026</p>
                                    <p className="text-sm text-muted">From 14:00</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted">Check-Out</p>
                                    <p className="font-bold text-lg">Wed, 18 Aug 2026</p>
                                    <p className="text-sm text-muted">Before 12:00</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Room Details</h3>
                            <p className="text-muted">1x Deluxe Ocean View Room • 2 Guests • Breakfast Included</p>
                        </div>
                    </div>
                )}

                <hr className="border-gray-100" />

                {/* Price Breakdown */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-muted">
                            <span>Base Fare</span>
                            <span>IDR {isFlight ? "1.000.000" : "4.000.000"}</span>
                        </div>
                        <div className="flex justify-between text-muted">
                            <span>Taxes & Fees</span>
                            <span>IDR {isFlight ? "250.000" : "500.000"}</span>
                        </div>
                        <div className="flex justify-between text-muted">
                            <span>Discount</span>
                            <span className="text-green-600">- IDR 0</span>
                        </div>
                        <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                            <span className="font-bold text-lg">Total Paid</span>
                            <span className="font-bold text-xl text-primary">IDR {isFlight ? "1.250.000" : "4.500.000"}</span>
                        </div>
                    </div>
                </div>

                 <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                        <CreditCard className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Paid with Visa ending in 4242</p>
                        <p className="text-xs text-muted">Transaction ID: TX-987654321</p>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
      
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        bookingDetails={{
            id: id,
            title: isFlight ? "Jakarta (CGK) → Bali (DPS)" : "The Ritz-Carlton Bali",
            image: isFlight 
                ? "https://images.unsplash.com/photo-1542296332-2e44a996aa0a?q=80&w=300&auto=format&fit=crop" 
                : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop"
        }}
      />
    </div>
  );
}

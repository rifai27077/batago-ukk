"use client";

import Link from "next/link";
import { CheckCircle, Download, Home, ArrowRight, Plane, Bed, MapPin, Calendar, Clock, ShieldCheck, Mail } from "lucide-react";
import Image from "next/image";

export default function BookingSuccess() {
  // Mock booking data - In real app this would come from props or context
  const booking = {
    id: "B-123456789",
    total: "IDR 1.250.000",
    date: "12 Aug, 2026",
    status: "Confirmed",
    email: "rifai@batago.com",
    flight: {
        from: "Jakarta (CGK)",
        to: "Bali (DPS)",
        airline: "Garuda Indonesia",
        flightNo: "GA 404",
        departure: "08:00",
        arrival: "10:50",
        duration: "1h 50m",
        image: "https://images.unsplash.com/photo-1542296332-2e44a996aa0a?q=80&w=300&auto=format&fit=crop"
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
        {/* Success Header */}
        <div className="text-center mb-10">
             <div className="w-24 h-24 bg-green-100/50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in border-4 border-white shadow-xl shadow-green-100">
                <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Booking Confirmed!</h1>
             <p className="text-muted text-lg max-w-lg mx-auto">
                Your trip is set! We've sent the e-ticket and receipt to <span className="font-semibold text-foreground">{booking.email}</span>
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Ticket Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col relative">
                {/* Decorative Pattern Top */}
                <div className="h-2 bg-linear-to-r from-primary via-blue-400 to-primary-hover"></div>
                
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                             <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Booking Reference</p>
                             <p className="text-2xl font-mono mobile:text-xl font-bold text-foreground tracking-tight">{booking.id}</p>
                        </div>
                        <div className="px-4 py-1.5 bg-green-50 text-green-700 font-bold rounded-full text-sm border border-green-100 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Paid & Confirmed
                        </div>
                    </div>

                    {/* Flight Route Visual */}
                    <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="text-center">
                             <p className="text-3xl font-bold text-foreground mb-1">CGK</p>
                             <p className="text-xs font-semibold text-muted bg-white px-2 py-1 rounded-md border border-gray-100">Jakarta</p>
                        </div>
                        
                        <div className="grow px-6 flex flex-col items-center">
                             <div className="flex items-center gap-2 text-muted text-xs font-medium mb-2">
                                <Clock className="w-3 h-3" />
                                {booking.flight.duration}
                             </div>
                             <div className="w-full h-px bg-gray-300 relative flex items-center">
                                 <div className="w-2 h-2 rounded-full bg-gray-400 absolute left-0"></div>
                                 <Plane className="w-5 h-5 text-primary absolute left-1/2 -translate-x-1/2 bg-gray-50 px-1" />
                                 <div className="w-2 h-2 rounded-full bg-gray-400 absolute right-0"></div>
                             </div>
                             <p className="text-xs text-primary font-bold mt-2">{booking.flight.flightNo}</p>
                        </div>

                        <div className="text-center">
                             <p className="text-3xl font-bold text-foreground mb-1">DPS</p>
                             <p className="text-xs font-semibold text-muted bg-white px-2 py-1 rounded-md border border-gray-100">Bali</p>
                        </div>
                    </div>

                    {/* Detailed Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div>
                            <p className="text-xs text-muted mb-1">Date</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <p className="font-semibold text-sm">{booking.date}</p>
                            </div>
                        </div>
                         <div>
                            <p className="text-xs text-muted mb-1">Departure</p>
                             <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <p className="font-semibold text-sm">{booking.flight.departure}</p>
                            </div>
                        </div>
                         <div>
                            <p className="text-xs text-muted mb-1">Arrival</p>
                             <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <p className="font-semibold text-sm">{booking.flight.arrival}</p>
                            </div>
                        </div>
                         <div>
                            <p className="text-xs text-muted mb-1">Total Paid</p>
                            <p className="font-bold text-lg text-primary">{booking.total}</p>
                        </div>
                    </div>

                    {/* Airline Info */}
                    <div className="flex items-center gap-4 py-4 border-t border-gray-100">
                         <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center p-1">
                             <Image 
                                src={booking.flight.image} 
                                alt="Airline" 
                                width={40} 
                                height={40} 
                                className="rounded-full object-cover" 
                             />
                         </div>
                         <div>
                             <p className="font-bold text-sm">{booking.flight.airline}</p>
                             <p className="text-xs text-muted">Economy Class • 2 Adults</p>
                         </div>
                         <div className="ml-auto">
                              <Link href={`/my-bookings/${booking.id}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                  View Details <ArrowRight className="w-4 h-4" />
                              </Link>
                         </div>
                    </div>
                </div>

                {/* Perforated Edge Visual (CSS only optimization) */}
                <div className="relative h-6 bg-gray-50 border-t border-dashed border-gray-300 flex items-center justify-between">
                     <div className="w-6 h-6 rounded-full bg-surface-secondary -ml-3"></div>
                     <div className="w-6 h-6 rounded-full bg-surface-secondary -mr-3"></div>
                </div>

                {/* Action Footer */}
                <div className="bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <p className="text-xs text-muted text-center md:text-left max-w-xs">
                        *Please arrive at least 2 hours before departure. Check-in counters close 45 minutes before flight.
                    </p>
                    <div className="flex gap-3 w-full md:w-auto">
                          <button className="flex-1 md:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-foreground font-bold rounded-xl hover:bg-white hover:border-gray-300 transition-colors shadow-xs">
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                        <button className="flex-1 md:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
                            <Download className="w-4 h-4" />
                            Download Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar / Next Steps visually distinct */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">What's Next?</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                            <div>
                                <p className="font-bold text-sm">Check your email</p>
                                <p className="text-xs text-muted">We sent the e-ticket and receipt.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                            <div>
                                <p className="font-bold text-sm">Prepare documents</p>
                                <p className="text-xs text-muted">Valid ID/Passport is required.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                            <div>
                                <p className="font-bold text-sm">Web Check-in</p>
                                <p className="text-xs text-muted">Open 24h before departure.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-linear-to-br from-primary to-primary-hover rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 rounded-full bg-white/10 blur-lg"></div>
                    
                    <h3 className="font-bold text-lg mb-2 relative z-10">Need a Hotel?</h3>
                    <p className="text-white/80 text-sm mb-4 relative z-10">Get up to 30% off hotels in Bali when you book now.</p>
                    <Link href="/stays" className="inline-block bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors relative z-10">
                        Find Hotels
                    </Link>
                </div>
                
                <div className="text-center pt-2">
                     <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-primary font-semibold transition-colors text-sm">
                        <Home className="w-4 h-4" />
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}

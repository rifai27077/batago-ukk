"use client";

import Link from "next/link";
import { CheckCircle, Download, Home, ArrowRight, Plane, Bed, MapPin, Calendar, Clock, ShieldCheck, Mail, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getBookingDetail } from "@/lib/api";

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function BookingSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingCode = searchParams.get("code");
  const bookingType = searchParams.get("type");
  const amount = searchParams.get("amount");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingCode) {
      setError("Booking code is missing.");
      setLoading(false);
      return;
    }
    async function fetchDetail() {
      try {
        const res = await getBookingDetail(bookingCode!);
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking detail:", err);
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [bookingCode]);

  const b = booking?.booking;
  const isPaid = b?.payment_status === "PAID";

  // If not paid, redirect to placed
  useEffect(() => {
    if (!loading && !error && booking && !isPaid) {
      router.replace(`/booking/placed?code=${bookingCode}`);
    }
  }, [isPaid, loading, error, booking, bookingCode, router]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted font-medium">Fetching your booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8">
          <p className="font-bold text-lg mb-2">Oops!</p>
          <p className="text-sm">{error || "Something went wrong."}</p>
        </div>
        <Link href="/" className="text-primary font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const fb = booking.flight_booking;
  const hotelVoucher = booking.voucher;

  const handleDownload = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('batago_token') : null;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1').replace(/\/v1$/, '');
    const url = `${baseUrl}/v1/bookings/${b.booking_code}/ticket`;
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Download failed');
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BataGo_Ticket_${b.booking_code}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => alert("Failed to download ticket: " + err.message));
  };

  const displayData = {
    id: b.booking_code,
    total: formatPrice(b.total_amount),
    date: new Date(b.CreatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
    status: "Paid & Confirmed",
    email: "your registered email",
    type: b.type,
    flight: fb ? {
        from: fb.flight.departure_airport.code,
        fromCity: fb.flight.departure_airport.city,
        to: fb.flight.arrival_airport.code,
        toCity: fb.flight.arrival_airport.city,
        airline: fb.flight.airline,
        flightNo: fb.flight.flight_number,
        departure: new Date(fb.flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        arrival: new Date(fb.flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${Math.floor(fb.flight.duration / 60)}h ${fb.flight.duration % 60}m`,
        image: "https://images.unsplash.com/photo-1542296332-2e44a996aa0a?q=80&w=300&auto=format&fit=crop",
        class: fb.class
    } : null
  };

  if (!isPaid) return null; // Let useEffect handle redirect

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
        {/* Success Header */}
        <div className="text-center mb-10">
             <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in border-4 border-white shadow-xl bg-green-100/50 text-green-600 shadow-green-100">
                <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Booking Confirmed!</h1>
             <p className="text-muted text-lg max-w-lg mx-auto">
                Your trip is set! We've sent the e-ticket and receipt to your email.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Ticket Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col relative">
                {/* Decorative Pattern Top */}
                <div className="h-2 bg-linear-to-r from-green-500 via-green-400 to-green-600"></div>
                
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                             <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Booking Reference</p>
                             <p className="text-2xl font-mono mobile:text-xl font-bold text-foreground tracking-tight">{displayData.id}</p>
                        </div>
                        <div className="px-4 py-1.5 font-bold rounded-full text-sm border flex items-center gap-2 bg-green-50 text-green-700 border-green-100">
                            <ShieldCheck className="w-4 h-4" />
                            Confirmed
                        </div>
                    </div>

                    {/* Flight Detail */}
                    {displayData.type === 'flight' && displayData.flight && (
                      <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <div className="text-center">
                               <p className="text-3xl font-bold text-foreground mb-1">{displayData.flight.from}</p>
                               <p className="text-xs font-semibold text-muted bg-white px-2 py-1 rounded-md border border-gray-100">{displayData.flight.fromCity}</p>
                          </div>
                          
                          <div className="grow px-6 flex flex-col items-center">
                               <div className="flex items-center gap-2 text-muted text-xs font-medium mb-2">
                                  <Clock className="w-3 h-3" />
                                  {displayData.flight.duration}
                               </div>
                               <div className="w-full h-px bg-gray-300 relative flex items-center">
                                   <div className="w-2 h-2 rounded-full bg-gray-400 absolute left-0"></div>
                                   <Plane className="w-5 h-5 text-primary absolute left-1/2 -translate-x-1/2 bg-gray-50 px-1" />
                                   <div className="w-2 h-2 rounded-full bg-gray-400 absolute right-0"></div>
                               </div>
                               <p className="text-xs text-primary font-bold mt-2">{displayData.flight.flightNo}</p>
                          </div>

                          <div className="text-center">
                               <p className="text-3xl font-bold text-foreground mb-1">{displayData.flight.to}</p>
                               <p className="text-xs font-semibold text-muted bg-white px-2 py-1 rounded-md border border-gray-100">{displayData.flight.toCity}</p>
                          </div>
                      </div>
                    )}

                    {/* Hotel Detail */}
                    {displayData.type === 'hotel' && (
                      <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center gap-6">
                         <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                             <Bed className="w-10 h-10 text-primary" />
                         </div>
                         <div>
                             <h4 className="text-xl font-bold text-foreground mb-1">{b.partner.company_name}</h4>
                             <div className="flex items-center gap-2 text-muted text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>Hotel Booking confirmed</span>
                             </div>
                         </div>
                      </div>
                    )}

                    {/* Detailed Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div>
                            <p className="text-xs text-muted mb-1">Date</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <p className="font-semibold text-sm">{displayData.date}</p>
                            </div>
                        </div>
                        {displayData.type === 'flight' && displayData.flight ? (
                          <>
                            <div>
                               <p className="text-xs text-muted mb-1">Departure</p>
                                <div className="flex items-center gap-2">
                                   <Clock className="w-4 h-4 text-primary" />
                                   <p className="font-semibold text-sm">{displayData.flight.departure}</p>
                               </div>
                           </div>
                            <div>
                               <p className="text-xs text-muted mb-1">Arrival</p>
                                <div className="flex items-center gap-2">
                                   <Clock className="w-4 h-4 text-primary" />
                                   <p className="font-semibold text-sm">{displayData.flight.arrival}</p>
                               </div>
                           </div>
                          </>
                        ) : (
                          <div className="col-span-2">
                              <p className="text-xs text-muted mb-1">Provider</p>
                              <p className="font-semibold text-sm">{b.partner.company_name}</p>
                          </div>
                        )}
                         <div>
                            <p className="text-xs text-muted mb-1">Total Paid</p>
                            <p className="font-bold text-lg text-primary">{displayData.total}</p>
                        </div>
                    </div>

                    {/* Item Footer Info */}
                    <div className="flex items-center gap-4 py-4 border-t border-gray-100">
                         {displayData.type === 'flight' && displayData.flight && (
                           <>
                             <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center p-1">
                                 <Plane className="w-6 h-6 text-primary" />
                             </div>
                             <div>
                                 <p className="font-bold text-sm">{displayData.flight.airline}</p>
                                 <p className="text-xs text-muted">{displayData.flight.class} Class</p>
                             </div>
                           </>
                         )}
                         {displayData.type === 'hotel' && (
                           <>
                             <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center p-1">
                                 <Bed className="w-6 h-6 text-primary" />
                             </div>
                             <div>
                                 <p className="font-bold text-sm">Room Reserved</p>
                                 <p className="text-xs text-muted">Voucher Code: {hotelVoucher?.voucher_code || 'Confirmed'}</p>
                             </div>
                           </>
                         )}
                         <div className="ml-auto">
                               <Link href={`/account/bookings`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                   My Bookings <ArrowRight className="w-4 h-4" />
                               </Link>
                         </div>
                    </div>
                </div>

                {/* Perforated Edge Visual */}
                <div className="relative h-6 bg-gray-50 border-t border-dashed border-gray-300 flex items-center justify-between">
                     <div className="w-6 h-6 rounded-full bg-surface-secondary -ml-3"></div>
                     <div className="w-6 h-6 rounded-full bg-surface-secondary -mr-3"></div>
                </div>

                {/* Action Footer */}
                <div className="bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <p className="text-xs text-muted text-center md:text-left max-w-xs leading-relaxed">
                        {displayData.type === 'flight' 
                          ? "*Please arrive at least 2 hours before departure. Check-in counters close 45 minutes before flight."
                          : "*Please present this booking confirmation or voucher at the front desk upon check-in."}
                    </p>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link href="/" className="grow md:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-foreground font-bold rounded-xl hover:bg-white hover:border-gray-300 transition-colors shadow-xs">
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <button 
                          onClick={handleDownload}
                          className="flex-1 md:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Download Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar / Next Steps */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">What's Next?</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-base border border-blue-100">1</div>
                            <div>
                                <p className="font-bold text-sm">Check your email</p>
                                <p className="text-xs text-muted leading-relaxed">We've sent your e-ticket and booking receipt to your registered email.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-base border border-blue-100">2</div>
                            <div>
                                <p className="font-bold text-sm">Prepare documents</p>
                                <p className="text-xs text-muted leading-relaxed">Have your valid ID (KTP/Passport) ready for check-in at the airport/hotel.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-base border border-blue-100">3</div>
                            <div>
                                <p className="font-bold text-sm">Web Check-in</p>
                                <p className="text-xs text-muted leading-relaxed">For flights, online check-in usually opens 24-48 hours before departure.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-linear-to-br from-primary to-primary-hover rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 rounded-full bg-white/10 blur-lg"></div>
                    
                    <h3 className="font-bold text-lg mb-2 relative z-10">Need a Hotel?</h3>
                    <p className="text-white/80 text-sm mb-4 relative z-10">Get up to 30% off hotels in your destination when you book now.</p>
                    <Link href="/stays" className="inline-block bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-md active:scale-95 relative z-10">
                        Find Hotels
                    </Link>
                </div>
                
                <div className="text-center pt-2">
                     <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-primary font-bold transition-colors text-sm">
                        <Home className="w-4 h-4" />
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}

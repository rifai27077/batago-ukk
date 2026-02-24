"use client";

import Link from "next/link";
import { Clock, Home, ArrowRight, Plane, Bed, MapPin, Calendar, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getBookingDetail } from "@/lib/api";

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function BookingPlaced() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingCode = searchParams.get("code");

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
        const b = res.data.booking;
        
        // If already paid, redirect to success
        if (b.payment_status === "PAID") {
          router.replace(`/booking/success?code=${bookingCode}`);
          return;
        }
        
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking detail:", err);
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [bookingCode, router]);

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

  const b = booking.booking;
  const fb = booking.flight_booking;
  const payment = booking.payment;

  const displayData = {
    id: b.booking_code,
    total: formatPrice(b.total_amount),
    date: new Date(b.CreatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
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
        class: fb.class
    } : null
  };

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const res = await getBookingDetail(bookingCode!);
      const b = res.data.booking;
      if (b.payment_status === "PAID") {
        router.replace(`/booking/success?code=${bookingCode}`);
        return;
      }
      setBooking(res.data);
    } catch (err) {
      console.error("Failed to refresh status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
        <div className="text-center mb-10">
             <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in border-4 border-white shadow-xl bg-amber-100/50 text-amber-600 shadow-amber-100">
                <Clock className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Booking Placed!</h1>
             <p className="text-muted text-lg max-w-lg mx-auto">
                We've received your booking. Please complete the payment to secure your trip.
            </p>
            
            <div className="mt-6 flex justify-center gap-3">
              <button 
                onClick={handleCheckStatus}
                className="px-6 py-3 bg-white border border-gray-200 text-foreground font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
              >
                <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Check Payment Status
              </button>
              {payment?.redirect_url && (
                 <a 
                  href={payment.redirect_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                 >
                   Pay Now <ArrowRight className="w-4 h-4" />
                 </a>
              )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col relative">
                <div className="h-2 bg-linear-to-r from-amber-500 via-amber-400 to-amber-600"></div>
                
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                             <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Booking Reference</p>
                             <p className="text-2xl font-mono mobile:text-xl font-bold text-foreground tracking-tight">{displayData.id}</p>
                        </div>
                        <div className="px-4 py-1.5 font-bold rounded-full text-sm border flex items-center gap-2 bg-amber-50 text-amber-700 border-amber-100">
                            <Clock className="w-4 h-4" />
                            Awaiting Payment
                        </div>
                    </div>

                    {displayData.type === 'flight' && displayData.flight && (
                      <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <div className="text-center">
                               <p className="text-3xl font-bold text-foreground mb-1">{displayData.flight.from}</p>
                               <p className="text-xs font-semibold text-muted bg-white px-2 py-1 rounded-md border border-gray-100">{displayData.flight.fromCity}</p>
                          </div>
                          
                          <div className="grow px-6 flex flex-col items-center">
                               <div className="w-full h-px bg-gray-300 relative flex items-center">
                                   <Plane className="w-5 h-5 text-primary absolute left-1/2 -translate-x-1/2 bg-gray-50 px-1" />
                               </div>
                               <p className="text-xs text-primary font-bold mt-2">{displayData.flight.flightNo}</p>
                          </div>

                          <div className="text-center">
                               <p className="text-3xl font-bold text-foreground mb-1">{displayData.flight.to}</p>
                               <p className="text-xs font-semibold text-muted bg-white px-2 py-1 rounded-md border border-gray-100">{displayData.flight.toCity}</p>
                          </div>
                      </div>
                    )}

                    {displayData.type === 'hotel' && (
                      <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center gap-6">
                         <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                             <Bed className="w-10 h-10 text-primary" />
                         </div>
                         <div>
                             <h4 className="text-xl font-bold text-foreground mb-1">{b.partner.company_name}</h4>
                             <p className="text-sm text-muted">Hotel Booking Placed</p>
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div>
                            <p className="text-xs text-muted mb-1">Date</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <p className="font-semibold text-sm">{displayData.date}</p>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-muted mb-1">Status</p>
                            <p className="font-bold text-sm text-amber-600">Pending Midtrans Confirmation</p>
                        </div>
                         <div>
                            <p className="text-xs text-muted mb-1">Total Amount</p>
                            <p className="font-bold text-lg text-primary">{displayData.total}</p>
                        </div>
                    </div>

                    <div className="flex justify-center border-t border-gray-100 pt-6">
                         <Link href={`/my-bookings`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                             View My Bookings <ArrowRight className="w-4 h-4" />
                         </Link>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <p className="text-xs text-muted text-center md:text-left max-w-xs italic">
                        *Please complete your payment within the timeframe to avoid cancellation.
                    </p>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link href="/" className="grow md:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-foreground font-bold rounded-xl hover:bg-white hover:border-gray-300 transition-colors shadow-xs">
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">What's Next?</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                            <div>
                                <p className="font-bold text-sm">Complete Payment</p>
                                <p className="text-xs text-muted">Use the "Pay Now" button if the popup closed.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                            <div>
                                <p className="font-bold text-sm">Wait for Confirmation</p>
                                <p className="text-xs text-muted">It usually takes 1-5 minutes for processing.</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                            <div>
                                <p className="font-bold text-sm">Check Status</p>
                                <p className="text-xs text-muted">Refresh this page or check your email later.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-linear-to-br from-primary to-primary-hover rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                    <h3 className="font-bold text-lg mb-2 relative z-10">Need Help?</h3>
                    <p className="text-white/80 text-sm mb-4 relative z-10">Our support team is available 24/7 if you have payment issues.</p>
                    <Link href="/support" className="inline-block bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors relative z-10">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}

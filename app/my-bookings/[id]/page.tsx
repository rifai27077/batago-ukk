"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Plane, Calendar, Clock, MapPin, Download, Share2, CreditCard, Star, Wifi, Coffee, Wind, Tv, ShieldCheck, Users, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ReviewModal from "@/components/reviews/ReviewModal";
import { getBookingDetail, cancelBooking } from "@/lib/api";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getBookingDetail(id);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch booking details", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
        fetchData();
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Booking not found</div>;

  const { booking, flight_booking, passengers, payment } = data;
  const isFlight = booking.type === "flight";
  const isPaid = booking.payment_status === "PAID";
  const isCompleted = booking.booking_status === "COMPLETED" || isPaid;

  const handleDownload = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('batago_token') : null;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1').replace(/\/v1$/, '');
    const url = `${baseUrl}/v1/bookings/${booking.booking_code}/ticket`;
    
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
      a.download = `BataGo_Ticket_${booking.booking_code}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => alert("Failed to download: " + err.message));
  };

  const handleResendEmail = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('batago_token') : null;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1').replace(/\/v1$/, '');
    const url = `${baseUrl}/v1/bookings/${booking.booking_code}/resend-ticket`;
    
    setIsResending(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to resend email');
      
      alert("Ticket has been resent to your email!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setIsCancelling(true);
    try {
      await cancelBooking(booking.id || booking.booking_code);
      alert("Booking cancelled successfully");
      router.refresh();
      // Refresh current data
      const res = await getBookingDetail(id);
      setData(res.data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

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
                            {isFlight 
                                ? `${flight_booking?.flight.departure_airport.city} (${flight_booking?.flight.departure_airport.code}) → ${flight_booking?.flight.arrival_airport.city} (${flight_booking?.flight.arrival_airport.code})` 
                                : "Hotel Reservation"}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {booking.payment_status}
                        </span>
                    </div>
                    <p className="text-muted">Booking Code: <span className="font-mono text-foreground font-bold">{booking.booking_code}</span></p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {isCompleted && (
                        <button 
                            onClick={() => setIsReviewModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors"
                        >
                            <Star className="w-4 h-4" />
                            Write Review
                        </button>
                    )}
                    {!isPaid && booking.booking_status !== 'CANCELLED' && (
                        <button 
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            {isCancelling ? "Cancelling..." : "Cancel Booking"}
                        </button>
                    )}
                    {isPaid && (
                        <>
                            <button 
                                onClick={handleResendEmail}
                                disabled={isResending}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <Mail className={`w-4 h-4 ${isResending ? "animate-pulse" : ""}`} />
                                {isResending ? "Sending..." : "Resend to Email"}
                            </button>
                            <button 
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                {isFlight ? "Download E-Ticket" : "Download Voucher"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-8">
                {/* Flight/Hotel Specific Details */}
                {isFlight && flight_booking ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-sm border border-gray-100">
                                    {flight_booking.flight.airline ? flight_booking.flight.airline.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() : 'FL'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-foreground">{flight_booking.flight.airline}</h3>
                                    <p className="text-muted font-medium">{flight_booking.class} Class • <span className="text-foreground">{flight_booking.flight.flight_number}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex justify-between items-center bg-gray-50/50 p-8 rounded-2xl border border-gray-100 overflow-hidden">
                             {/* Flight Path Background Line */}
                             <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-px bg-dashed border-t border-gray-200" />
                             
                             {/* Departure */}
                             <div className="text-left z-10 bg-gray-50/50 pr-4">
                                 <p className="text-3xl font-black text-foreground tabular-nums">
                                    {new Date(flight_booking.flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </p>
                                 <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
                                    {new Date(flight_booking.flight.departure_time).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                                 </p>
                                 <div className="mt-3">
                                     <p className="font-bold text-lg text-foreground">{flight_booking.flight.departure_airport.city}</p>
                                     <p className="text-xs text-muted max-w-[120px]">{flight_booking.flight.departure_airport.name}</p>
                                 </div>
                             </div>

                             {/* Plane Icon */}
                             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-50/50 px-4">
                                 <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm">
                                     <Plane className="w-5 h-5 fill-current rotate-90" />
                                 </div>
                             </div>

                             {/* Arrival */}
                             <div className="text-right z-10 bg-gray-50/50 pl-4">
                                 <p className="text-3xl font-black text-foreground tabular-nums">
                                    {new Date(flight_booking.flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </p>
                                 <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
                                    {new Date(flight_booking.flight.arrival_time).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                                 </p>
                                 <div className="mt-3">
                                     <p className="font-bold text-lg text-foreground">{flight_booking.flight.arrival_airport.city}</p>
                                     <p className="text-xs text-muted max-w-[120px]">{flight_booking.flight.arrival_airport.name}</p>
                                 </div>
                             </div>
                        </div>
                        
                        {/* Passengers */}
                         <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h3 className="font-bold text-base text-foreground mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Registered Passengers
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {passengers?.map((p: any, idx: number) => (
                                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {p.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-foreground">
                                                {p.title ? `${p.title}. ` : ''}{p.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-muted uppercase tracking-tighter">
                                            {p.passport_number || "REGULAR"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Hotel Specific Details */
                    <div className="space-y-10">
                        <div className="space-y-4">
                            {/* Improved Gallery */}
                            <div className="relative group">
                                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
                                {data.hotel_booking?.room_type?.hotel?.images?.[0]?.url ? (
                                    <Image 
                                        src={data.hotel_booking.room_type.hotel.images[0].url} 
                                        fill 
                                        alt="Hotel Main" 
                                        className="object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <span className="text-white text-6xl font-bold opacity-50">
                                            {data.hotel_booking?.room_type?.hotel?.name ? data.hotel_booking.room_type.hotel.name.split(' ').map((w: string) => w[0]).join('').substring(0, 3).toUpperCase() : 'HTL'}
                                        </span>
                                    </div>
                                )}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                        <h2 className="text-2xl font-bold text-white mb-1">{data.hotel_booking?.room_type?.hotel?.name}</h2>
                                        <p className="text-white/80 text-sm flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-red-400" />
                                            {data.hotel_booking?.room_type?.hotel?.address}
                                        </p>
                                    </div>
                                </div>
                                {data.hotel_booking?.room_type?.hotel?.images?.length > 1 && (
                                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
                                        {data.hotel_booking.room_type.hotel.images.map((img: any, idx: number) => (
                                            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm shrink-0 border-2 border-transparent hover:border-primary transition-all cursor-pointer">
                                                <Image src={img.url} fill alt={`Hotel ${idx}`} className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-4">Stay Information</h3>
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                            <div>
                                                <p className="text-[10px] text-muted font-bold uppercase mb-1">Check-in</p>
                                                <p className="font-bold text-sm text-foreground">
                                                    {data.hotel_booking?.check_in ? new Date(data.hotel_booking.check_in).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted font-bold uppercase mb-1">Check-out</p>
                                                <p className="font-bold text-sm text-foreground">
                                                    {data.hotel_booking?.check_out ? new Date(data.hotel_booking.check_out).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted font-bold uppercase mb-1">Guests</p>
                                                <p className="font-bold text-sm text-foreground flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-primary/60" />
                                                    {data.hotel_booking?.guests || 0} Guests
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted font-bold uppercase mb-1">Room Type</p>
                                                <p className="font-bold text-sm text-foreground">{data.hotel_booking?.room_type?.name || "Standard Room"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-4">Facilities & Features</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Parse Features if any */}
                                        {((data.hotel_booking?.room_type?.features ? JSON.parse(data.hotel_booking.room_type.features) : []) as string[]).map((feature: string, idx: number) => (
                                            <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100">
                                                {feature.toLowerCase().includes('wifi') && <Wifi className="w-3 h-3 text-primary" />}
                                                {feature.toLowerCase().includes('coffee') && <Coffee className="w-3 h-3 text-amber-600" />}
                                                {feature.toLowerCase().includes('ac') && <Wind className="w-3 h-3 text-blue-500" />}
                                                {feature.toLowerCase().includes('tv') && <Tv className="w-3 h-3 text-purple-600" />}
                                                {feature}
                                            </span>
                                        ))}
                                        {/* Fallback if no features */}
                                        {(!data.hotel_booking?.room_type?.features || data.hotel_booking.room_type.features === "[]") && (
                                            <>
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100"><Wifi className="w-3 h-3 text-primary" /> Free WiFi</span>
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100"><Coffee className="w-3 h-3 text-amber-600" /> Breakfast</span>
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-100"><Wind className="w-3 h-3 text-blue-500" /> Air Conditioning</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <hr className="border-gray-100" />

                {/* Price Breakdown */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                        <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                            <span className="font-bold text-lg">Total Paid</span>
                            <span className="font-bold text-xl text-primary">IDR {booking.total_amount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                 {payment && (
                     <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg border border-gray-200">
                            <CreditCard className="w-6 h-6 text-blue-800" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Paid via {payment.payment_method}</p>
                            <p className="text-xs text-muted">Transaction ID: {payment.transaction_id || "-"}</p>
                        </div>
                    </div>
                 )}
            </div>
        </div>
      </main>

      <Footer />
      
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        bookingDetails={{
            id: String(booking.ID || booking.id),
            title: isFlight ? (flight_booking?.flight?.airline || "Flight") : (data.hotel_booking?.room_type?.hotel?.name || "Stay"),
        }}
      />
    </div>
  );
}

"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Loader2, MapPin, Star } from "lucide-react";
import { getHotelDetail, createHotelBooking, createPaymentToken, getToken, HotelResult, RoomTypeResult } from "@/lib/api";
import StaysBookingInfoCard from "@/components/stays/book/StaysBookingInfoCard";

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StaysBookingPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";

  const [hotel, setHotel] = useState<HotelResult | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [checkIn, setCheckIn] = useState(checkInParam || new Date().toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(checkOutParam || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })());
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await getHotelDetail(Number(id));
        setHotel(res.data.hotel);
        const rooms = res.data.rooms || [];
        if (roomId) {
          const found = rooms.find((r) => String(r.ID) === roomId);
          setSelectedRoom(found || rooms[0] || null);
        } else {
          setSelectedRoom(rooms[0] || null);
        }
      } catch {
        setError("Failed to load hotel details.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchHotel();
  }, [id, roomId]);

  const nights = Math.max(1, Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const pricePerNight = selectedRoom?.base_price || 0;
  const subtotal = pricePerNight * nights;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  async function handleBooking() {
    if (!guestName) {
      setError("Please fill in guest name.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please login first to complete your booking.");
      return;
    }

    if (!selectedRoom) {
      setError("No room selected.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createHotelBooking(
        selectedRoom.ID,
        checkIn,
        checkOut,
        guests
      );

      // Get Snap Token
      try {
        const paymentRes = await createPaymentToken(res.booking_id);
        
        if (typeof window !== "undefined" && (window as any).snap) {
          (window as any).snap.pay(paymentRes.snap_token, {
            onSuccess: function() {
              router.push(`/booking/success?code=${res.booking_code}`);
            },
            onPending: function() {
              router.push(`/booking/placed?code=${res.booking_code}`);
            },
            onError: function() {
              router.push(`/booking/placed?code=${res.booking_code}`);
            },
            onClose: function() {
              router.push(`/booking/placed?code=${res.booking_code}`);
            }
          });
        } else {
          window.location.href = paymentRes.redirect_url;
        }
      } catch (payErr) {
        console.error("Payment token error:", payErr);
        router.push(`/booking/placed?code=${res.booking_code}`);
      }

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Booking failed. Please try again.";
      setError(message);
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-8 pt-24 lg:pt-32">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-2xl" />
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-8 pt-24 lg:pt-32">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/stays" className="hover:text-primary transition-colors">Stays</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/stays/list" className="hover:text-primary transition-colors">List</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/stays/list/${id}`} className="hover:text-primary transition-colors">Detail</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-primary">Booking</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Secure Your Stay</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Login Prompt */}
                {!getToken() && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                          <h3 className="font-bold text-foreground text-lg">Log in or Sign up to book faster</h3>
                          <p className="text-sm text-muted">Save your details for future bookings and earn points.</p>
                      </div>
                      <Link href="/login" className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 text-sm whitespace-nowrap">
                          Login Now
                      </Link>
                  </div>
                )}

                {/* Guest Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Guest Details</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground block">Full Name *</label>
                      <input 
                        type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Ahmad Rifai" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground block">Email Address</label>
                        <input 
                          type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="email@example.com" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground block">Phone Number</label>
                        <input 
                          type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+62 812 3456 7890" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stay Dates */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Stay Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground block">Check-in</label>
                      <input 
                        type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground block">Check-out</label>
                      <input 
                        type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground block">
                        Guests {selectedRoom && `(Max ${selectedRoom.max_guests})`}
                      </label>
                      <input 
                        type="number" value={guests} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setGuests(val);
                          if (selectedRoom && val > selectedRoom.max_guests) {
                            setError(`This room accommodates a maximum of ${selectedRoom.max_guests} guests.`);
                          } else if (error.includes("maximum of")) {
                            setError("");
                          }
                        }} 
                        min={1} 
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium ${selectedRoom && guests > selectedRoom.max_guests ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
                      />
                      {selectedRoom && guests > selectedRoom.max_guests && (
                        <p className="text-[10px] text-red-600 font-bold mt-1 uppercase tracking-wider">Capacity Exceeded</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex items-center gap-6">
                    <p className="text-sm text-muted mb-1 text-center w-full">By clicking Complete Booking, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.</p>
                </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <StaysBookingInfoCard 
                hotel={hotel}
                room={selectedRoom}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                onBooking={handleBooking}
                isSubmitting={isSubmitting}
              />
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

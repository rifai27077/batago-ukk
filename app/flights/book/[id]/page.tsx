"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { getFlightDetail, createFlightBooking, createPaymentToken, getToken, FlightResult } from "@/lib/api";
import BookingInfoCard from "@/components/flights/book/BookingInfoCard";
function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FlightBookingPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedClass = searchParams.get("class") || "economy";

  const [flight, setFlight] = useState<FlightResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function fetchFlight() {
      try {
        const res = await getFlightDetail(Number(id));
        // Map API response to match FlightResult interface
        const { flight, seats } = res.data;
        const flightResult: FlightResult = {
            ...flight,
            seats: seats.map(s => ({
                class: s.class,
                price: s.price,
                available_seats: s.available_seats
            }))
        };
        setFlight(flightResult);
      } catch {
        setError("Failed to load flight details.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchFlight();
  }, [id]);

  const selectedSeat = flight?.seats?.find(
    (s) => s.class.toLowerCase() === selectedClass.toLowerCase()
  ) || flight?.seats?.[0];

  const price = selectedSeat?.price || 0;
  const tax = Math.round(price * 0.11);
  const total = price + tax;

  async function handleBooking() {
    if (!firstName || !lastName) {
      setError("Please fill in passenger name.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please login first to complete your booking.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await createFlightBooking(
        Number(id),
        selectedClass,
        [{ name: `${firstName} ${lastName}`, type: "adult" }]
      );

      // Get Payment URL
      try {
        const paymentRes = await createPaymentToken(res.booking_id);
        
        if (typeof window !== "undefined" && (window as any).snap) {
          // Launch Midtrans popup
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
          // Fallback to standard redirect if snap is not loaded
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
                <div className="h-48 bg-gray-200 rounded-2xl" />
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
            <Link href="/flights" className="hover:text-primary transition-colors">Flights</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/flights/list" className="hover:text-primary transition-colors">List</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-primary">Booking</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Secure Your Booking</h1>

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
                      <Link href="/login" className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all text-sm whitespace-nowrap">
                          Login Now
                      </Link>
                  </div>
                )}

                {/* Passenger Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Passenger Details</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground block">First Name *</label>
                        <input 
                          type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. James" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground block">Last Name *</label>
                        <input 
                          type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Doe" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground block">Email Address</label>
                        <input 
                          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="james.doe@example.com" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground block">Phone Number</label>
                        <input 
                          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          placeholder="+62 812 3456 7890" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex items-center gap-6">
                    <p className="text-sm text-muted mb-1 text-center w-full">By clicking Complete Booking, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.</p>
                </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              {flight && (
                <BookingInfoCard 
                  flight={flight}
                  selectedClass={selectedClass}
                  onBooking={handleBooking}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

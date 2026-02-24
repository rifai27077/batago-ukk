"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProfile, getMyBookings, getToken, logout, BookingResult, AuthResponse } from "@/lib/api";
import { User, Plane, Bed, LogOut, Calendar, CreditCard, ChevronRight } from "lucide-react";

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [bookings, setBookings] = useState<BookingResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "flight" | "hotel">("all");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          getProfile(),
          getMyBookings(undefined, 1, 20),
        ]);
        setUser(profileRes.user);
        setBookings(bookingsRes.data || []);
      } catch {
        // Token invalid, redirect to login
        logout();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const filteredBookings = activeTab === "all"
    ? bookings
    : bookings.filter((b) => b.type === activeTab);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 font-sans">
        <Header />
        <main className="pt-28 pb-16 max-w-5xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-gray-200 rounded-3xl" />
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      <Header />

      <main className="pt-28 pb-16 max-w-5xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-linear-to-br from-primary to-primary/80 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{user?.name || "User"}</h1>
              <p className="text-white/80">{user?.email || ""}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                {user?.role || "member"}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Booking History */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "all", label: "All", icon: null },
              { key: "flight", label: "Flights", icon: Plane },
              { key: "hotel", label: "Hotels", icon: Bed },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.ID} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      booking.type === "flight" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {booking.type === "flight" ? <Plane className="w-6 h-6" /> : <Bed className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">{booking.partner?.company_name || "Unknown"}</p>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          booking.booking_status === "confirmed" ? "bg-green-100 text-green-700" :
                          booking.booking_status === "pending" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {booking.booking_status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          {booking.booking_code}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(booking.CreatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Total</p>
                      <p className="text-lg font-bold text-primary">{formatPrice(booking.total_amount)}</p>
                    </div>
                    <Link 
                      href={`/booking/success?code=${booking.booking_code}&type=${booking.type}&amount=${booking.total_amount}`}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {activeTab === "hotel" ? <Bed className="w-8 h-8 text-gray-400" /> : <Plane className="w-8 h-8 text-gray-400" />}
              </div>
              <p className="text-lg font-bold text-gray-900 mb-2">No bookings yet</p>
              <p className="text-gray-500 mb-6">Start exploring amazing destinations!</p>
              <div className="flex justify-center gap-3">
                <Link href="/flights" className="bg-primary text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Find Flights
                </Link>
                <Link href="/stays" className="bg-gray-100 text-gray-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-200 transition-all">
                  Find Hotels
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

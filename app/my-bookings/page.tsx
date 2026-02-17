import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingList from "@/components/bookings/BookingList";

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col font-sans">
      <Header />

      {/* Page Header */}
      <div className="mt-[72px] bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="text-muted mt-2">Manage your upcoming trips and view past history.</p>
        </div>
      </div>

      <main className="grow max-w-7xl mx-auto px-6 py-8 md:py-12 w-full">
        <BookingList />
      </main>

      <Footer />
    </div>
  );
}

import BookingSuccess from "@/components/booking/BookingSuccess";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col font-sans">
      <Header />
      <main className="grow flex items-center justify-center px-6 py-12 mt-[72px]">
        <BookingSuccess />
      </main>
      <Footer />
    </div>
  );
}

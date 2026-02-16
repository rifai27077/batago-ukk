"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaysDetailHero from "@/components/stays/detail/StaysDetailHero";
import StaysOverview from "@/components/stays/detail/StaysOverview";
import StaysPolicies from "@/components/stays/detail/StaysPolicies";
import StaysRoomList from "@/components/stays/detail/StaysRoomList";

export default function StaysDetailPage() {
  const hotelData = {
    title: "The Ritz-Carlton Bali",
    address: "Jalan Raya Nusa Dua Selatan Lot III, Sawangan, Nusa Dua, Bali, 80363",
    rating: 4.8,
    reviews: 1240,
    price: "Rp 4.500.000",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pb-12 lg:pb-24">
        {/* Hero Section */}
        <StaysDetailHero
          title={hotelData.title}
          address={hotelData.address}
          rating={hotelData.rating}
          reviews={hotelData.reviews}
          price={hotelData.price}
          images={hotelData.images}
        />

        {/* Overview & Amenities */}
        <StaysOverview />

        {/* Room List */}
        <StaysRoomList />

        {/* Policies Section */}
        <StaysPolicies />

      </main>

      <Footer />
    </div>
  );
}

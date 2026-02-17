"use client";

import { use } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Share2, Heart, Wifi, Coffee, Wind, Utensils, Check, ChevronLeft, ChevronRight, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
];

const ROOMS = [
  {
    id: 1,
    name: "Deluxe King Room",
    size: "32 m²",
    bed: "1 King Bed",
    capacity: "2 Adults",
    price: "Rp 850.000",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["City View", "Free WiFi", "Breakfast Included", "Non-smoking"],
  },
  {
    id: 2,
    name: "Executive Suite",
    size: "45 m²",
    bed: "1 King Bed + 1 Sofa Bed",
    capacity: "3 Adults",
    price: "Rp 1.500.000",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Ocean View", "Free WiFi", "Breakfast Included", "Lounge Access", "Bathtub"],
  },
  {
    id: 3,
    name: "Family Room",
    size: "50 m²",
    bed: "2 Queen Beds",
    capacity: "4 Adults",
    price: "Rp 2.100.000",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["Garden View", "Free WiFi", "Breakfast Included", "Connecting Rooms"],
  },
];

const AMENITIES = [
  { icon: Wifi, label: "Free High-Speed WiFi" },
  { icon: Coffee, label: "Free Breakfast" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Utensils, label: "Restaurant & Bar" },
  { icon: User, label: "24/7 Front Desk" },
  { icon: Check, label: "Daily Housekeeping" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HotelDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-6">
            <Breadcrumbs items={[
              { label: "Home", href: "/" },
              { label: "Stays", href: "/stays" },
              { label: "Hotel Santika Premiere" },
            ]} />
          </div>

          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">5 Stars</span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-gray-900">4.8</span> (124 reviews)
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Hotel Santika Premiere Batam</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Jalan Engku Putri No. 9, Batam Center, Batam, Indonesia</span>
                <Link href="#" className="text-sm text-primary font-medium hover:underline">Show on map</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-primary/20">
                Book Now
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px] mb-12 rounded-3xl overflow-hidden">
            <div className="md:col-span-2 md:row-span-2 relative h-[300px] md:h-auto group cursor-pointer">
              <Image 
                src={HOTEL_IMAGES[0]} 
                alt="Main Hotel Image" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                priority
              />
            </div>
            <div className="hidden md:grid grid-cols-2 col-span-2 row-span-2 gap-4">
               {HOTEL_IMAGES.slice(1).map((img, idx) => (
                 <div key={idx} className="relative h-full group cursor-pointer overflow-hidden rounded-xl">
                    <Image 
                      src={img} 
                      alt={`Gallery ${idx}`} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Overview */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Located in the centre of Batam, Hotel Santika Premiere consists of 45 spacious rooms and suites. 
                  This hotel provides a swimming pool, restaurant, and free WiFi throughout the property. 
                  Strategically situated, it is only a 15-minute drive from Hang Nadim International Airport and 
                  a 5-minute drive to the Ferry Terminal.
                </p>
              </section>

              {/* Amenities */}
              <section className="py-8 border-y border-gray-100">
                <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {AMENITIES.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 text-primary font-bold hover:underline">Show all 24 amenities</button>
              </section>

              {/* Available Rooms */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
                <div className="space-y-6">
                  {ROOMS.map((room) => (
                    <div key={room.id} className="border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all duration-300">
                      <div className="w-full md:w-64 h-48 relative rounded-xl overflow-hidden shrink-0">
                        <Image src={room.image} alt={room.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                         <div>
                           <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl font-bold">{room.name}</h3>
                           </div>
                           <div className="flex flex-wrap gap-2 mb-4">
                             {room.features.map((feat, i) => (
                               <span key={i} className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                                 {feat}
                               </span>
                             ))}
                           </div>
                           <div className="space-y-1 text-sm text-gray-500">
                             <p>• {room.size}</p>
                             <p>• {room.bed}</p>
                             <p>• Sleeps {room.capacity}</p>
                           </div>
                         </div>
                         
                         <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-100">
                           <div>
                             <p className="text-sm text-gray-500 line-through mb-1">Rp {parseInt(room.price.replace(/[^0-9]/g, '')) * 1.2}</p>
                             <p className="text-2xl font-bold text-primary">{room.price}</p>
                             <p className="text-xs text-gray-500">/ night includes taxes</p>
                           </div>
                           <Link href={`/stays/book/${id}?room=${room.id}`} className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-primary/20">
                             Select Room
                           </Link>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews Preview (Mock) */}
              <section className="py-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-2xl font-bold">Reviews</h2>
                   <Link href="#" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                      Give a Review
                   </Link>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-bold text-gray-900">4.8</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Exceptional</div>
                        <div className="text-sm text-gray-500">Based on 124 reviews</div>
                      </div>
                   </div>
                   {/* Rating Bars - Mock */}
                   <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-24 font-medium">Cleanliness</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{width: '95%'}}></div>
                        </div>
                        <span className="font-bold">4.9</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-24 font-medium">Location</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{width: '90%'}}></div>
                        </div>
                        <span className="font-bold">4.8</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                  {[1, 2].map((review) => (
                    <div key={review} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">JD</div>
                        <div>
                          <p className="font-bold text-sm">John Doe</p>
                          <p className="text-xs text-gray-500">Stayed in Jan 2024</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                          <Star className="w-3 h-3 fill-current" /> 5.0
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        "Amazing stay! The room was spacious and clean. The staff were incredibly helpful and the breakfast was delicious. Would definitely recommend."
                      </p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

             {/* Sticky Sidebar */}
             <div className="block lg:col-span-1">
                <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
                   <div className="flex items-center justify-between mb-6">
                      <p className="text-sm font-bold text-gray-500">Starting from</p>
                      <div className="text-right">
                         <p className="text-2xl font-bold text-primary">Rp 850.000</p>
                         <p className="text-xs text-gray-400">/ night</p>
                      </div>
                   </div>

                   <Link 
                     href={`/stays/book/${id}?room=1`} 
                     className="w-full block bg-primary hover:bg-primary/90 text-white font-bold text-center py-4 rounded-xl mb-4 transition-all shadow-lg shadow-primary/20"
                   >
                     Book Now
                   </Link>
                   
                   <p className="text-center text-xs text-gray-500 mb-6 font-medium">You won't be charged yet</p>

                   <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                         <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                         <div>
                            <p className="text-sm font-bold text-gray-900">Free Cancellation</p>
                            <p className="text-xs text-gray-500">Cancel up to 24 hours before check-in</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                         <div>
                            <p className="text-sm font-bold text-gray-900">Best Price Guarantee</p>
                            <p className="text-xs text-gray-500">Find a lower price? We'll match it.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, MapPin, ArrowRight, Plane, Mountain, Palmtree, Landmark } from "lucide-react";

interface DestinationItem {
  city: string;
  country: string;
  image: string;
  priceFrom: number;
  rating: number;
  category: "beach" | "mountain" | "city" | "adventure";
}

const destinations: DestinationItem[] = [
  {
    city: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800",
    priceFrom: 1200000,
    rating: 4.9,
    category: "beach"
  },
  {
    city: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800",
    priceFrom: 4500000,
    rating: 4.8,
    category: "city"
  },
  {
    city: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800",
    priceFrom: 1800000,
    rating: 4.7,
    category: "city"
  },
  {
    city: "Bangkok",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800",
    priceFrom: 950000,
    rating: 4.6,
    category: "city"
  },
  {
    city: "Sydney",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800",
    priceFrom: 5200000,
    rating: 4.9,
    category: "beach"
  },
  {
    city: "Swiss Alps",
    country: "Switzerland",
    image: "https://images.unsplash.com/photo-1517079810336-d39e72287591?q=80&w=800",
    priceFrom: 8500000,
    rating: 5.0,
    category: "mountain"
  },
  {
    city: "Seoul",
    country: "South Korea",
    image: "https://images.unsplash.com/photo-1630229446420-991180f9b69f?q=80&w=800",
    priceFrom: 3800000,
    rating: 4.7,
    category: "city"
  },
  {
    city: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800",
    priceFrom: 7200000,
    rating: 5.0,
    category: "beach"
  },
  {
    city: "Kuala Lumpur",
    country: "Malaysia",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800",
    priceFrom: 850000,
    rating: 4.5,
    category: "city"
  },
  {
    city: "Hokkaido",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1738394620508-55f7b4f79a09?q=80&w=800",
    priceFrom: 4200000,
    rating: 4.9,
    category: "mountain"
  },
  {
    city: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    priceFrom: 6500000,
    rating: 4.8,
    category: "adventure"
  },
  {
      city: "Cappadocia",
      country: "Turkey",
      image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800",
      priceFrom: 5800000,
      rating: 4.9,
      category: "adventure"
  }
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const categories = [
  { id: "all", label: "All Destinations", icon: Landmark },
  { id: "beach", label: "Beaches", icon: Palmtree },
  { id: "mountain", label: "Mountains", icon: Mountain },
  { id: "city", label: "Iconic Cities", icon: Plane },
  { id: "adventure", label: "Adventure", icon: MapPin },
];

export default function Destinations() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = activeCategory === "all" 
    ? destinations 
    : destinations.filter(d => d.category === activeCategory);

  return (
    <section className="py-32 px-6 bg-white overflow-hidden border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              Popular <span className="text-primary italic">Destinations</span>
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Discover unique places and exclusive deals for your next unforgettable journey. Curated just for you by BataGo.
            </p>
          </div>
          <Link
            href="/stays" 
            className="w-fit flex items-center gap-2 px-8 py-4 bg-gray-50 border border-gray-100 text-foreground font-bold rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-95 group"
          >
            Explore All 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105"
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${activeCategory === cat.id ? "text-white" : "text-gray-400"}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Masonry-style Staggered Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredItems.map((dest, index) => (
            <Link 
                key={dest.city} 
                href={`/stays/list?location=${encodeURIComponent(dest.city)}`}
                className="break-inside-avoid relative group rounded-4xl overflow-hidden shadow-2xl shadow-gray-200/50 cursor-pointer block"
            >
              <div className={`relative w-full ${
                  index % 3 === 0 ? "aspect-3/4" : 
                  index % 2 === 0 ? "aspect-square" : "aspect-4/5"
              }`}>
                <Image
                  src={dest.image}
                  alt={`${dest.city}, ${dest.country}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-1.5 text-white text-xs font-bold">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {dest.rating}
                    </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex flex-col gap-1 mb-4">
                    <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-1">
                        {dest.country}
                    </p>
                    <h3 className="text-2xl font-black text-white leading-tight">
                        {dest.city}
                    </h3>
                  </div>

                  {/* Hidden Price Section - Reveals on Hover */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-2">
                        <div>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Starts from</p>
                            <p className="text-white font-black text-lg">{formatPrice(dest.priceFrom)}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No destinations found</h3>
            <p className="text-muted">Try looking in a different category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

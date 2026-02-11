"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2, Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface FlightDetailHeroProps {
  title: string;
  address: string;
  rating: number;
  reviews: number;
  price: string;
  imageUrl: string;
}

export default function FlightDetailHero({
  title,
  address,
  rating,
  reviews,
  price,
  imageUrl,
}: FlightDetailHeroProps) {
  return (
    <section className="pt-28 pb-8 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted">
                <Link href="/flights" className="hover:text-primary transition-colors">Flights</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/flights/list" className="hover:text-primary transition-colors">List</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold text-primary">Detail</span>
            </div>
            
            <Link href="/flights/list" className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Back to search results
            </Link>
        </div>

        {/* Title Row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          {/* Left: Title + Address + Rating */}
          <div className="space-y-4 max-w-2xl">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-2 text-sm md:text-base text-foreground/70">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{address}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-[4px] shadow-sm shadow-primary/20">
                {rating.toFixed(1)}
              </div>
              <span className="text-sm md:text-base font-bold text-foreground">
                Very Good
              </span>
              <span className="text-sm md:text-base text-foreground/50 font-medium">
                • {reviews} reviews
              </span>
            </div>
          </div>

          {/* Right: Price + Actions */}
          <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
            <div className="text-right">
              <span className="text-sm font-bold text-secondary uppercase tracking-wider block mb-1">Starting from</span>
              <p className="text-3xl md:text-4xl font-bold text-secondary font-mono tracking-tight">
                {price}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="w-12 h-12 rounded-[4px] border border-foreground/10 flex items-center justify-center text-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-300 group shadow-sm">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-12 h-12 rounded-[4px] border border-foreground/10 flex items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all duration-300 group shadow-sm">
                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
                <Link href="/flights/book/1" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-[4px] font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2 w-full md:w-auto active:scale-95">
                  Book now
                </Link>
            </div>
          </div>
        </div>

        {/* Hero Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[450px] mt-8 rounded-[12px] overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-black/5">
          {/* Main Large Image */}
          <div className="md:col-span-3 relative h-full group overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-4">
                <button className="bg-white/90 backdrop-blur-md text-foreground text-xs font-bold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    View Interactive 360°
                </button>
            </div>
          </div>
          
          {/* Side Stacked Images */}
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="relative flex-1 group overflow-hidden bg-gray-100">
               <Image
                src="https://images.unsplash.com/photo-1542296332-2e44a99cfef9?q=80&w=800&auto=format&fit=crop"
                alt="Detail 1"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="relative flex-1 group overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800&auto=format&fit=crop"
                alt="Detail 2"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* "View All" Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                 <span className="text-white font-bold text-sm tracking-wide border-b border-white pb-0.5">View All Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

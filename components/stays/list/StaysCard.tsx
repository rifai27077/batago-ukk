"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

interface StaysCardProps {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  pricePerNight: string;
  amenities: string[];
  isFavourite?: boolean;
  onToggle?: () => void;
}

export default function StaysCard({
  id,
  name,
  image,
  location,
  rating,
  reviews,
  price,
  pricePerNight,
  amenities,
  isFavourite = false,
  onToggle,
}: StaysCardProps) {
  return (
    <div className="bg-white rounded-[12px] shadow-[0_4px_16px_rgba(17,34,17,0.05)] p-0 hover:shadow-[0_4px_24px_rgba(17,34,17,0.08)] transition-all flex flex-col lg:flex-row overflow-hidden border border-foreground/5">
      {/* Hotel Image Section */}
      <div className="relative w-full lg:w-[300px] h-48 lg:h-auto shrink-0">
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-white text-4xl font-bold opacity-50">
              {name ? name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() : 'HTL'}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-foreground">{rating}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
                <div className="flex items-center gap-1 text-sm text-foreground/60 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(rating) ? "text-primary fill-primary" : "text-gray-300"}`} 
                            />
                        ))}
                    </div>
                    <span className="text-xs text-foreground/50 font-medium">{reviews} reviews</span>
                </div>
                
                {/* Amenities Tags */}
                <div className="flex flex-wrap gap-2">
                    {amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-foreground/70">
                            {amenity}
                        </span>
                    ))}
                    {amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-foreground/70">
                            +{amenities.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            <div className="text-right hidden lg:block">
                <p className="text-xs text-foreground/50 font-bold tracking-wider mb-1">starting from</p>
                <div className="text-2xl font-bold text-secondary">{pricePerNight}</div>
                <p className="text-[10px] text-foreground/40 font-bold mb-1">excl. tax</p>
            </div>
        </div>

        {/* Mobile Price (Visible only on mobile) */}
        <div className="lg:hidden mt-4 flex justify-between items-end border-t border-foreground/5 pt-4">
             <div>
                <p className="text-xs text-foreground/50 font-bold tracking-wider mb-1">starting from</p>
                <div className="text-xl font-bold text-secondary">{pricePerNight}</div>
                <p className="text-[10px] text-foreground/40 font-bold">excl. tax</p>
             </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-6 border-t border-foreground/5 flex items-center gap-4">
             <button 
                onClick={(e) => {
                  e.preventDefault();
                  onToggle?.();
                }}
                className={`w-10 h-10 rounded-[4px] border ${isFavourite ? "bg-primary/10 border-primary text-primary" : "border-foreground/10 text-foreground"} flex items-center justify-center hover:bg-foreground/5 transition-colors shrink-0`}
             >
                <svg className={`w-4 h-4 ${isFavourite ? "fill-primary" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
             </button>
              <Link href={`/stays/list/${id}`} className="flex-1 bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-[4px] transition-all text-sm tracking-wider flex items-center justify-center">
                View Availability
              </Link>
        </div>
      </div>
    </div>
  );
}

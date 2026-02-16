"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, MapPin, Coffee } from "lucide-react";

interface FavouriteStaysCardProps {
  image: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  price: string;
  amenitiesCount: number;
}

export default function FavouriteStaysCard({
  image,
  name,
  address,
  rating,
  reviewCount,
  price,
  amenitiesCount,
}: FavouriteStaysCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
      {/* Image Section */}
      <div className="relative w-full md:w-[300px] h-48 md:h-auto shrink-0 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-foreground">
          9 images
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="w-3 h-3" />
              <span>{address}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted block">starting from</span>
            <div className="text-2xl font-bold text-secondary">
              {price}
              <span className="text-sm font-normal text-muted">/night</span>
            </div>
            <span className="text-[10px] text-muted block text-right">excl. tax</span>
          </div>
        </div>

        {/* Rating & Amenities */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
               {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-3 h-3 ${star <= Math.round(rating) ? "text-primary fill-primary" : "text-gray-300"}`} />
               ))}
            </div>
            <span className="text-xs text-foreground font-medium">5 Star Hotel</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
             <Coffee className="w-3 h-3" />
             <span>{amenitiesCount}+ Aminities</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-auto">
             <div className="px-2 py-1 border border-primary text-primary text-xs font-bold rounded-[4px]">
                {rating}
             </div>
             <span className="text-xs font-bold text-foreground">Very Good</span>
             <span className="text-xs text-foreground">{reviewCount} reviews</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 md:border-t-0 md:pt-0">
          <button className="w-12 h-10 border border-gray-300 rounded-[4px] flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5 fill-black text-black" />
          </button>
          <Link
            href="/stays/list/1"
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-10 rounded-[4px] flex items-center justify-center transition-colors text-sm"
          >
            View Place
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Maximize, BedDouble, Check } from "lucide-react";

export default function StaysRoomList() {
  const rooms = [
    {
      id: 1,
      name: "Deluxe King Room",
      size: "45 m²",
      bed: "1 extra-large double bed",
      guests: 2,
      price: "Rp 4.500.000",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop",
      features: ["Free Cancellation", "Breakfast Included", "Ocean View"]
    },
    {
      id: 2,
      name: "Junior Suite with Pool View",
      size: "65 m²",
      bed: "1 extra-large double bed",
      guests: 3,
      price: "Rp 6.200.000",
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=600&auto=format&fit=crop",
      features: ["Free Cancellation", "Breakfast Included", "Private Balcony", "Bathtub"]
    },
    {
       id: 3,
       name: "Two-Bedroom Villa with Private Pool",
       size: "120 m²",
       bed: "2 extra-large double beds",
       guests: 4,
       price: "Rp 12.500.000",
       image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
       features: ["Private Pool", "Living Room", "Kitchenette", "Butler Service"]
    }
  ];

  return (
    <section className="py-12 px-4 lg:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-8">Available Rooms</h2>

        <div className="grid grid-cols-1 gap-6">
            {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="relative w-full md:w-72 h-48 md:h-auto rounded-xl overflow-hidden shrink-0">
                        <Image src={room.image} alt={room.name} fill className="object-cover" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">{room.name}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-muted">
                                    <div className="flex items-center gap-1.5">
                                        <Maximize className="w-4 h-4" />
                                        <span>{room.size}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BedDouble className="w-4 h-4" />
                                        <span>{room.bed}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        <span>Up to {room.guests} guests</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {room.features.map((feat, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                        <Check className="w-3 h-3" />
                                        {feat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex flex-col justify-end items-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                            <div className="text-right">
                                <span className="text-xs text-muted block mb-1">Price per night</span>
                                <p className="text-2xl font-bold text-primary">{room.price}</p>
                                <p className="text-xs text-muted">+ Rp 450.000 taxes and charges</p>
                            </div>
                            <Link 
                                href="/stays/book/1" 
                                className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-xl font-bold text-center transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 mt-2"
                            >
                                Reserve
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}

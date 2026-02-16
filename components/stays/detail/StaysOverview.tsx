"use client";

import { Wifi, Waves, Coffee, Dumbbell, Car, Utensils, Sparkles, Wind } from "lucide-react";

export default function StaysOverview() {
  const amenities = [
    { label: "Free Wifi", icon: Wifi },
    { label: "Swimming Pool", icon: Waves },
    { label: "Breakfast Included", icon: Coffee },
    { label: "Fitness Center", icon: Dumbbell },
    { label: "Free Parking", icon: Car },
    { label: "Restaurant", icon: Utensils },
    { label: "Spa & Wellness", icon: Sparkles },
    { label: "Air Conditioning", icon: Wind },
  ];

  return (
    <section className="py-12 px-4 lg:px-6 bg-gray-50/50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Overview</h2>
            <p className="text-foreground/80 leading-relaxed">
                Located on the beachfront in Nusa Dua, The Ritz-Carlton Bali is a luxury resort with a tropical climate. Featuring a spacious layout, the resort offers a sun terrace and an outdoor pool. Guests can enjoy a meal at the restaurant or a drink at the bar. Free WiFi is available throughout the property.
            </p>
            <p className="text-foreground/80 leading-relaxed">
                Every room at this resort is air conditioned and is equipped with a flat-screen TV with satellite channels. Certain units feature a seating area where you can relax. Enjoy a cup of tea while looking out at the sea or pool. Every room enters a private bathroom. For your comfort, you will find bathrobes, slippers and free toiletries.
            </p>
        </div>

        {/* Amenities */}
        <div className="lg:col-span-1">
             <h3 className="text-xl font-bold text-foreground mb-6">Popular Amenities</h3>
             <div className="grid grid-cols-2 gap-4">
                {amenities.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary">
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground/80">{item.label}</span>
                        </div>
                    )
                })}
             </div>
             <button className="mt-8 text-primary font-bold text-sm hover:underline">
                View all 45 amenities
             </button>
        </div>

      </div>
    </section>
  );
}

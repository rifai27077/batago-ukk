"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

const thumbnails = [
  "https://images.unsplash.com/photo-1540339832862-474599807836?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583202702250-958cd41cdf03?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop",
];

const classOptions = [
  { 
      label: "Economy", 
      id: "economy", 
      image: "https://images.unsplash.com/photo-1540339832862-474599807836?q=80&w=300&auto=format&fit=crop" 
  },
  { 
      label: "First Class", 
      id: "first", 
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=300&auto=format&fit=crop" 
  },
  { 
      label: "Business Class", 
      id: "business", 
      image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=300&auto=format&fit=crop" 
  },
];

export default function EconomyFeatures() {
  const [selectedClass, setSelectedClass] = useState("economy");

  return (
    <section className="py-12 px-4 lg:px-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
                Onboard Experience
            </h2>
            <p className="text-foreground/60">Select a cabin class to view features and gallery.</p>
        </div>

        {/* Class Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {classOptions.map((opt) => {
                const isSelected = selectedClass === opt.id;
                return (
                    <div 
                        key={opt.id}
                        onClick={() => setSelectedClass(opt.id)}
                        className={`relative group cursor-pointer rounded-[12px] overflow-hidden border-2 transition-all duration-300 ${
                            isSelected 
                            ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20 ring-offset-2" 
                            : "border-transparent hover:border-gray-200"
                        }`}
                    >
                        <div className="relative h-48 w-full">
                            <Image 
                                src={opt.image} 
                                alt={opt.label}
                                fill
                                className={`object-cover transition-transform duration-500 ${isSelected ? "scale-105" : "group-hover:scale-105"}`}
                            />
                            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSelected ? "opacity-20" : "opacity-40 group-hover:opacity-20"}`} />
                            
                            {/* Checkmark Badge */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in-50 duration-300">
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                                <h3 className="text-white font-bold text-lg tracking-wide">{opt.label}</h3>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Thumbnail Gallery */}
        <div className="w-full relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {thumbnails.map((src, idx) => (
                <div
                    key={idx}
                    className="relative w-[160px] h-[120px] sm:w-[200px] sm:h-[150px] rounded-[12px] overflow-hidden shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(17,34,17,0.05)] ring-1 ring-black/5 snap-start group"
                >
                    <Image
                        src={src}
                        alt={`Feature ${idx + 1}`}
                        fill
                        className="object-cover group-hover:brightness-110 transition-all"
                    />
                </div>
            ))}
            </div>
            {/* Fade effect on right */}
            <div className="absolute top-0 right-0 bottom-4 w-24 bg-linear-to-l from-gray-50/50 to-transparent pointer-events-none" />
        </div>

      </div>
    </section>
  );
}

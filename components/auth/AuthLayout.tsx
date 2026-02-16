"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  reverse?: boolean; // If true, image is on the left
  image: string;
}

export default function AuthLayout({ children, reverse = false, image }: AuthLayoutProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock carousel images (in a real app, these could be props)
  const images = [
      image,
     "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
     "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans bg-white">
      <div className={`w-full max-w-[1200px] flex flex-col md:flex-row gap-8 items-stretch ${reverse ? "md:flex-row-reverse" : ""}`}>
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-8 lg:px-12 py-8">
             <Link href="/" className="mb-8 inline-block select-none">
                <Image src="/batago.svg" alt="BataGo" width={100} height={32} className="h-8 w-auto" />
             </Link>
             {children}
        </div>

        {/* Image Section */}
        <div className="hidden md:block w-full md:w-1/2 relative min-h-[500px] rounded-[24px] overflow-hidden self-stretch">
             {images.map((img, idx) => (
                 <Image
                    key={idx}
                    src={img}
                    alt="Auth Background"
                    fill
                    className={`object-cover transition-opacity duration-1000 ${idx === currentImageIndex ? "opacity-100" : "opacity-0"}`}
                    priority={idx === 0}
                 />
             ))}
             
             {/* Carousel Indicators */}
             <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "w-6 bg-primary" : "bg-white/50 hover:bg-white"}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
             </div>
        </div>

      </div>
    </div>
  );
}

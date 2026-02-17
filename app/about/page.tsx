"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[400px] flex items-center justify-center bg-blue-900 text-white overflow-hidden">
             <div className="absolute inset-0 bg-black/40 z-10"></div>
             <Image 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop" 
                alt="Travel" 
                fill 
                className="object-cover"
                priority
            />
            <div className="relative z-20 text-center max-w-2xl px-6 pt-[72px]">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Journey</h1>
                <p className="text-lg text-white/90">Connecting people, places, and cultures through seamless travel experiences.</p>
            </div>
        </div>

        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                     <h2 className="text-3xl font-bold text-foreground mb-6">Who We Are</h2>
                     <p className="text-muted leading-relaxed mb-6">
                        BataGo was founded with a simple mission: to make travel accessible, affordable, and enjoyable for everyone. 
                        We believe that travel is more than just moving from point A to point B; it's about the memories created, 
                        the cultures experienced, and the horizons expanded.
                     </p>
                     <p className="text-muted leading-relaxed">
                        Started as a small team of travel enthusiasts, we have grown into a leading OTA platform, 
                        serving thousands of travelers daily. Our commitment to technology and customer satisfaction 
                        drives everything we do.
                     </p>
                </div>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                    <Image 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" 
                        alt="Our Team" 
                        fill 
                        className="object-cover"
                    />
                </div>
            </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
                    <p className="text-muted max-w-2xl mx-auto">The principles that guide our decisions and shape our culture.</p>
                 </div>

                 <div className="grid md:grid-cols-3 gap-8">
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl mb-3">Customer First</h3>
                        <p className="text-muted">We prioritize our customers' needs and satisfaction in every feature we build and service we provide.</p>
                     </div>
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl mb-3">Innovation</h3>
                        <p className="text-muted">We constantly push boundaries to find better, smarter, and easier ways to help you see the world.</p>
                     </div>
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl mb-3">Passion</h3>
                        <p className="text-muted">We love travel and we love what we do. That passion is reflected in the quality of our platform.</p>
                     </div>
                 </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

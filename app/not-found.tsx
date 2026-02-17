"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8 animate-float">
             <Image 
                src="/404.svg" // Assuming you might have one, or use a placeholder
                alt="404 Not Found"
                fill
                className="object-contain"
                onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.style.display = 'none';
                }}
             />
             {/* Fallback visual if image fails or for styling */}
             <div className="absolute inset-0 flex items-center justify-center text-[12rem] font-bold text-gray-100 -z-10 select-none">
                404
             </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted text-lg max-w-md mx-auto mb-8">
            Oops! It seems like you've wandered off the map. The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
             <button onClick={() => window.history.back()} className="px-6 py-3 bg-white border border-gray-200 text-foreground font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back
             </button>
             <Link href="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Return Home
             </Link>
        </div>
    </div>
  );
}

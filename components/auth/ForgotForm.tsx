"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FloatingInput from "@/components/ui/FloatingInput";

export default function ForgotForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Link href="/login" className="inline-flex items-center text-sm font-semibold text-foreground mb-8 hover:opacity-80 transition-opacity">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to login
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Forgot your password?</h1>
      <p className="text-muted mb-10 leading-relaxed">
        Don't worry, happens to all of us. Enter your email below to recover your password
      </p>

      <form className="space-y-6">
        <FloatingInput 
            label="Email" 
            id="email" 
            type="email" 
            placeholder="john.doe@gmail.com" 
        />

        <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20"
        >
            Submit
        </button>
      </form>
    </div>
  );
}

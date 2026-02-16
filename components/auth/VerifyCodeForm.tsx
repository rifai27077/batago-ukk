"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FloatingInput from "@/components/ui/FloatingInput";

export default function VerifyCodeForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Link href="/login" className="inline-flex items-center text-sm font-semibold text-foreground mb-8 hover:opacity-80 transition-opacity">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to login
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Verify code</h1>
      <p className="text-muted mb-10 leading-relaxed">
        An authentication code has been sent to your email.
      </p>

      <form className="space-y-6">
        <FloatingInput 
            label="Enter Code" 
            id="code" 
            type="text" 
            placeholder="7789BM6X" 
        />

        <div className="text-sm font-medium text-foreground">
            Didn't receive a code? <button type="button" className="text-secondary hover:underline">Resend</button>
        </div>

        <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20"
        >
            Verify
        </button>
      </form>
    </div>
  );
}

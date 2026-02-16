"use client";

import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";

export default function RegisterForm() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-foreground mb-3">Sign up</h1>
      <p className="text-muted mb-10">Let's get you all st up so you can access your personal account.</p>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput 
                label="First Name" 
                id="firstName" 
                placeholder="John" 
            />
            <FloatingInput 
                label="Last Name" 
                id="lastName" 
                placeholder="Doe" 
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput 
                label="Email" 
                id="email" 
                type="email" 
                placeholder="john.doe@gmail.com" 
            />
            <FloatingInput 
                label="Phone Number" 
                id="phone" 
                type="tel" 
                placeholder="+1 123 456 7890" 
            />
        </div>

        <FloatingInput 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="********"
        />
        
        <FloatingInput 
            label="Confirm Password" 
            id="confirmPassword" 
            type="password" 
            placeholder="********"
        />

        <div className="flex items-center gap-2 mt-4 mb-8">
            <input 
                type="checkbox" 
                id="terms" 
                className="w-5 h-5 border-2 border-gray-400 rounded focus:ring-primary text-primary" 
            />
            <label htmlFor="terms" className="text-sm font-medium text-foreground">
                I agree to all the <Link href="#" className="text-secondary hover:underline">Terms</Link> and <Link href="#" className="text-secondary hover:underline">Privacy Policies</Link>
            </label>
        </div>

        <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 mb-6"
        >
            Create account
        </button>

        <p className="text-sm font-medium text-foreground text-center">
            Already have an account? <Link href="/login" className="text-secondary hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

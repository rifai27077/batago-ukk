"use client";

import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";

export default function LoginForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-foreground mb-3">Login</h1>
      <p className="text-muted mb-10">Login to access your BataGo account</p>

      <form className="space-y-2">
        <FloatingInput 
            label="Email" 
            id="email" 
            type="email" 
            placeholder="john.doe@gmail.com" 
        />
        <FloatingInput 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="For demo: any password"
        />

        <div className="flex items-center justify-between mt-2 mb-8">
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="remember" 
                    className="w-5 h-5 border-2 border-gray-400 rounded focus:ring-primary text-primary" 
                />
                <label htmlFor="remember" className="text-sm font-medium text-foreground">Remember me</label>
            </div>
            <Link href="/forgot-password" className="text-sm font-medium text-secondary hover:underline">
                Forgot Password
            </Link>
        </div>

        <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 mb-6"
        >
            Login
        </button>

        <p className="text-sm font-medium text-foreground">
            Don't have an account? <Link href="/register" className="text-secondary hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

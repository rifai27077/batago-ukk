"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";
import { register } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms and Privacy Policies");
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName, email, password, phone);
      router.push(`/verify-code?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-3">Sign up</h1>
      <p className="text-muted mb-10">Let&apos;s get you all set up so you can access your personal account.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput 
                label="First Name" 
                id="firstName" 
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <FloatingInput 
                label="Last Name" 
                id="lastName" 
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingInput 
                label="Email" 
                id="email" 
                type="email" 
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <FloatingInput 
                label="Phone Number" 
                id="phone" 
                type="tel" 
                placeholder="+62 812 3456 7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
        </div>

        <FloatingInput 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        
        <FloatingInput 
            label="Confirm Password" 
            id="confirmPassword" 
            type="password" 
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="flex items-center gap-2 mt-4 mb-8">
            <input 
                type="checkbox" 
                id="terms" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 border-2 border-gray-400 rounded focus:ring-primary text-primary" 
            />
            <label htmlFor="terms" className="text-sm font-medium text-foreground">
                I agree to all the <Link href="/terms" className="text-secondary hover:underline">Terms</Link> and <Link href="/privacy" className="text-secondary hover:underline">Privacy Policies</Link>
            </label>
        </div>

        <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm font-medium text-foreground text-center">
            Already have an account? <Link href="/login" className="text-secondary hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

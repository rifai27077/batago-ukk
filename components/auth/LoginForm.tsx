"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";
import { login } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      // Check for email verification error from backend
      if (err.message === "Email not verified" || err.message?.includes("EMAIL_NOT_VERIFIED")) {
        router.push(`/verify-code?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-3">Login</h1>
      <p className="text-muted mb-10">Login to access your BataGo account</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-2" onSubmit={handleSubmit}>
        <FloatingInput 
            label="Email" 
            id="email" 
            type="email" 
            placeholder="john.doe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <FloatingInput 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm font-medium text-foreground">
            Don't have an account? <Link href="/register" className="text-secondary hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

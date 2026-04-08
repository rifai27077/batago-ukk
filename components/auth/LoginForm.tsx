"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      if (err.message === "Email not verified" || err.message?.includes("EMAIL_NOT_VERIFIED")) {
        router.push(`/verify-code?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Welcome Back 👋</h1>
        <p className="text-gray-500 font-medium text-sm">Please enter your details to sign in.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm mb-6 flex animate-in fade-in" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input 
            id="email"
            type="email" 
            autoComplete="email"
            placeholder="john.doe@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-gray-300 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
          />
        </div>

        <div className="space-y-1.5 relative">
          <label className="block text-sm font-bold text-gray-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              autoComplete="current-password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 pb-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                className="peer w-5 h-5 border-2 border-gray-300 rounded cursor-pointer appearance-none checked:bg-primary checked:border-primary transition-all" 
              />
              <svg className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !email || !password}
          className="w-full relative flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-[0_8px_30px_rgb(20,184,166,0.2)] hover:shadow-[0_8px_30px_rgb(20,184,166,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>



      <p className="text-center text-sm font-medium text-gray-600 mt-8">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

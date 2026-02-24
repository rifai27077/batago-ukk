"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FloatingInput from "@/components/ui/FloatingInput";
import { verifyEmail, resendVerification } from "@/lib/api";

export default function VerifyCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError("");
    setSuccess("");
    try {
        await resendVerification(email);
        setSuccess("Verification code resent! Check your email.");
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
        setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await verifyEmail(email, code);
      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setIsLoading(false); // Stop loading only on error
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link href="/login" className="inline-flex items-center text-sm font-semibold text-foreground mb-8 hover:opacity-80 transition-opacity">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to login
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-3">Verify code</h1>
      <p className="text-muted mb-10 leading-relaxed">
        An authentication code has been sent to your email 
        {email && <span className="font-semibold text-foreground"> {email}</span>}.
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {success}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <FloatingInput 
            label="Enter Code" 
            id="code" 
            type="text" 
            placeholder="e.g. 123456" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
        />

        <div className="text-sm font-medium text-foreground">
            Didn't receive a code? <button type="button" onClick={handleResend} disabled={isResending} className="text-secondary hover:underline disabled:opacity-50 disabled:cursor-not-allowed">{isResending ? "Resending..." : "Resend"}</button>
        </div>

        <button 
            type="submit" 
            disabled={isLoading || !code}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

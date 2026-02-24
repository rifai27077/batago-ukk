import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FloatingInput from "@/components/ui/FloatingInput";
import { forgotPassword } from "@/lib/api";

export default function ForgotForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSuccess("Reset code sent! Redirecting...");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

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
            label="Email" 
            id="email" 
            type="email" 
            placeholder="john.doe@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        <button 
            type="submit" 
            disabled={isLoading || !email}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

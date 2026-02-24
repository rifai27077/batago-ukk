import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingInput from "@/components/ui/FloatingInput";
import { resetPassword } from "@/lib/api";

export default function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is missing. Try again from the Forgot Password page.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await resetPassword(email, code, password, confirmPassword);
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Set a password</h1>
      <p className="text-muted mb-10 leading-relaxed">
        Please enter the code sent to your email and set a new password for your account.
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FloatingInput 
            label="Reset Code" 
            id="code" 
            type="text" 
            placeholder="e.g. 123456" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
        />

        <FloatingInput 
            label="Create Password" 
            id="password" 
            type="password" 
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        
        <FloatingInput 
            label="Re-enter Password" 
            id="confirmPassword" 
            type="password" 
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />

        <div className="pt-4">
            <button 
                type="submit" 
                disabled={isLoading || !code || !password}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Updating..." : "Set password"}
            </button>
        </div>
      </form>
    </div>
  );
}

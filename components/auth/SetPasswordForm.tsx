"use client";

import FloatingInput from "@/components/ui/FloatingInput";
import Image from "next/image";

export default function SetPasswordForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Note: The design for Set Password doesn't show "Back to login", but we can keep the logo or standard header if consistent with Login/Register pages layout logic. 
          However, usually this page comes from a link so "Back" might not be needed, but the logo is typically present in the AuthLayout. 
      */}
      
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Set a password</h1>
      <p className="text-muted mb-10 leading-relaxed">
        Your previous password has been reseted. Please set a new password for your account.
      </p>

      <form className="space-y-4">
        <FloatingInput 
            label="Create Password" 
            id="password" 
            type="password" 
            placeholder="********"
        />
        
        <FloatingInput 
            label="Re-enter Password" 
            id="confirmPassword" 
            type="password" 
            placeholder="********"
        />

        <div className="pt-4">
            <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20"
            >
                Set password
            </button>
        </div>
      </form>
    </div>
  );
}

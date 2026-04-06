"use client";

import { useState, useEffect } from "react";
import FloatingInput from "@/components/ui/FloatingInput";
import { X, Check, ShieldCheck, Briefcase, AlertCircle, Mail } from "lucide-react";
import { getProfile, updateProfile, resendVerification } from "@/lib/api";



export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    is_verified: false,
    partner_status: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        if (res.user) {
            setFormData({
                name: res.user.name,
                email: res.user.email,
                phone: res.user.phone,
                is_verified: !!res.user.is_verified,
                partner_status: res.user.partner_status || "",
            });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    if (!formData.email) return;
    setIsResending(true);
    try {
        await resendVerification(formData.email);
        setMessage({ type: "success", text: "Verification email sent! Please check your inbox." });
    } catch (err) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to resend verification email" });
    } finally {
        setIsResending(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
        await updateProfile({
            name: formData.name,
            phone: formData.phone
        });
        setMessage({ type: "success", text: "Profile information updated successfully!" });
        
        // Notify Header to refresh profile data
        window.dispatchEvent(new Event("profileUpdated"));

        // Refresh profile to confirm
        const res = await getProfile();
        if (res.user) {
            setFormData(prev => ({
                ...prev,
                name: res.user?.name || prev.name,
                phone: res.user?.phone || prev.phone
            }));
        }
    } catch (err) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update profile" });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Verification Notice */}
      {!formData.is_verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-amber-900 mb-1">Verify your email</h3>
                <p className="text-sm text-amber-700 leading-relaxed max-w-lg">
                    Verify your email to secure your account and unlock all features like ticket downloads and writing reviews.
                </p>
            </div>
            <button 
                type="button"
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-amber-100 border border-amber-200 text-amber-800 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isResending ? (
                    <>Verifying...</>
                ) : (
                    <>
                        <Mail className="w-4 h-4" />
                        Resend Email
                    </>
                )}
            </button>
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
          {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg text-gray-900">{formData.name || "Your Profile"}</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
              {formData.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-tight">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Account
                  </span>
              )}
              {formData.partner_status && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-tight">
                      <Briefcase className="w-3 h-3" />
                      Partner: {formData.partner_status}
                  </span>
              )}
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 border ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 
            message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 
            'bg-blue-50 text-blue-700 border-blue-100'
        }`}>
            {message.type === 'success' && <Check className="w-4 h-4" />}
            {message.type === 'error' && <X className="w-4 h-4" />}
            {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <FloatingInput
          label="Full Name"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <FloatingInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <FloatingInput
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-10 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving Settings..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";
import AuthLayout from "@/components/auth/AuthLayout";
import BecomePartnerForm from "@/components/auth/BecomePartnerForm";

export default function BecomePartnerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkPartnerStatus() {
      try {
        const token = localStorage.getItem("batago_token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await getProfile();
        if (res.user?.partner_status === "APPROVED") {
          router.push("/partner/dashboard");
        } else if (res.user?.partner_status === "IN_REVIEW" || res.user?.partner_status === "REJECTED") {
           router.push("/account/partner");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to check partner status", error);
        setIsLoading(false);
      }
    }

    checkPartnerStatus();
  }, [router]);

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1436450412740-6b988f486c6b?q=80&w=2000&auto=format&fit=crop">
      <BecomePartnerForm />
    </AuthLayout>
  );
}

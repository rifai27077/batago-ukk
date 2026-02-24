"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import PartnerRegisterForm from "@/components/auth/PartnerRegisterForm";

export default function PartnerRegisterPage() {
  return (
    <AuthLayout 
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    >
      <PartnerRegisterForm />
    </AuthLayout>
  );
}

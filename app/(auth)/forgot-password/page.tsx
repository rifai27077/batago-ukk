"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import ForgotForm from "@/components/auth/ForgotForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout image="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80">
      <ForgotForm />
    </AuthLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ThemeProvider } from "@/components/partner/dashboard/ThemeProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("batago_token");
        if (!token) {
          router.push("/login?callbackUrl=/admin");
          return;
        }

        const res = await getProfile();
        if (!res.user) {
          router.push("/login?callbackUrl=/admin");
          return;
        }

        if (res.user.role !== "ADMIN") {
          router.push("/");
          return;
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Admin auth check failed", err);
        router.push("/login?callbackUrl=/admin");
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans flex transition-colors duration-300">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div
          className={`min-h-screen flex-1 flex flex-col transition-[margin-left] duration-300 overflow-x-hidden ${
            sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
          }`}
        >
          <AdminTopBar onMenuToggle={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";
import Sidebar from "@/components/partner/dashboard/Sidebar";
import TopBar from "@/components/partner/dashboard/TopBar";
import { ThemeProvider } from "@/components/partner/dashboard/ThemeProvider";
import { DateRangeProvider } from "@/components/partner/dashboard/DateRangeContext";
import { PartnerProvider, usePartner } from "@/components/partner/dashboard/PartnerContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // We can use partnerType here if we need it for layout logic, but for now Sidebar/TopBar use it internally.
  // We still need to pass state for Sidebar open/close.

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("batago_token");
        if (!token) {
          router.push("/login?callbackUrl=/partner/dashboard");
          return;
        }

        const res = await getProfile();
        if (!res.user) {
           router.push("/login?callbackUrl=/partner/dashboard");
           return;
        }

        if (res.user.partner_status !== "APPROVED") {
          router.push("/account/partner");
          return;
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/login?callbackUrl=/partner/dashboard");
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans flex transition-colors duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content — offset by sidebar width */}
      <div
        className={`min-h-screen flex-1 flex flex-col transition-[margin-left] duration-300 overflow-x-hidden ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        <TopBar 
          onMenuToggle={() => setSidebarOpen(true)} 
        />

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DateRangeProvider>
        <PartnerProvider>
          <DashboardContent>{children}</DashboardContent>
        </PartnerProvider>
      </DateRangeProvider>
    </ThemeProvider>
  );
}

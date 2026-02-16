"use client";

import { useState } from "react";
import Sidebar from "@/components/partner/dashboard/Sidebar";
import TopBar from "@/components/partner/dashboard/TopBar";
import { ThemeProvider } from "@/components/partner/dashboard/ThemeProvider";
import { DateRangeProvider } from "@/components/partner/dashboard/DateRangeContext";
import { PartnerProvider, usePartner } from "@/components/partner/dashboard/PartnerContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // We can use partnerType here if we need it for layout logic, but for now Sidebar/TopBar use it internally.
  // We still need to pass state for Sidebar open/close.

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

"use client";

import { useState } from "react";
import Sidebar from "@/components/partner/dashboard/Sidebar";
import TopBar from "@/components/partner/dashboard/TopBar";
import { ThemeProvider } from "@/components/partner/dashboard/ThemeProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content — offset by sidebar width */}
        <div
          className={`min-h-screen flex flex-col transition-[margin-left] duration-300 overflow-x-hidden ${
            sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
          }`}
        >
          <TopBar onMenuToggle={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

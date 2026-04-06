"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProfile } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ThemeProvider } from "@/components/partner/dashboard/ThemeProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [subRole, setSubRole] = useState<string>("");

  const routePermissions: Record<string, string[]> = {
    "/admin/activity-log": ["super_admin"],
    "/admin/users": ["super_admin", "support"],
    "/admin/partners": ["super_admin", "support"],
    "/admin/bookings": ["super_admin", "support", "finance"],
    "/admin/finance": ["super_admin", "finance"],
    "/admin/reports": ["super_admin", "finance"],
    "/admin/team": ["super_admin"],
    "/admin/settings": ["super_admin"],
  };

  useEffect(() => {
    async function initAuth() {
      try {
        const token = localStorage.getItem("batago_token");
        if (!token) {
          router.push("/login?callbackUrl=/admin");
          return;
        }

        const res = await getProfile();
        if (!res.user || res.user.role !== "ADMIN") {
          router.push("/login?callbackUrl=/admin");
          return;
        }

        const userSubRole = (res.user as any).sub_role || "";
        setSubRole(userSubRole);
      } catch (err) {
        console.error("Admin auth check failed", err);
        router.push("/login?callbackUrl=/admin");
      } finally {
        setIsLoading(false);
      }
    }

  if (isLoading) {
      initAuth();
    }
  }, [router, isLoading]);

  // Check path permissions synchronously logic
  let isAuthorized = true;
  if (!isLoading) {
    for (const [route, allowedRoles] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route)) {
        if (!subRole || !allowedRoles.includes(subRole)) {
          isAuthorized = false;
          break;
        }
      }
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      console.warn(`Unauthorized access to ${pathname} for role ${subRole}`);
      router.push("/admin");
    }
  }, [isLoading, isAuthorized, pathname, router, subRole]);

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
            {!isAuthorized ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                <p className="text-gray-500 dark:text-slate-400">Redirecting to dashboard...</p>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

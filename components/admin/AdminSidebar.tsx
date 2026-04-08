"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Wallet,
  FileText,
  Settings,
  Shield,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  History,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, roles: ["super_admin", "support", "finance", "content"] },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, roles: ["super_admin", "support", "finance", "content"] },
  { label: "Activity Log", href: "/admin/activity-log", icon: History, roles: ["super_admin"] },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["super_admin", "support"] },
  { label: "Partners", href: "/admin/partners", icon: Building2, roles: ["super_admin", "support"] },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck, roles: ["super_admin", "support", "finance"] },
  { label: "Finance", href: "/admin/finance", icon: Wallet, roles: ["super_admin", "finance"] },
  // { label: "Content", href: "/admin/content", icon: FileText, roles: ["super_admin", "content"] },
  { label: "Team", href: "/admin/team", icon: Shield, roles: ["super_admin"] },
  // { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["super_admin"] },
  { label: "Reports", href: "/admin/reports", icon: FileText, roles: ["super_admin", "finance"] },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [subRole, setSubRole] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const api = await import("@/lib/api");
        const res = await api.getProfile();
        // Assuming sub_role is returned in user object or somewhere
        if (res.user && (res.user as any).sub_role) {
          setSubRole((res.user as any).sub_role);
        }
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    };
    fetchProfile();
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("batago_token");
    router.push("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-white dark:bg-slate-800 border-r border-gray-200/80 dark:border-slate-700
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-[72px] overflow-hidden" : "lg:w-[260px]"}
          w-[270px]
        `}
      >
        {/* Logo Area */}
        <div className={`flex items-center h-[64px] border-b border-gray-100 dark:border-slate-700 shrink-0 ${isCollapsed ? "justify-center px-3" : "justify-between px-5"}`}>
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">BataGo</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                Admin
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin" className="flex items-center justify-center">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/20">
                <span className="text-white font-bold text-sm">B</span>
              </div>
            </Link>
          )}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 p-1.5 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-5 pt-5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-slate-500">Main Menu</span>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? "px-2 pt-4 overflow-hidden" : "px-3 overflow-y-auto"} space-y-0.5 scrollbar-none`}>
          {navItems
            .filter(item => !subRole || item.roles.includes(subRole))
            .map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-3 rounded-xl text-[13px] font-medium
                    transition-all duration-200 group relative
                    ${isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}
                    ${active
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100/80 dark:hover:bg-slate-700"
                    }
                  `}
                >
                  <div className={`flex items-center justify-center ${isCollapsed ? "" : "w-8 h-8 rounded-lg"}`}>
                    <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-white" : "text-gray-400 dark:text-slate-500 group-hover:text-gray-700 dark:group-hover:text-slate-300"} transition-colors`} />
                  </div>
                  {!isCollapsed && <span>{item.label}</span>}

                  {/* Active indicator bar */}
                  {active && !isCollapsed && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary/30 rounded-l-full" />
                  )}

                  {/* Tooltip for collapsed */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-60">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-slate-700 p-3 space-y-0.5">
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 dark:text-slate-500 hover:bg-gray-100/80 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-[18px] h-[18px] mx-auto" />
            ) : (
              <>
                <div className="w-8 h-8 flex items-center justify-center">
                  <ChevronLeft className="w-[18px] h-[18px]" />
                </div>
                <span>Collapse</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
          >
            <div className={`flex items-center justify-center ${isCollapsed ? "" : "w-8 h-8"}`}>
              <LogOut className="w-[18px] h-[18px]" />
            </div>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

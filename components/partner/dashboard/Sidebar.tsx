"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  CalendarDays,
  Wallet,
  Star,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
  Compass,
  Plane,
  Map,
  Users,
} from "lucide-react";

type PartnerType = "hotel" | "airline";

const navItemsHotel = [
  { label: "Overview", href: "/partner/dashboard", icon: LayoutDashboard },
  { label: "Listings", href: "/partner/dashboard/listings", icon: Building2 },
  { label: "Promotions", href: "/partner/dashboard/promotions", icon: Tag },
  { label: "Bookings", href: "/partner/dashboard/bookings", icon: CalendarCheck },
  { label: "Calendar", href: "/partner/dashboard/calendar", icon: CalendarDays },
  { label: "Finance", href: "/partner/dashboard/finance", icon: Wallet },
  { label: "Reviews", href: "/partner/dashboard/reviews", icon: Star },
  { label: "Analytics", href: "/partner/dashboard/analytics", icon: BarChart3 },
  { label: "Staff", href: "/partner/dashboard/staff", icon: Users },
  { label: "Settings", href: "/partner/dashboard/settings", icon: Settings },
];

const navItemsAirline = [
  { label: "Overview", href: "/partner/dashboard", icon: LayoutDashboard },
  { label: "Routes", href: "/partner/dashboard/routes", icon: Map },
  { label: "Fleet", href: "/partner/dashboard/fleet", icon: Plane },
  { label: "Schedules", href: "/partner/dashboard/calendar", icon: CalendarDays }, // Replaces Calendar
  { label: "Reservations", href: "/partner/dashboard/bookings", icon: Users }, // Replaces Bookings & Passengers
  { label: "Promotions", href: "/partner/dashboard/promotions", icon: Tag },
  { label: "Finance", href: "/partner/dashboard/finance", icon: Wallet },
  { label: "Reviews", href: "/partner/dashboard/reviews", icon: Star },
  { label: "Analytics", href: "/partner/dashboard/analytics", icon: BarChart3 },
  { label: "Staff", href: "/partner/dashboard/staff", icon: Users },
  { label: "Settings", href: "/partner/dashboard/settings", icon: Settings },
];

import { usePartner } from "@/components/partner/dashboard/PartnerContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { partnerType } = usePartner();
  const pathname = usePathname();
  const router = useRouter();
  const navItems = partnerType === "airline" ? navItemsAirline : navItemsHotel;

  const isActive = (href: string) => {
    if (href === "/partner/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
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

      {/* Sidebar — light theme, always fixed */}
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
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">BataGo</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${partnerType === 'airline' ? 'bg-sky-500/10 text-sky-600' : 'bg-primary/10 text-primary'}`}>
                {partnerType === 'airline' ? 'Airline' : 'Partner'}
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="flex items-center justify-center">
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
          {navItems.map((item) => {
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
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-white" : "text-gray-400 dark:text-slate-500 group-hover:text-gray-700 dark:group-hover:text-slate-300"} transition-colors`} />
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

        {/* Bottom Section */}
        <div className="border-t border-gray-100 dark:border-slate-700 p-3 shrink-0 space-y-0.5">
          {/* Collapse Toggle — desktop only */}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex items-center gap-3 rounded-xl text-[13px] font-medium text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100/80 dark:hover:bg-slate-700 transition-all w-full ${isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" />
            ) : (
              <>
                <div className="w-8 h-8 flex items-center justify-center">
                  <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />
                </div>
                <span>Collapse</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 rounded-xl text-[13px] font-medium text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ${isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}`}
          >
            <div className={`flex items-center justify-center ${isCollapsed ? "" : "w-8 h-8"}`}>
              <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            </div>
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

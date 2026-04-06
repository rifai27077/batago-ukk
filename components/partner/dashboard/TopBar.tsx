"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, ChevronDown, User, Settings, LogOut, Check, BellOff, Sun, Moon, Plane, Building2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useDateRange } from "./DateRangeContext";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import GlobalSearch from "@/components/GlobalSearch";
import { logout, getProfile, AuthResponse, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification as ApiNotification } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
// Remove Indonesian locale

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { partnerType, setPartnerType } = usePartner();
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [userData, setUserData] = useState<AuthResponse["user"] | null>(null);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUserData(res.user);
      } catch (error) {
        console.error("Failed to fetch user in topbar", error);
      }
    };
    fetchUser();
    fetchNotifs();
    
    // Refresh notifications every 15 seconds for responsiveness
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { setDateRange } = useDateRange();
  const [activeRange, setActiveRange] = useState("30d");

  const handleRangeChange = (range: string) => {
    setActiveRange(range);
    const now = new Date();
    let from = new Date();

    if (range === "7d") {
      from.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      from.setDate(now.getDate() - 30);
    } else if (range === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    setDateRange({ from, to: now });
  };
  
  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <GlobalSearch context="partner" placeholder="Search bookings, guests..." />
      </div>

      {/* Right: Date Filter + Theme Toggle + Notifications + Profile */}
      <div className="flex items-center gap-2">


        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-sm text-gray-800 dark:text-slate-200">Notifications</h3>
                {unreadCount > 0 ? (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">All caught up ✓</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4">
                    <BellOff className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400 font-medium">No notifications</p>
                    <p className="text-xs text-gray-300 mt-0.5">You&apos;re all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b border-gray-50 dark:border-slate-700 last:border-0 ${!notif.read ? "bg-primary/3" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        {!notif.read ? (
                          <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                        ) : (
                          <span className="w-2 h-2 bg-transparent rounded-full mt-1.5 shrink-0" />
                        )}
                        <div>
                          <p className={`text-sm font-semibold ${!notif.read ? "text-gray-800 dark:text-slate-200" : "text-gray-500 dark:text-slate-400"}`}>{notif.title}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-slate-700 text-center">
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {userData?.name ? userData.name.charAt(0) : <User className="w-4 h-4" />}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 leading-tight">
                {userData?.name || "Partner"}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-tight">
                {userData?.role || "Owner"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                <p className="font-bold text-sm text-gray-800 dark:text-slate-200">{userData?.name || "Partner"}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{userData?.email || ""}</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { setShowProfile(false); router.push("/partner/dashboard/settings"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                <button 
                  onClick={() => { setShowProfile(false); router.push("/partner/dashboard/settings"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-700 py-1">
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, ChevronDown, User, Settings, LogOut, Sun, Moon, BellOff, Check } from "lucide-react";
import { useTheme } from "@/components/partner/dashboard/ThemeProvider";
import GlobalSearch from "@/components/GlobalSearch";
import { getProfile, getAdminNotifications, markAdminNotificationsRead } from "@/lib/api";

interface AdminTopBarProps {
  onMenuToggle: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export default function AdminTopBar({ onMenuToggle }: AdminTopBarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await getProfile();
        if (profileRes.user) {
          setAdminName(profileRes.user.name);
          setAdminEmail(profileRes.user.email);
        }

        const notifRes = await getAdminNotifications();
        if (notifRes.data) {
          setNotifications(notifRes.data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: n.time,
            unread: !n.is_read
          })));
        }
      } catch (err) {
        console.error("Failed to load admin topbar data:", err);
      }
    }
    loadData();

    // Poll for new admin notifications every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = async () => {
    try {
      await markAdminNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("batago_token");
    router.push("/login");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-500 dark:text-slate-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <GlobalSearch context="admin" placeholder="Search users, partners, bookings..." />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-500 dark:text-slate-400 transition-colors"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-500 dark:text-slate-400 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-800" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <BellOff className="w-8 h-8 mb-2" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => router.push("/admin/notifications")}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                          n.unread ? "bg-primary/5 dark:bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.unread && <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />}
                          <div className={n.unread ? "" : "ml-3.5"}>
                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                   <button onClick={() => router.push("/admin/notifications")} className="w-full py-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                     View All Notifications
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                <span className="text-white font-bold text-xs">{adminName.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 leading-tight">{adminName}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">{adminEmail}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                <button 
                  onClick={() => router.push("/admin/settings")}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="h-px bg-gray-100 dark:bg-slate-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

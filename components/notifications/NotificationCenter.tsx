"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, Tag } from "lucide-react";
import Link from "next/link"; // Ensure Link is imported

interface Notification {
  id: string;
  type: "info" | "promo" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Booking Confirmed",
    message: "Your flight to Bali has been confirmed. Have a safe trip!",
    time: "2 hours ago",
    read: false,
    link: "/my-bookings/B-12345",
  },
  {
    id: "2",
    type: "promo",
    title: "50% Off Hotels!",
    message: "Limited time offer for stays in Yogyakarta. Code: JOGJA50",
    time: "1 day ago",
    read: false,
    link: "/stays",
  },
  {
    id: "3",
    type: "info",
    title: "Check-in Reminder",
    message: "Web check-in differs for your upcoming flight tomorrow.",
    time: "2 days ago",
    read: true,
    link: "/my-bookings",
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
    switch (type) {
      case "success":
        return <div className="p-2 bg-green-100 text-green-600 rounded-full"><Check className="w-4 h-4" /></div>;
      case "promo":
        return <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><Tag className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Info className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200 origin-top-right z-50 ${
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 backdrop-blur-sm">
          <h3 className="font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                    !notification.read ? "bg-blue-50/30" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={notification.link || "#"} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div>
                      <h4 className={`text-sm ${!notification.read ? "font-bold text-foreground" : "font-medium text-gray-700"}`}>
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted">
              <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No new notifications</p>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link href="/notifications" className="text-xs font-bold text-primary hover:underline">
                View All Notifications
            </Link>
        </div>
      </div>
    </div>
  );
}

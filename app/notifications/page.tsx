"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bell, Check, Info, Tag, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api";

interface Notification {
  id: number;
  type: "info" | "promo" | "success";
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
  };

  const filteredNotifications = notifications.filter(n => 
    filter === "all" ? true : !n.read
  );

  const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
    switch (type) {
      case "success":
        return <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Check className="w-6 h-6" /></div>;
      case "promo":
        return <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Tag className="w-6 h-6" /></div>;
      default:
        return <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Info className="w-6 h-6" /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="text-4xl font-black text-foreground tracking-tight">Notifications</h1>
              <p className="text-muted mt-2">Stay updated with your bookings and exclusive offers.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {notifications.some(n => !n.read) && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="px-6 py-3 bg-white border border-gray-200 text-foreground font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm text-sm"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-8 bg-white p-1 rounded-2xl border border-gray-100 w-fit shadow-sm">
            <button 
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-foreground"}`}
            >
              All Notifications
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === "unread" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-foreground"}`}
            >
              Unread ({notifications.filter(n => !n.read).length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted font-medium">Loading your notifications...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-8 hover:bg-gray-50/50 transition-all relative group ${!notification.read ? "bg-blue-50/20" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="shrink-0">
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="grow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className={`text-lg ${!notification.read ? "font-bold text-foreground" : "font-semibold text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed max-w-2xl">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-6">
                          {notification.link && (
                            <Link 
                                href={notification.link} 
                                className="text-sm font-bold text-primary hover:underline"
                                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                            >
                                View Details
                            </Link>
                          )}
                          {!notification.read && (
                            <button 
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-sm font-bold text-gray-400 hover:text-foreground transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute top-8 right-8 w-3 h-3 bg-primary rounded-full ring-4 ring-primary/10"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Bell className="w-12 h-12 text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">All caught up!</h3>
                <p className="text-muted max-w-sm mx-auto">
                    {filter === "unread" 
                        ? "You've read all your notifications. Head back to Home to explore more." 
                        : "No notifications to show right now. We'll let you know when something important happens."}
                </p>
                <Link href="/" className="mt-8 px-10 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm">
                    Back to Selection
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

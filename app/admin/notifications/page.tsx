"use client";

import { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, CheckCircle } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "system" | "partner" | "booking";
  importance: "low" | "medium" | "high";
  isRead: boolean;
  time: string;
}

const mockNotifications: Notification[] = [
  { id: 1, title: "New Partner Application", message: "Swiss-Belhotel Harbour Bay has submitted a new partner application for review.", type: "partner", importance: "high", isRead: false, time: "2 minutes ago" },
  { id: 2, title: "System Maintenance", message: "Platform maintenance scheduled for Sunday, Feb 22 at 02:00 AM UTC.", type: "system", importance: "medium", isRead: false, time: "1 hour ago" },
  { id: 3, title: "Booking Dispute", message: "Guest Ahmad Rifai has disputed booking BG-240214-007.", type: "booking", importance: "high", isRead: true, time: "3 hours ago" },
  { id: 4, title: "Payout Processed", message: "Payout for Citilink Indonesia (Rp 8.2M) has been processed successfully.", type: "booking", importance: "low", isRead: true, time: "5 hours ago" },
  { id: 5, title: "New Feature Available", message: "Multi-language support for destination descriptions is now live.", type: "system", importance: "low", isRead: true, time: "1 day ago" },
];

const typeIcons = {
  system: <Info className="w-4 h-4 text-blue-500" />,
  partner: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  booking: <AlertCircle className="w-4 h-4 text-amber-500" />,
};

const importanceColors = {
  low: "bg-gray-100 dark:bg-slate-700 text-gray-500",
  medium: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-red-50 dark:bg-red-500/10 text-red-500",
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter(n => filter === "all" || !n.isRead);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Center</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Stay updated with platform activities</p>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        <button 
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === "all" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}
        >
          All Notifications
        </button>
        <button 
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === "unread" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}
        >
          Unread
          {notifications.some(n => !n.isRead) && (
            <span className="ml-2 w-2 h-2 rounded-full bg-primary inline-block" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-dashed border-gray-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300 dark:text-slate-600" />
            </div>
            <p className="text-gray-500 dark:text-slate-400">No notifications to show here.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n.id}
              className={`group bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all hover:border-primary/30 ${n.isRead ? "border-gray-100 dark:border-slate-700 opacity-75" : "border-primary/20 shadow-md shadow-primary/5 border-l-4 border-l-primary"}`}
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
                  {typeIcons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-[15px] font-bold ${n.isRead ? "text-gray-700 dark:text-slate-300" : "text-gray-900 dark:text-white"}`}>
                      {n.title}
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap ml-3">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {n.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${importanceColors[n.importance]}`}>
                      {n.importance} Priority
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleRead(n.id)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-primary transition-colors"
                        title={n.isRead ? "Mark as unread" : "Mark as read"}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteNotification(n.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

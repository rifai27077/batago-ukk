"use client";

import { useState, useEffect } from "react";
import { Check, Trash2, Bell, AlertCircle, Info, RefreshCw } from "lucide-react";
import { getAdminNotifications, markAdminNotificationsRead, deleteAdminNotification } from "@/lib/api";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  importance: "low" | "medium" | "high";
  is_read: boolean;
  time: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getAdminNotifications();
      if (res.data) setNotifications(res.data as Notification[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAdminNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifs = notifications.filter((n) => (filter === "unread" ? !n.is_read : true));

  const getIcon = (type: string, importance: string) => {
    if (importance === "high") return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (type === "system") return <Bell className="w-5 h-5 text-slate-500" />;
    return <Info className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Central Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">System alerts and administration notifications.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchNotifications}
            className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            onClick={handleMarkAllRead}
            disabled={!notifications.some(n => !n.is_read)}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex px-4 pt-2 border-b border-gray-100 dark:border-slate-700">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              filter === "all" ? "border-primary text-primary" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              filter === "unread" ? "border-primary text-primary" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            Unread
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {notifications.filter(n => !n.is_read).length}
              </span>
            )}
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
          {loading ? (
             <div className="py-12 text-center text-gray-500 dark:text-slate-400">Loading notifications...</div>
          ) : filteredNotifs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">All caught up!</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">No {filter === "unread" ? "unread " : ""}notifications to display.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div key={n.id} className={`group p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-start gap-4 ${n.is_read ? 'opacity-70' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.importance === 'high' ? 'bg-red-50 dark:bg-red-500/10' :
                  n.type === 'system' ? 'bg-slate-100 dark:bg-slate-700' :
                  'bg-primary/10'
                }`}>
                  {getIcon(n.type, n.importance)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`text-sm sm:text-base font-bold text-gray-900 dark:text-white ${!n.is_read ? '' : 'font-semibold'}`}>
                        {n.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 shrink-0 whitespace-nowrap">
                      {n.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      n.type === 'system' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                      'bg-primary/10 text-primary dark:bg-primary/20'
                    }`}>
                      {n.type}
                    </span>
                    <button 
                      onClick={() => handleDelete(n.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
                {!n.is_read && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 shrink-0 shadow-sm shadow-primary/40" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

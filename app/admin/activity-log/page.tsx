"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Filter, 
  History, 
  User as UserIcon, 
  ShieldCheck, 
  AlertCircle, 
  Download,
  Calendar,
  Clock
} from "lucide-react";
import Pagination from "@/components/partner/dashboard/Pagination";

interface ActivityLog {
  id: number;
  admin_name: string;
  admin_role: string;
  action: string;
  target: string;
  category: "partner" | "user" | "finance" | "content" | "system";
  timestamp: string;
  status: "success" | "warning" | "error";
}

const categoryColors: Record<string, string> = {
  partner: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  user: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  finance: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  content: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
  system: "text-rose-500 bg-rose-50 dark:bg-rose-500/10",
};

export default function AdminActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const api = await import("@/lib/api");
      const res = await api.getAdminActivityLog({
        search: searchQuery,
        category: categoryFilter,
        page: currentPage,
        limit: itemsPerPage
      });
      if (res.data) {
        setLogs(res.data as ActivityLog[]);
        setTotal(res.meta.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / itemsPerPage);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Activity Log
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Audit trail for all administrative actions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by admin, action, or target..." 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none w-full" 
          />
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={categoryFilter} 
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="bg-transparent text-sm text-gray-700 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="partner">Partners</option>
            <option value="user">Users</option>
            <option value="finance">Finance</option>
            <option value="content">Content</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Admin</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Action</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Target</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Timestamp</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Loading activity logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No activity logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white leading-none">{log.admin_name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{log.admin_role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-slate-200">
                      {log.action}
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-slate-400">
                      {log.target}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryColors[log.category]}`}>
                        {log.category}
                      </span>
                    </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end">
                      {log.status === "success" && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                      {log.status === "warning" && <AlertCircle className="w-5 h-5 text-amber-500" />}
                      {log.status === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      </div>
    </div>
  );
}

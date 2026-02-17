"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Eye, Ban, CheckCircle, Users, UserCheck, UserX, Download } from "lucide-react";
import Pagination from "@/components/partner/dashboard/Pagination";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "suspended";
  joined: string;
  totalBookings: number;
  totalSpent: string;
}

const mockUsers: UserData[] = [
  { id: 1, name: "Ahmad Rifai", email: "ahmad.rifai@email.com", phone: "+62 812 3456 7890", status: "active", joined: "12 Jan 2025", totalBookings: 15, totalSpent: "Rp 24.5M" },
  { id: 2, name: "Siti Nurhaliza", email: "siti.nur@email.com", phone: "+62 813 5678 1234", status: "active", joined: "5 Mar 2025", totalBookings: 8, totalSpent: "Rp 12.8M" },
  { id: 3, name: "Budi Santoso", email: "budi.s@email.com", phone: "+62 857 2345 6789", status: "active", joined: "20 Apr 2025", totalBookings: 22, totalSpent: "Rp 38.2M" },
  { id: 4, name: "Dewi Lestari", email: "dewi.l@email.com", phone: "+62 821 9876 5432", status: "suspended", joined: "8 Jun 2025", totalBookings: 3, totalSpent: "Rp 4.1M" },
  { id: 5, name: "Rudi Hartono", email: "rudi.h@email.com", phone: "+62 878 1234 5678", status: "active", joined: "15 Jul 2025", totalBookings: 11, totalSpent: "Rp 18.9M" },
  { id: 6, name: "Anisa Putri", email: "anisa.p@email.com", phone: "+62 856 7890 1234", status: "active", joined: "1 Sep 2025", totalBookings: 6, totalSpent: "Rp 9.2M" },
  { id: 7, name: "Fajar Nugroho", email: "fajar.n@email.com", phone: "+62 819 3456 7890", status: "active", joined: "10 Oct 2025", totalBookings: 19, totalSpent: "Rp 31.5M" },
  { id: 8, name: "Maya Sari", email: "maya.s@email.com", phone: "+62 838 6789 0123", status: "suspended", joined: "22 Nov 2025", totalBookings: 1, totalSpent: "Rp 850K" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  suspended: "bg-red-50 dark:bg-red-500/10 text-red-500",
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalActive = mockUsers.filter((u) => u.status === "active").length;
  const totalSuspended = mockUsers.filter((u) => u.status === "suspended").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage registered travelers on BataGo</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{mockUsers.length}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalActive}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalSuspended}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Suspended</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700 flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700">
          <Filter className="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "suspended")} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-slate-800 [&>option]:text-gray-700 [&>option]:dark:text-slate-200">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden lg:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Bookings</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden lg:table-cell">Total Spent</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-slate-300">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-slate-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{user.email}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden lg:table-cell">{user.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[user.status]}`}>{user.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{user.joined}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{user.totalBookings}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden lg:table-cell">{user.totalSpent}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/users/${user.id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                      <button className={`p-1.5 rounded-lg transition-colors ${user.status === "active" ? "hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500" : "hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-500"}`} title={user.status === "active" ? "Suspend" : "Activate"}>
                        {user.status === "active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Download, Building, CreditCard, TrendingUp, Banknote } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Pagination from "@/components/partner/dashboard/Pagination";

const revenueData = [
  { month: "Sep", gross: 22500000, commission: 2250000, net: 20250000 },
  { month: "Oct", gross: 28300000, commission: 2830000, net: 25470000 },
  { month: "Nov", gross: 24800000, commission: 2480000, net: 22320000 },
  { month: "Dec", gross: 38200000, commission: 3820000, net: 34380000 },
  { month: "Jan", gross: 33400000, commission: 3340000, net: 30060000 },
  { month: "Feb", gross: 41600000, commission: 4160000, net: 37440000 },
];

interface Transaction {
  id: string;
  date: string;
  description: string;
  bookingId: string;
  gross: string;
  commission: string;
  net: string;
  type: "earning" | "payout" | "refund";
}

const transactions: Transaction[] = [
  { id: "1", date: "16 Feb 2026", description: "Deluxe Room — Ahmad Rifai", bookingId: "BG-240216-001", gross: "Rp 1.700.000", commission: "-Rp 170.000", net: "Rp 1.530.000", type: "earning" },
  { id: "2", date: "15 Feb 2026", description: "Suite Room — Budi Pratama", bookingId: "BG-240216-002", gross: "Rp 4.500.000", commission: "-Rp 450.000", net: "Rp 4.050.000", type: "earning" },
  { id: "3", date: "14 Feb 2026", description: "Weekly Payout — BCA ****7890", bookingId: "-", gross: "-", commission: "-", net: "-Rp 28.500.000", type: "payout" },
  { id: "4", date: "13 Feb 2026", description: "Family Room — Siti Nurhaliza", bookingId: "BG-240215-003", gross: "Rp 4.400.000", commission: "-Rp 440.000", net: "Rp 3.960.000", type: "earning" },
  { id: "5", date: "12 Feb 2026", description: "Refund — Dewi Lestari", bookingId: "BG-240214-005", gross: "-", commission: "-", net: "-Rp 850.000", type: "refund" },
  { id: "6", date: "11 Feb 2026", description: "Standard Room — Reza Arap", bookingId: "BG-240215-004", gross: "Rp 650.000", commission: "-Rp 65.000", net: "Rp 585.000", type: "earning" },
  { id: "7", date: "10 Feb 2026", description: "Suite Room — Tono Sucipto", bookingId: "BG-240213-006", gross: "Rp 6.750.000", commission: "-Rp 675.000", net: "Rp 6.075.000", type: "earning" },
];

const formatCurrency = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}jt`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
  return v.toString();
};

export default function FinancePage() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return transactions.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance & Payouts</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Track your revenue and manage payouts</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm border border-gray-100 dark:border-slate-700">
            <Download className="w-4 h-4" /> Download Statement
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> Available
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Rp 8.7M</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Available Balance</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
              Pending
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Rp 5.6M</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Pending Settlement</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Rp 170.2M</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Total Earned (YTD)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center">
              <Banknote className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Rp 17.0M</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Platform Commission (YTD)</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Breakdown</h3>
          <div className="flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1">
            {(["weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                  period === p
                    ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-slate-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary" /><span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Net Revenue</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-red-300" /><span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Commission</span></div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "10px 14px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
              />
              <Bar dataKey="net" fill="#14B8A6" radius={[6, 6, 0, 0]} barSize={32} />
              <Bar dataKey="commission" fill="#FCA5A5" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions + Payout Settings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Transaction History */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h3>
            <button className="text-sm text-primary font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Description</th>
                  <th className="text-left px-5 py-3 font-semibold">Booking ID</th>
                  <th className="text-right px-5 py-3 font-semibold">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 dark:text-slate-400 whitespace-nowrap">{tx.date}</td>
                    <td className="px-5 py-3 text-gray-800 dark:text-slate-200 font-medium">{tx.description}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{tx.bookingId}</td>
                    <td className={`px-5 py-3 text-right font-bold whitespace-nowrap ${
                      tx.type === "earning" ? "text-emerald-600 dark:text-emerald-500" : tx.type === "refund" ? "text-red-500" : "text-blue-600 dark:text-blue-500"
                    }`}>
                      {tx.type === "earning" ? "+" : ""}{tx.net}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={transactions.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>

        {/* Payout Settings */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Payout Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 rounded-xl p-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Bank BCA</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">****7890 · Ahmad Rifai</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Schedule</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">Weekly</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Min. Payout</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">Rp 500.000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Next Payout</span>
                  <span className="font-semibold text-primary">21 Feb 2026</span>
                </div>
              </div>
              <button className="w-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 text-sm font-medium py-2.5 rounded-xl transition-colors">
                Edit Payout Settings
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors">
                <Banknote className="w-4 h-4" /> Request Early Payout
              </button>
              <button className="w-full flex items-center gap-3 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors">
                <CreditCard className="w-4 h-4" /> Add Bank Account
              </button>
              <button className="w-full flex items-center gap-3 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors">
                <Download className="w-4 h-4" /> Download Tax Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Download, Building, CreditCard, TrendingUp, Banknote, Plane } from "lucide-react";
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
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import { getPartnerFinance, getPayoutSettings, updatePayoutSettings, requestEarlyPayout } from "@/lib/api";
import PayoutSettingsModal from "@/components/partner/dashboard/PayoutSettingsModal";



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

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  requestedAt: string;
  bankAccount: any;
}

const formatCurrency = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}jt`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
  return v.toString();
};

export default function FinancePage() {
  const { partnerType } = usePartner();
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Finance State
  const [balance, setBalance] = useState("Rp 0");
  const [pending, setPending] = useState("Rp 0");
  const [revenueGrowth, setRevenueGrowth] = useState<string | null>(null);
  const [totalEarned, setTotalEarned] = useState("Rp 0");
  const [commission, setCommission] = useState("Rp 0");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Payout State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [payoutSettings, setPayoutSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchFinance() {
      try {
        const [res, settingsRes] = await Promise.all([
          getPartnerFinance({ page: 1, limit: 10 }),
          getPayoutSettings()
        ]);
        
        if (settingsRes) {
          setPayoutSettings(settingsRes);
        }

        if (res.summary) {
          const fmt = (v: number) => {
            if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
            if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}M`;
            return `Rp ${v.toLocaleString("id-ID")}`;
          };
          setBalance(fmt(res.summary.net_revenue));
          setCommission(fmt(res.summary.commission));
          setTotalEarned(fmt(res.summary.total_revenue));
          setPending(fmt(res.summary.pending || 0));
          if (res.summary.growth !== undefined) {
            setRevenueGrowth(`${res.summary.growth > 0 ? '+' : ''}${res.summary.growth}%`);
          }
        }
        if (res.transactions) {
          const mapped: Transaction[] = res.transactions.map((t: any) => ({
            id: String(t.ID),
            date: new Date(t.CreatedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            description: t.description || (t.type === "earning" ? "Revenue" : "Payout"),
            bookingId: t.booking?.booking_code || "-",
            gross: `Rp ${t.gross_amount.toLocaleString("id-ID")}`,
            commission: `-Rp ${t.commission_amount.toLocaleString("id-ID")}`,
            net: `Rp ${t.net_amount.toLocaleString("id-ID")}`,
            type: t.type,
          }));
          setTransactions(mapped);
        }
        if (res.payouts) {
          const mappedPayouts: PayoutRequest[] = res.payouts.map((p: any) => ({
            id: String(p.ID),
            amount: p.amount,
            status: p.status,
            requestedAt: new Date(p.requested_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            bankAccount: p.BankAccount,
          }));
          setPayouts(mappedPayouts);
        }
        if (res.chart_data) {
          setRevenueData(res.chart_data);
        } else {
          // Fallback if unavailable
          setRevenueData([
            { month: "Current", net: res.summary?.net_revenue || 0, commission: res.summary?.commission || 0 }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch finance", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFinance();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("openModal") === "bank") {
        setIsSettingsOpen(true);
      }
    }
  }, []);



  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return transactions.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, transactions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  const handleSaveSettings = async (data: any) => {
    try {
      const res = await updatePayoutSettings(data);
      if (res.bank_account && res.settings) {
        setPayoutSettings({ bank_account: res.bank_account, settings: res.settings });
      }
    } catch (error) {
      console.error("Failed to update payout settings:", error);
      throw error;
    }
  };

  const handleEarlyPayout = async () => {
    if (!payoutSettings?.bank_account) {
      alert("Please add a bank account first.");
      return;
    }
    const amountPrompt = prompt("Enter amount to withdraw early (Rp):");
    if (!amountPrompt) return;
    const amount = parseInt(amountPrompt);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const res = await requestEarlyPayout(amount);
      alert(res.message);
    } catch (error) {
      console.error("Failed to request early payout:", error);
      alert("Failed to request payout.");
    }
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{balance}</h3>
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pending}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Pending Settlement</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> {revenueGrowth || '—'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalEarned}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Total Earned (YTD)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center">
              <Banknote className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{commission}</h3>
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
                <tr className="bg-gray-50/80 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400 text-xs tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Description</th>
                  <th className="text-left px-5 py-3 font-semibold">Reference</th>
                  <th className="text-right px-5 py-3 font-semibold">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 dark:text-slate-400 whitespace-nowrap">{tx.date}</td>
                    <td className="px-5 py-3 font-medium">
                       <div className="flex items-center gap-2">
                          {tx.description.includes("Ticket") && <Plane className="w-3 h-3 text-gray-400" />}
                          <span className="text-gray-800 dark:text-slate-200">{tx.description}</span>
                       </div>
                    </td>
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
              {payoutSettings?.bank_account ? (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 rounded-xl p-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{payoutSettings.bank_account.bank_name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      •••• {payoutSettings.bank_account.account_number.slice(-4)} · {payoutSettings.bank_account.account_holder_name}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">No Bank Account</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500/80">Please add one to receive payouts.</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Schedule</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">{payoutSettings?.settings?.schedule || "Weekly"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Min. Payout</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">
                    Rp {(payoutSettings?.settings?.threshold_amount || 500000).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                {payoutSettings?.bank_account ? "Edit Payout Settings" : "Setup Payout Settings"}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleEarlyPayout}
                className="w-full flex items-center gap-3 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                <Banknote className="w-4 h-4" /> Request Early Payout
              </button>
              {!payoutSettings?.bank_account && (
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center gap-3 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
                >
                  <CreditCard className="w-4 h-4" /> Add Bank Account
                </button>
              )}
              <button className="w-full flex items-center gap-3 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors">
                <Download className="w-4 h-4" /> Download Tax Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      {payouts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col mt-5">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payout History</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400 text-xs tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Bank Account</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 dark:text-slate-400 whitespace-nowrap">{p.requestedAt}</td>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-slate-200">
                      {p.bankAccount ? `${p.bankAccount.bank_name} •••• ${p.bankAccount.account_number?.slice(-4) || ""}` : "Unspecified"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        p.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                        p.status === "failed" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                        p.status === "processing" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold whitespace-nowrap text-gray-900 dark:text-white">
                      Rp {p.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PayoutSettingsModal  
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialData={payoutSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

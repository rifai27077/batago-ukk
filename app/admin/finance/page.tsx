"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DollarSign, TrendingUp, Clock, RefreshCw, CheckCircle, XCircle, Save, Download, Loader2 } from "lucide-react";
import Pagination from "@/components/partner/dashboard/Pagination";
import ProcessPayoutModal from "@/components/admin/modals/ProcessPayoutModal";
import { getAdminFinanceStats, getAdminPayouts, processAdminPayout } from "@/lib/api";

function formatRp(v: number): string {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `Rp ${Math.round(v / 1_000_000)}M`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}K`;
  return `Rp ${v.toLocaleString("id-ID")}`;
}

interface FinanceData {
  gmv: number;
  platform_revenue: number;
  pending_payouts: { amount: number; count: number };
}

interface Payout {
  id: number;
  partner: string;
  type: string;
  amount: number;
  status: string;
  date: string;
}

const payoutStatusColors: Record<string, string> = {
  pending: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ready: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  processing: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  completed: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export default function AdminFinancePage() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"payouts" | "commission">("payouts");
  const [payoutPage, setPayoutPage] = useState(1);
  const [payoutPerPage, setPayoutPerPage] = useState(10);
  const [payoutTotal, setPayoutTotal] = useState(0);

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [finRes, payRes] = await Promise.all([
        getAdminFinanceStats(),
        getAdminPayouts({ page: payoutPage, limit: payoutPerPage }),
      ]);
      setFinanceData(finRes);
      setPayouts(payRes.data || []);
      setPayoutTotal(payRes.meta.total);
    } catch (err) {
      console.error("Failed to load finance data:", err);
    } finally {
      setLoading(false);
    }
  }, [payoutPage, payoutPerPage]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleProcessPayout = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsPayoutModalOpen(true);
  };

  const handleConfirmPayout = async (data: any) => {
    if (!selectedPayout) return;
    setProcessing(true);
    try {
      await processAdminPayout(selectedPayout.id);
      setIsPayoutModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to process payout:", err);
    } finally {
      setProcessing(false);
    }
  };

  const payoutTotalPages = Math.ceil(payoutTotal / payoutPerPage);

  const stats = financeData
    ? [
        { label: "Gross Merchandise Value", value: formatRp(financeData.gmv), change: "", icon: TrendingUp, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
        { label: "Platform Revenue", value: formatRp(financeData.platform_revenue), change: "", icon: DollarSign, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
        { label: "Pending Payouts", value: formatRp(financeData.pending_payouts.amount), change: `${financeData.pending_payouts.count} partners`, icon: Clock, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
      ]
    : [];

  if (loading && !financeData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Platform revenue, payouts, and commission</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${s.gradient} flex items-center justify-center shadow-lg ${s.shadow} mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</p>
            {s.change && <p className="text-xs text-primary font-medium mt-1">{s.change}</p>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        {(["payouts", "commission"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${tab === t ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}>{t}</button>
        ))}
      </div>

      {/* Payouts */}
      {tab === "payouts" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Partner</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-slate-200">{p.partner}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{formatRp(p.amount)}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{p.date}</td>
                      <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${payoutStatusColors[p.status] || payoutStatusColors.pending}`}>{p.status}</span></td>
                      <td className="px-5 py-3.5 text-right">
                        {(p.status === "pending" || p.status === "ready") && (
                          <button
                            onClick={() => handleProcessPayout(p)}
                            className="text-xs px-3 py-1.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors shadow-sm shadow-primary/20"
                          >
                            Process
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400 dark:text-slate-500">No payouts found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Pagination currentPage={payoutPage} totalPages={payoutTotalPages} onPageChange={setPayoutPage} totalItems={payoutTotal} itemsPerPage={payoutPerPage} onItemsPerPageChange={(val) => { setPayoutPerPage(val); setPayoutPage(1); }} />
        </div>
      )}

      {/* Commission */}
      {tab === "commission" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-5 max-w-lg">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Commission Rates</h2>
          {[
            { label: "Hotel Default Rate", value: "10", suffix: "%" },
            { label: "Airline Default Rate", value: "8", suffix: "%" },
            { label: "Service Fee (User)", value: "5000", suffix: "IDR" },
          ].map((item) => (
            <div key={item.label}>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">{item.label}</label>
              <div className="flex items-center gap-2">
                <input type="number" defaultValue={item.value} className="flex-1 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                <span className="text-sm font-medium text-gray-400 dark:text-slate-500 w-10">{item.suffix}</span>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      )}

      <ProcessPayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        onProcess={handleConfirmPayout}
        payout={selectedPayout}
      />
    </div>
  );
}

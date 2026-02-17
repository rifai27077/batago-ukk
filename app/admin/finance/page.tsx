"use client";

import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, Clock, RefreshCw, CheckCircle, XCircle, Save, Download } from "lucide-react";
import Pagination from "@/components/partner/dashboard/Pagination";
import ProcessPayoutModal from "@/components/admin/modals/ProcessPayoutModal";

const stats = [
  { label: "Gross Merchandise Value", value: "Rp 3.2B", change: "+15.2%", icon: TrendingUp, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
  { label: "Platform Revenue", value: "Rp 245M", change: "+18.3%", icon: DollarSign, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
  { label: "Pending Payouts", value: "Rp 42M", change: "5 partners", icon: Clock, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
  { label: "Refund Queue", value: "Rp 8.5M", change: "3 requests", icon: RefreshCw, gradient: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20" },
];

interface Payout {
  id: number;
  partner: string;
  type: "hotel" | "airline";
  amount: string;
  bookings: number;
  period: string;
  status: "ready" | "processing";
}

interface Refund {
  id: number;
  bookingId: string;
  guest: string;
  amount: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const mockPayouts: Payout[] = [
  { id: 1, partner: "Hotel Santika Batam", type: "hotel", amount: "Rp 12.500.000", bookings: 18, period: "1-15 Feb 2026", status: "ready" },
  { id: 2, partner: "Citilink Indonesia", type: "airline", amount: "Rp 8.200.000", bookings: 32, period: "1-15 Feb 2026", status: "ready" },
  { id: 3, partner: "Swiss-Belhotel", type: "hotel", amount: "Rp 6.800.000", bookings: 12, period: "1-15 Feb 2026", status: "processing" },
  { id: 4, partner: "Batik Air", type: "airline", amount: "Rp 15.400.000", bookings: 45, period: "1-15 Feb 2026", status: "ready" },
  { id: 5, partner: "Harris Hotel", type: "hotel", amount: "Rp 4.100.000", bookings: 8, period: "1-15 Feb 2026", status: "ready" },
];

const mockRefunds: Refund[] = [
  { id: 1, bookingId: "BG-240215-006", guest: "Anisa Putri", amount: "Rp 650.000", reason: "Flight delay > 4 hours", status: "pending" },
  { id: 2, bookingId: "BG-240214-007", guest: "Fajar Nugroho", amount: "Rp 3.200.000", reason: "Hotel not as described", status: "pending" },
  { id: 3, bookingId: "BG-240210-015", guest: "Rina Wati", amount: "Rp 1.100.000", reason: "Calendar change", status: "approved" },
];

const payoutStatusColors: Record<string, string> = {
  ready: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  processing: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const refundStatusColors: Record<string, string> = {
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-red-50 dark:bg-red-500/10 text-red-500",
};

export default function AdminFinancePage() {
  const [tab, setTab] = useState<"payouts" | "refunds" | "commission">("payouts");
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds);
  const [payoutPage, setPayoutPage] = useState(1);
  const [payoutPerPage, setPayoutPerPage] = useState(5);
  const [refundPage, setRefundPage] = useState(1);
  const [refundPerPage, setRefundPerPage] = useState(5);

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const handleProcessPayout = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsPayoutModalOpen(true);
  };

  const handleConfirmPayout = (data: any) => {
    setPayouts(payouts.map(p => p.id === data.id ? { ...p, status: "processing" } : p));
  };

  const payoutTotalPages = Math.ceil(payouts.length / payoutPerPage);
  const paginatedPayouts = useMemo(() => {
    const s = (payoutPage - 1) * payoutPerPage;
    return payouts.slice(s, s + payoutPerPage);
  }, [payouts, payoutPage, payoutPerPage]);

  const refundTotalPages = Math.ceil(refunds.length / refundPerPage);
  const paginatedRefunds = useMemo(() => {
    const s = (refundPage - 1) * refundPerPage;
    return refunds.slice(s, s + refundPerPage);
  }, [refunds, refundPage, refundPerPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Platform revenue, payouts, and refunds</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Ledger
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${s.gradient} flex items-center justify-center shadow-lg ${s.shadow} mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-primary font-medium mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        {(["payouts", "refunds", "commission"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${tab === t ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}>{t}</button>
        ))}
      </div>

      {/* Payouts */}
      {tab === "payouts" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Partner</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Bookings</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Period</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayouts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-slate-200">{p.partner}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{p.amount}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{p.bookings}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{p.period}</td>
                    <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${payoutStatusColors[p.status]}`}>{p.status}</span></td>
                    <td className="px-5 py-3.5 text-right">
                      {p.status === "ready" && (
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
              </tbody>
            </table>
          </div>
          <Pagination currentPage={payoutPage} totalPages={payoutTotalPages} onPageChange={setPayoutPage} totalItems={payouts.length} itemsPerPage={payoutPerPage} onItemsPerPageChange={(val) => { setPayoutPerPage(val); setPayoutPage(1); }} />
        </div>
      )}

      {/* Refunds */}
      {tab === "refunds" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Booking ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Guest</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Reason</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRefunds.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600 dark:text-slate-300">{r.bookingId}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-slate-200">{r.guest}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{r.amount}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{r.reason}</td>
                    <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${refundStatusColors[r.status]}`}>{r.status}</span></td>
                    <td className="px-5 py-3.5 text-right">
                      {r.status === "pending" && (
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setRefunds(refunds.map(refund => refund.id === r.id ? { ...refund, status: "approved" } : refund))}
                            className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-gray-400 hover:text-emerald-500 transition-colors" 
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setRefunds(refunds.map(refund => refund.id === r.id ? { ...refund, status: "rejected" } : refund))}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors" 
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={refundPage} totalPages={refundTotalPages} onPageChange={setRefundPage} totalItems={refunds.length} itemsPerPage={refundPerPage} onItemsPerPageChange={(val) => { setRefundPerPage(val); setRefundPage(1); }} />
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

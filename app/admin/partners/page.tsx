"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Eye, CheckCircle, XCircle, Building2, Plane, Loader2 } from "lucide-react";
import Pagination from "@/components/partner/dashboard/Pagination";
import PartnerActionModal from "@/components/admin/modals/PartnerActionModal";
import { getAdminPartners, updatePartnerStatus } from "@/lib/api";

interface Partner {
  id: number;
  name: string;
  type: string;
  status: string;
  email: string;
  commission: string;
  joined: string;
  total_revenue: number;
  location: string;
}

function formatRp(v: number): string {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `Rp ${Math.round(v / 1_000_000)}M`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}K`;
  return `Rp ${v.toLocaleString("id-ID")}`;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Active" },
  approved: { color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Active" },
  pending: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  in_review: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  draft: { color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending" },
  suspended: { color: "bg-red-50 dark:bg-red-500/10 text-red-500", label: "Suspended" },
  rejected: { color: "bg-red-50 dark:bg-red-500/10 text-red-500", label: "Rejected" },
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"all" | "pending">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | "suspend">("approve");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminPartners({
        search: searchQuery || undefined,
        status: tab === "pending" ? "pending" : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });
      setPartners(res.data || []);
      setTotalItems(res.meta.total);
      setPendingCount(res.meta.pending_count);
    } catch (err) {
      console.error("Failed to load partners:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, tab, typeFilter, currentPage, itemsPerPage]);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  const handleAction = (partner: Partner, action: "approve" | "reject" | "suspend") => {
    setSelectedPartner(partner);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async (data: any) => {
    if (!selectedPartner) return;
    try {
      await updatePartnerStatus(selectedPartner.id, data.action, data.reason);
      setIsModalOpen(false);
      fetchPartners();
    } catch (err) {
      console.error("Failed to update partner status:", err);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Management</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage hotels and airlines registered on BataGo</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        <button onClick={() => { setTab("all"); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "all" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}>All Partners</button>
        <button onClick={() => { setTab("pending"); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${tab === "pending" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"}`}>
          Pending Approval
          {pendingCount > 0 && <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{pendingCount}</span>}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700 flex-1">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input type="text" placeholder="Search partners..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-slate-700">
          <Filter className="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent text-sm text-gray-700 dark:text-slate-200 outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-slate-800">
            <option value="all">All Types</option>
            <option value="hotel">Hotel</option>
            <option value="flight">Airline</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Commission</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden lg:table-cell">Revenue</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Joined</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => {
                  const cfg = statusConfig[partner.status] || statusConfig.pending;
                  return (
                    <tr key={partner.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${partner.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10" : "bg-violet-50 dark:bg-violet-500/10"}`}>
                            {partner.type === "hotel" ? <Building2 className="w-4 h-4 text-blue-500" /> : <Plane className="w-4 h-4 text-violet-500" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-slate-200">{partner.name}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500">{partner.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${partner.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"}`}>{partner.type === "flight" ? "airline" : partner.type}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200 hidden md:table-cell">{partner.commission}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden lg:table-cell">{formatRp(partner.total_revenue)}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{partner.joined}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/partners/${partner.id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                          {partner.status === "pending" && (
                            <>
                              <button onClick={() => handleAction(partner, "approve")} className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-gray-400 hover:text-emerald-500 transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleAction(partner, "reject")} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
                          {(partner.status === "active" || partner.status === "approved") && (
                            <button onClick={() => handleAction(partner, "suspend")} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg text-gray-400 hover:text-amber-500 transition-colors" title="Suspend"><XCircle className="w-4 h-4 opacity-50" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {partners.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400 dark:text-slate-500">No partners found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }} />
      </div>

      <PartnerActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        partnerName={selectedPartner?.name || ""}
        action={modalAction}
      />
    </div>
  );
}

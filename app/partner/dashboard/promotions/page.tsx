"use client";

import { useState, useMemo, useEffect } from "react";
import { Tag, Plus, Info, Search, Filter, Calendar, TrendingUp, Users, CheckCircle2, Clock, AlertCircle, MoreVertical, Edit2, Pause, Trash2, Building2, BarChart3, Plane, Ticket } from "lucide-react";
import PromotionForm from "@/components/partner/dashboard/PromotionForm";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import { getPartnerPromotions, createPartnerPromotion, updatePartnerPromotion, deletePartnerPromotion } from "@/lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface Promotion {
  id: string;
  name: string;
  type: "flash_sale" | "last_minute" | "early_bird" | "seasonal";
  discount: number;
  code: string;
  status: "active" | "scheduled" | "paused" | "expired";
  startDate: string;
  endDate: string;
  listings: number[]; // Hotels: Rooms/Properties, Airlines: Routes
  claims: number;
  revenue: string;
}

const typeLabels: Record<Promotion["type"], { label: string; color: string }> = {
  flash_sale: { label: "Flash Sale", color: "bg-red-500" },
  last_minute: { label: "Last Minute", color: "bg-orange-500" },
  early_bird: { label: "Early Bird", color: "bg-blue-500" },
  seasonal: { label: "Seasonal", color: "bg-purple-500" },
};

const statusConfig: Record<
  Promotion["status"],
  { label: string; icon: any; color: string }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    color:
      "text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  },
  scheduled: {
    label: "Scheduled",
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  },
  paused: {
    label: "Paused",
    icon: Clock,
    color:
      "text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    color: "text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700",
  },
};

export default function PromotionsPage() {
  const { partnerType } = usePartner();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | Promotion["status"]>(
    "all"
  );
  const [stats, setStats] = useState<{
    total_active: number;
    new_this_week?: number;
    total_claims: number;
    claims_growth?: number;
    total_revenue: number;
    revenue_growth?: number;
  }>({
    total_active: 0,
    total_claims: 0,
    total_revenue: 0,
  });

  useEffect(() => {
    async function fetchPromos() {
      try {
        const res = await getPartnerPromotions({ page: 1, limit: 100 });
        if (res.data && res.data.length > 0) {
          const mapped: Promotion[] = res.data.map((p) => ({
            id: String(p.ID),
            name: p.name,
            code: p.code,
            type: p.type,
            discount: p.discount,
            status: p.status,
            startDate: new Date(p.start_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            endDate: new Date(p.end_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            listings: p.listings,
            claims: p.claims,
            revenue: `Rp ${(p.revenue || 0).toLocaleString("id-ID")}`,
          }));
          setPromotions(mapped);
        }
        if (res.meta.stats) {
          setStats(res.meta.stats);
        }
      } catch (err) {
        console.error("Failed to fetch promotions", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPromos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      await deletePartnerPromotion(Number(id));
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete promotion", err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    // Optimistic update
    setPromotions((prev) => 
      prev.map((p) => p.id === id ? { ...p, status: newStatus as any } : p)
    );
    try {
      await updatePartnerPromotion(Number(id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on failure
      setPromotions((prev) => 
        prev.map((p) => p.id === id ? { ...p, status: currentStatus as any } : p)
      );
    }
  };

  const handleEdit = (promo: Promotion) => {
    setCurrentPromo(promo);
    setIsModalOpen(true);
  };

  // Compute chart data from actual promotions
  const chartData = useMemo(() => {
    const counts: Record<string, number> = { "Flash Sale": 0, "Last Minute": 0, "Early Bird": 0, "Seasonal": 0 };
    promotions.forEach(p => {
      const label = typeLabels[p.type]?.label || p.type;
      counts[label] = (counts[label] || 0) + (p.claims || 0);
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [promotions]);

  const currentPromotions = promotions;

  const filteredPromotions = currentPromotions.filter((promo) => {
    const matchesSearch = promo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || promo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Promotions & Deals
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage your {partnerType === "hotel" ? "room" : "flight"} offers and boost your sales
          </p>
        </div>
        <button
          onClick={() => {
            setCurrentPromo(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Create Promotion
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Active</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total_active}</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          {stats.new_this_week !== undefined && (
            <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
               <TrendingUp className="w-3 h-3" />
               <span>+{stats.new_this_week} new this week</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Claims</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                 {stats.total_claims}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          {stats.claims_growth !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${stats.claims_growth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
               <TrendingUp className={`w-3 h-3 ${stats.claims_growth < 0 ? 'rotate-180' : ''}`} />
               <span>{stats.claims_growth > 0 ? '+' : ''}{stats.claims_growth}% vs last month</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Revenue Generated</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                 Rp {stats.total_revenue.toLocaleString("id-ID")}
              </h3>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          {stats.revenue_growth !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${stats.revenue_growth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
               <TrendingUp className={`w-3 h-3 ${stats.revenue_growth < 0 ? 'rotate-180' : ''}`} />
               <span>{stats.revenue_growth > 0 ? '+' : ''}{stats.revenue_growth}% boost</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 relative overflow-hidden">
           {/* Tips Card */}
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4" />
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                 <Info className="w-4 h-4 text-primary" />
                 <span className="text-sm font-bold text-primary">Pro Tip</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                 {partnerType === "hotel" 
                    ? "Flash sales on weekends can boost your occupancy by up to 25%." 
                    : "Offering early bird discounts for holiday seasons can secure load factor early."}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Promotion List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white self-start sm:self-center">All Promotions</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                />
              </div>
              <button className="p-2 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 tracking-wider">Promotion Name</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 tracking-wider">Type</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 tracking-wider hidden sm:table-cell">Duration</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 tracking-wider hidden md:table-cell">Performance</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.map((promo) => (
                  <tr
                    key={promo.id}
                    className="border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="font-medium text-gray-900 dark:text-white">{promo.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{promo.discount}% Off</span>
                        <span className="text-[10px] font-mono bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-slate-300">{promo.code}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                       <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium text-white ${typeLabels[promo.type].color}`}>
                          {typeLabels[promo.type].label}
                       </span>
                    </td>
                    <td className="py-4 px-5 hidden sm:table-cell">
                      <div className="text-xs text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {promo.startDate} - {promo.endDate}
                      </div>
                    </td>
                    <td className="py-4 px-5 hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {promo.revenue}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                           <span className="flex items-center gap-1">
                              {partnerType === 'hotel' ? <Building2 className="w-3 h-3" /> : <Plane className="w-3 h-3" />}
                              {promo.listings?.length || 0} {partnerType === 'hotel' ? 'Listings' : 'Routes'}
                           </span>
                           <span>•</span>
                           <span>{promo.claims} claims</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[promo.status].color.replace("text-", "border-").replace("bg-", "border-opacity-20 ")} ${statusConfig[promo.status].color}`}>
                          {/* Icon rendering needs to be handled as a component, not just passing the reference directly in className logic if it's complex, but here we can just use the component */}
                          {(() => {
                             const StatusIcon = statusConfig[promo.status].icon;
                             return <StatusIcon className="w-3.5 h-3.5" />;
                          })()}
                          {statusConfig[promo.status].label}
                       </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => handleToggleStatus(promo.id, promo.status)}
                           className={`p-1.5 rounded-lg transition-colors ${promo.status === 'active' ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                           title={promo.status === 'active' ? 'Pause' : 'Resume'}
                         >
                           {promo.status === 'active' ? <Pause className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                         </button>
                         <button 
                           onClick={() => handleEdit(promo)}
                           className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"
                           title="Edit"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDelete(promo.id)}
                           className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                           title="Delete"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Sidebar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Performance by Type</h3>
           <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                       {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3b82f6" : "#ec4899"} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           
           <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Top Performing</h4>
           <div className="space-y-3">
              {promotions.slice(0, 3).map((promo: Promotion, i: number) => (
                 <div key={promo.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                       {i + 1}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-gray-800 dark:text-slate-200 line-clamp-1">{promo.name}</p>
                       <p className="text-xs text-emerald-600 font-medium">{promo.revenue}</p>
                    </div>
                 </div>
              ))}
           </div>

        </div>
      </div>

      <PromotionForm 
        isOpen={isModalOpen} 
        initialData={currentPromo}
        partnerType={partnerType}
        onClose={() => setIsModalOpen(false)} 
        onSave={async (data) => {
          console.log("Saving promotion data:", data);
          try {
            const payload = {
              name: data.name || "New Promotion",
              code: data.code || "",
              type: data.type || "flash_sale",
              discount: data.discount || 10,
              start_date: data.startDate || new Date().toISOString().split("T")[0],
              end_date: data.endDate || new Date().toISOString().split("T")[0],
              listings: data.listings.map(Number),
            };

            if (currentPromo) {
              await updatePartnerPromotion(Number(currentPromo.id), payload);
            } else {
              await createPartnerPromotion(payload);
            }

            // Refetch
            const res = await getPartnerPromotions({ page: 1, limit: 100 });
            if (res.data && res.data.length > 0) {
              const mapped: Promotion[] = res.data.map((p) => ({
                id: String(p.ID),
                name: p.name,
                code: p.code,
                type: p.type,
                discount: p.discount,
                status: p.status,
                startDate: new Date(p.start_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
                endDate: new Date(p.end_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
                listings: p.listings,
                claims: p.claims,
                revenue: `Rp ${(p.revenue || 0).toLocaleString("id-ID")}`,
              }));
              setPromotions(mapped);
            }
          } catch (err) {
            console.error("Failed to save promotion", err);
          }
          setIsModalOpen(false);
          setCurrentPromo(null);
        }}
      />
    </div>
  );
}

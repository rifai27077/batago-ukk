"use client";

import { useState, useMemo } from "react";
import { Tag, Plus, Info, Search, Filter, Calendar, TrendingUp, Users, CheckCircle2, Clock, AlertCircle, MoreVertical, Edit2, Pause, Trash2, Building2, BarChart3, Plane, Ticket } from "lucide-react";
import PromotionForm from "@/components/partner/dashboard/PromotionForm";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
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
  status: "active" | "scheduled" | "paused" | "expired";
  startDate: string;
  endDate: string;
  listings: number; // Hotels: Rooms/Properties, Airlines: Routes
  claims: number;
  revenue: string;
}

const mockHotelPromotions: Promotion[] = [
  {
    id: "1",
    name: "Summer Flash Sale",
    type: "flash_sale",
    discount: 25,
    status: "active",
    startDate: "15 Feb 2026",
    endDate: "20 Feb 2026",
    listings: 3,
    claims: 42,
    revenue: "Rp 12.550.000",
  },
  {
    id: "2",
    name: "Last Minute Weekend",
    type: "last_minute",
    discount: 15,
    status: "active",
    startDate: "14 Feb 2026",
    endDate: "17 Feb 2026",
    listings: 1,
    claims: 12,
    revenue: "Rp 4.200.000",
  },
  {
    id: "3",
    name: "Ramadhan Holy Spirit",
    type: "seasonal",
    discount: 20,
    status: "scheduled",
    startDate: "01 Mar 2026",
    endDate: "31 Mar 2026",
    listings: 5,
    claims: 0,
    revenue: "Rp 0",
  },
  {
    id: "4",
    name: "Early Bird 2026",
    type: "early_bird",
    discount: 30,
    status: "paused",
    startDate: "01 Jan 2026",
    endDate: "31 Dec 2026",
    listings: 10,
    claims: 156,
    revenue: "Rp 85.400.000",
  },
];

const mockAirlinePromotions: Promotion[] = [
  {
    id: "a1",
    name: "Lebaran Homecoming Deal",
    type: "seasonal",
    discount: 15,
    status: "scheduled",
    startDate: "01 Apr 2026",
    endDate: "15 Apr 2026",
    listings: 12, // Routes
    claims: 0,
    revenue: "Rp 0",
  },
  {
    id: "a2",
    name: "Jakarta - Bali Flash Sale",
    type: "flash_sale",
    discount: 30,
    status: "active",
    startDate: "10 Feb 2026",
    endDate: "12 Feb 2026",
    listings: 4,
    claims: 150,
    revenue: "Rp 145.000.000",
  },
  {
    id: "a3",
    name: "Business Class Upgrade",
    type: "last_minute",
    discount: 20,
    status: "active",
    startDate: "01 Feb 2026",
    endDate: "28 Feb 2026",
    listings: 8,
    claims: 45,
    revenue: "Rp 56.000.000",
  },
  {
    id: "a4",
    name: "Early Bird Holiday 2026",
    type: "early_bird",
    discount: 25,
    status: "paused",
    startDate: "01 Jan 2026",
    endDate: "31 Dec 2026",
    listings: 20,
    claims: 80,
    revenue: "Rp 75.500.000",
  },
];

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

const hotelChartData = [
  { name: "Flash Sale", value: 420 },
  { name: "Last Minute", value: 310 },
  { name: "Early Bird", value: 540 },
  { name: "Seasonal", value: 280 },
];

const airlineChartData = [
  { name: "Flash Sale", value: 850 },
  { name: "Last Minute", value: 420 },
  { name: "Early Bird", value: 680 },
  { name: "Seasonal", value: 950 },
];

export default function PromotionsPage() {
  const { partnerType } = usePartner();
  const [promotions, setPromotions] = useState<Promotion[]>(
    partnerType === "hotel" ? mockHotelPromotions : mockAirlinePromotions
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | Promotion["status"]>(
    "all"
  );
  
  // Update state when partner type changes (in a real app this would be a useEffect fetching data)
  const currentPromotions = useMemo(() => {
     return partnerType === "hotel" ? mockHotelPromotions : mockAirlinePromotions;
  }, [partnerType]);

  const filteredPromotions = currentPromotions.filter((promo) => {
    const matchesSearch = promo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || promo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const chartData = partnerType === "hotel" ? hotelChartData : airlineChartData;

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
          onClick={() => setIsModalOpen(true)}
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
             <TrendingUp className="w-3 h-3" />
             <span>+2 new this week</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Claims</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                 {partnerType === "hotel" ? "210" : "425"}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
             <TrendingUp className="w-3 h-3" />
             <span>+12% vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Revenue Generated</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                 {partnerType === "hotel" ? "Rp 15.2jt" : "Rp 276.5jt"}
              </h3>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
             <TrendingUp className="w-3 h-3" />
             <span>+8.5% boost</span>
          </div>
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
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Promotion Name</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Duration</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Performance</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
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
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{promo.discount}% Off</div>
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
                              {promo.listings} {partnerType === 'hotel' ? 'Listings' : 'Routes'}
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
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
              {(partnerType === 'hotel' ? mockHotelPromotions : mockAirlinePromotions).slice(0, 3).map((promo, i) => (
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
        onClose={() => setIsModalOpen(false)} 
        onSave={(data) => {
          console.log("Promotion saved:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

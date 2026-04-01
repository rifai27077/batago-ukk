"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Eye, MousePointerClick, CalendarCheck, CheckCircle, Users, MapPin, Download, Plane, Building2 } from "lucide-react";
import { useDateRange } from "@/components/partner/dashboard/DateRangeContext";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import { getPartnerAnalytics, PartnerAnalyticsResponse } from "@/lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const formatCurrency = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}jt`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
  return v.toString();
};

export default function AnalyticsPage() {
  const { dateRange } = useDateRange();
  const { partnerType } = usePartner();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PartnerAnalyticsResponse | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPartnerAnalytics();
        setData(res);
      } catch (e) {
        console.error("Failed to fetch analytics", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const metricLabel = partnerType === "hotel" ? "RevPAR Trend" : "Yield Trend (RASK)";
  const metricUnit = partnerType === "hotel" ? "Rp" : "Rp/km";
  const demographicLabel = partnerType === "hotel" ? "Guest Type" : "Seat Class";

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
           <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
           <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const funnelData = data?.funnel || [];
  const conversionData = data?.conversion || [];
  const demographics = data?.demographics || [];
  const metricData = data?.metric_data || [];
  const regionsData = (data as any)?.regions || [];
  
  // Icon mapping helper
  const getIcon = (name: string) => {
    switch (name) {
      case "Impressions": return Eye;
      case "Searches": 
      case "Clicks": return MousePointerClick;
      case "Bookings": 
      case "Tickets": return partnerType === "hotel" ? CalendarCheck : Plane;
      case "Completed": 
      case "Flown": return CheckCircle;
      default: return Eye;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Performance overview
            {/* from {dateRange.from?.toLocaleDateString()} to {dateRange.to?.toLocaleDateString()} */}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-medium px-4 py-2 rounded-xl transition-colors text-sm border border-gray-100 dark:border-slate-700">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Booking Funnel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
          {partnerType === "hotel" ? "Booking Funnel" : "Sales Funnel"}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {funnelData.map((item, i) => {
            const Icon = getIcon(item.name);
            return (
            <div key={item.name} className="relative">
              <div className={`p-4 rounded-2xl border ${i === funnelData.length - 1 ? "bg-primary/5 border-primary/20" : "bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-700"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === funnelData.length - 1 ? "bg-primary text-white" : "bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 shadow-sm"}`}>
                     <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{item.name}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value.toLocaleString()}</p>
                {i < funnelData.length - 1 && (
                   <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 hidden lg:block">
                      <div className="w-4 h-4 bg-white dark:bg-slate-800 border-t border-r border-gray-200 dark:border-slate-600 rotate-45" />
                   </div>
                )}
              </div>
            </div>
          )})}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Conversion Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Conversion Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} className="dark:opacity-10" />
                <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(value: any) => [`${value}%`, "Conv. Rate"]}
                />
                <Area type="monotone" dataKey="rate" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric Trend (RevPAR / Yield) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{metricLabel}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} className="dark:opacity-10" />
                <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(value: any) => [`${metricUnit} ${Number(value).toLocaleString("id-ID")}`, "Value"]}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Demographics */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{demographicLabel}</h3>
          <div className="h-60 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographics}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                 <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                 <span className="text-xs text-gray-500 font-medium">Distribution</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {demographics.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{item.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regions / Routes */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
             {partnerType === "hotel" ? "Top Destinations" : "Top Routes (by City)"}
           </h3>
           <div className="h-64">
             {regionsData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={regionsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="dark:opacity-10" />
                   <XAxis type="number" hide />
                   <YAxis dataKey="Name" type="category" tick={{ fill: "#9CA3AF", fontSize: 12 }} width={80} axisLine={false} tickLine={false} />
                   <Tooltip
                     cursor={{ fill: "transparent" }}
                     contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px" }}
                   />
                   <Bar dataKey="Value" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={24} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                 <MapPin className="w-10 h-10 mb-2 opacity-20" />
                 <p className="text-sm">No regional data available</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

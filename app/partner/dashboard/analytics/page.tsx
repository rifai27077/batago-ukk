"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Eye, MousePointerClick, CalendarCheck, CheckCircle, Users, MapPin, Download } from "lucide-react";
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

const funnelData = [
  { name: "Impressions", value: 12450, icon: Eye },
  { name: "Clicks", value: 3820, icon: MousePointerClick },
  { name: "Bookings", value: 312, icon: CalendarCheck },
  { name: "Completed", value: 278, icon: CheckCircle },
];

const conversionData = [
  { month: "Sep", rate: 2.1 },
  { month: "Oct", rate: 2.8 },
  { month: "Nov", rate: 2.4 },
  { month: "Dec", rate: 3.2 },
  { month: "Jan", rate: 3.0 },
  { month: "Feb", rate: 3.5 },
];

const guestDemographics = [
  { name: "Solo", value: 22, color: "#14B8A6" },
  { name: "Couple", value: 35, color: "#3B82F6" },
  { name: "Family", value: 28, color: "#F59E0B" },
  { name: "Business", value: 15, color: "#8B5CF6" },
];

const topRegions = [
  { region: "Jakarta", bookings: 86, pct: 28 },
  { region: "Surabaya", bookings: 52, pct: 17 },
  { region: "Singapore", bookings: 45, pct: 14 },
  { region: "Medan", bookings: 38, pct: 12 },
  { region: "Bandung", bookings: 31, pct: 10 },
  { region: "Others", bookings: 60, pct: 19 },
];

const bookingChannels = [
  { channel: "Search", bookings: 145, pct: 47 },
  { channel: "Direct Link", bookings: 82, pct: 26 },
  { channel: "Promo/Deals", bookings: 55, pct: 18 },
  { channel: "Referral", bookings: 30, pct: 9 },
];

const revparData = [
  { month: "Sep", revpar: 620000 },
  { month: "Oct", revpar: 740000 },
  { month: "Nov", revpar: 680000 },
  { month: "Dec", revpar: 890000 },
  { month: "Jan", revpar: 810000 },
  { month: "Feb", revpar: 950000 },
];

const formatCurrency = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}jt`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
  return v.toString();
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"30d" | "90d" | "1y">("30d");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Performance insights and data</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            {(["30d", "90d", "1y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === p ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400"
                }`}
              >
                {p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "1 Year"}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-medium px-4 py-2 rounded-xl transition-colors text-sm border border-gray-100 dark:border-slate-700">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Booking Funnel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Booking Funnel</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {funnelData.map((item, i) => (
            <div key={item.name} className="relative">
              <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{item.value.toLocaleString("id-ID")}</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{item.name}</p>
                {i > 0 && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                    {((item.value / funnelData[i - 1].value) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Conversion Rate Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Conversion Rate</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> 3.5%
            </span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} className="dark:opacity-20" />
                <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip isAnimationActive={false} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "8px 12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} formatter={(v: number) => [`${v}%`, "Rate"]} />
                <Area isAnimationActive={false} type="monotone" dataKey="rate" stroke="#14B8A6" strokeWidth={2.5} fill="url(#colorConv)" dot={{ r: 4, fill: "#14B8A6", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RevPAR */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">RevPAR</h3>
            <span className="text-xs text-gray-400">Revenue per Available Room</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revparData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} className="dark:opacity-20" />
                <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip isAnimationActive={false} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "8px 12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, "RevPAR"]} />
                <Bar isAnimationActive={false} dataKey="revpar" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Guest Demographics Pie */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Guest Segments</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  isAnimationActive={false}
                  data={guestDemographics}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {guestDemographics.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  isAnimationActive={false}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "8px 12px" }}
                  formatter={(v: number) => [`${v}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {guestDemographics.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Top Regions</h3>
          </div>
          <div className="space-y-3">
            {topRegions.map((r) => (
              <div key={r.region} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium w-24">{r.region}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold w-8 text-right">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Channels */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-gray-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Booking Channels</h3>
          </div>
          <div className="space-y-3">
            {bookingChannels.map((ch) => (
              <div key={ch.channel} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-slate-300 font-medium w-24">{ch.channel}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${ch.pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold w-12 text-right">{ch.bookings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

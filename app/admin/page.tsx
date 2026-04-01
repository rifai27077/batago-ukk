"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Users, Building2, CalendarCheck, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, AlertTriangle, Clock, CheckCircle2, Plane, Star, Loader2 } from "lucide-react";
import { getAdminStats } from "@/lib/api";

interface StatsData {
  stats: {
    total_users: number;
    user_change: number;
    active_partners: number;
    partner_change: number;
    total_bookings: number;
    booking_change: number;
    total_revenue: number;
    revenue_change: number;
  };
  revenue_trend: { month: string; value: number }[];
  booking_distribution: { hotels: number; hotel_pct: number; flights: number; flight_pct: number };
  top_partners: { id: number; name: string; type: string; revenue: number; bookings: number }[];
  pending_actions: { title: string; desc: string; type: string; time: string }[];
  recent_bookings: { id: number; booking_code: string; guest: string; partner: string; type: string; amount: number; status: string; date: string }[];
  quick_stats: { active_hotels: number; active_flights: number };
}

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  new: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  cancelled: "bg-red-50 dark:bg-red-500/10 text-red-500",
  completed: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const actionIcons: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  warning: { icon: AlertTriangle, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
  danger: { icon: AlertTriangle, color: "text-red-500 bg-red-50 dark:bg-red-500/10" },
  info: { icon: Clock, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
};

function formatRp(v: number): string {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `Rp ${Math.round(v / 1_000_000)}M`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}K`;
  return `Rp ${v.toLocaleString("id-ID")}`;
}

function RevenueChart({ data }: { data: { month: string; value: number }[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 400;
  const h = 160;
  const padX = 40;
  const padY = 20;
  const chartW = w - padX;
  const chartH = h - padY * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - (d.value / max) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h - padY} L ${points[0].x} ${h - padY} Z`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
          <p className="text-xs text-gray-400 dark:text-slate-500">Monthly platform revenue (in millions Rp)</p>
        </div>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">Last 6 months</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.3" />
            <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padY + chartH * (1 - pct);
          return (
            <g key={pct}>
              <line x1={padX} y1={y} x2={w} y2={y} className="stroke-gray-100 dark:stroke-slate-700" strokeWidth="1" />
              <text x={padX - 6} y={y + 3} textAnchor="end" className="fill-gray-400 dark:fill-slate-500 text-[9px]">{Math.round(max * pct)}</text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" className="fill-primary" />
            <circle cx={p.x} cy={p.y} r="2" className="fill-white dark:fill-slate-800" />
            <text x={p.x} y={h - 4} textAnchor="middle" className="fill-gray-400 dark:fill-slate-500 text-[9px] font-medium">{data[i].month}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BookingDistributionChart({ data }: { data: StatsData["booking_distribution"] }) {
  const total = data.hotels + data.flights;
  const items = [
    { label: "Hotels", value: data.hotels, percentage: data.hotel_pct, color: "bg-blue-500", lightBg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-500" },
    { label: "Flights", value: data.flights, percentage: data.flight_pct, color: "bg-violet-500", lightBg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-500" },
  ];
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Booking Distribution</h2>
      <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">Hotels vs Flights</p>
      <div className="flex items-center justify-center mb-5">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" className="stroke-gray-100 dark:stroke-slate-700" strokeWidth="14" />
            <circle cx="50" cy="50" r="40" fill="none" className="stroke-blue-500" strokeWidth="14"
              strokeDasharray={`${items[0].percentage * 2.51} ${100 * 2.51}`}
              strokeLinecap="round" />
            <circle cx="50" cy="50" r="40" fill="none" className="stroke-violet-500" strokeWidth="14"
              strokeDasharray={`${items[1].percentage * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`-${items[0].percentage * 2.51}`}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{total.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">total</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${d.color}`} />
              <span className="text-sm text-gray-600 dark:text-slate-300">{d.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{d.value.toLocaleString()}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.lightBg} ${d.text}`}>{d.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await getAdminStats();
      setData(res);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-slate-400">
        <p>Failed to load dashboard data.</p>
        <button onClick={fetchData} className="mt-3 text-primary text-sm font-medium hover:underline">Retry</button>
      </div>
    );
  }

  const { stats, revenue_trend, booking_distribution, top_partners, pending_actions, recent_bookings, quick_stats } = data;

  const statCards = [
    { label: "Total Users", value: stats.total_users.toLocaleString(), change: `${stats.user_change > 0 ? "+" : ""}${stats.user_change}%`, up: stats.user_change >= 0, icon: Users, color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
    { label: "Active Partners", value: String(stats.active_partners), change: `${stats.partner_change >= 0 ? "+" : ""}${stats.partner_change}`, up: stats.partner_change >= 0, icon: Building2, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
    { label: "Total Bookings", value: stats.total_bookings.toLocaleString(), change: `${stats.booking_change > 0 ? "+" : ""}${stats.booking_change}%`, up: stats.booking_change >= 0, icon: CalendarCheck, color: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20" },
    { label: "Platform Revenue", value: formatRp(stats.total_revenue), change: `${stats.revenue_change > 0 ? "+" : ""}${stats.revenue_change}%`, up: stats.revenue_change >= 0, icon: DollarSign, color: "from-primary to-primary/80", shadow: "shadow-primary/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening on BataGo.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.up
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 text-red-500"
              }`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue_trend} />
        </div>
        <BookingDistributionChart data={booking_distribution} />
      </div>

      {/* Top Partners + Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Top Partners</h2>
                <p className="text-xs text-gray-400 dark:text-slate-500">By total revenue</p>
              </div>
              <Link href="/admin/partners" className="text-xs text-primary font-medium hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {(top_partners || []).map((p, i) => (
                <Link href={`/admin/partners/${p.id}`} key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <span className="text-xs font-bold text-gray-300 dark:text-slate-600 w-4 text-center">{i + 1}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${p.type === "hotel" ? "bg-blue-50 dark:bg-blue-500/10" : "bg-violet-50 dark:bg-violet-500/10"}`}>
                    {p.type === "hotel" ? <Building2 className="w-4 h-4 text-blue-500" /> : <Plane className="w-4 h-4 text-violet-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">{p.bookings} bookings</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatRp(p.revenue)}</p>
                  </div>
                </Link>
              ))}
              {(!top_partners || top_partners.length === 0) && (
                <p className="px-5 py-8 text-center text-sm text-gray-400 dark:text-slate-500">No partner data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Pending Actions</h2>
          <div className="space-y-3">
            {(pending_actions || []).map((action, i) => {
              const { icon: Icon, color } = actionIcons[action.type] || actionIcons.info;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{action.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">{action.desc}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{action.time}</p>
                  </div>
                </div>
              );
            })}
            {(!pending_actions || pending_actions.length === 0) && (
              <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">No pending actions</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500">Latest platform transactions</p>
          </div>
          <Link href="/admin/bookings" className="text-xs text-primary font-medium hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">ID</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Guest</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Partner</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Type</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Amount</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recent_bookings || []).map((b) => (
                <tr key={b.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600 dark:text-slate-300">{b.booking_code}</td>
                  <td className="px-5 py-3 text-gray-800 dark:text-slate-200 font-medium">{b.guest}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden md:table-cell">{b.partner}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      b.type === "hotel"
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    }`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800 dark:text-slate-200">{formatRp(b.amount)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[b.status.toLowerCase()] || statusColors.pending}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!recent_bookings || recent_bookings.length === 0) && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400 dark:text-slate-500">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Hotels", value: String(quick_stats.active_hotels), sub: "active listings", icon: Building2, color: "text-blue-500" },
          { label: "Flights", value: String(quick_stats.active_flights), sub: "active routes", icon: TrendingUp, color: "text-violet-500" },
          { label: "Avg. Commission", value: "10%", sub: "platform rate", icon: DollarSign, color: "text-emerald-500" },
          { label: "Partners", value: String(stats.active_partners), sub: "approved", icon: CheckCircle2, color: "text-primary" },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
            <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

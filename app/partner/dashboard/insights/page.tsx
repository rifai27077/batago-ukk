"use client";

import { useState, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Compass, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  Percent,
  LineChart as LineChartIcon,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";

const comparisonData = [
  { date: "01 Feb", you: 65, market: 58 },
  { date: "03 Feb", you: 68, market: 60 },
  { date: "05 Feb", you: 72, market: 62 },
  { date: "07 Feb", you: 85, market: 75 },
  { date: "09 Feb", you: 78, market: 70 },
  { date: "11 Feb", you: 74, market: 68 },
  { date: "13 Feb", you: 82, market: 72 },
  { date: "15 Feb", you: 90, market: 85 },
];

const priceMarketData = [
  { name: "Economy", yourPrice: 450000, marketAvg: 420000 },
  { name: "Standard", yourPrice: 650000, marketAvg: 600000 },
  { name: "Deluxe", yourPrice: 850000, marketAvg: 950000 },
  { name: "Suite", yourPrice: 1250000, marketAvg: 1400000 },
];

export default function InsightsPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary" />
            Market Insights
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Comparing your performance with Batam market benchmarks</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
          <Info className="w-3.5 h-3.5" />
          Market: Batam (4-Star Hotels)
        </div>
      </div>

      {/* Index Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Occupancy Index", value: "112", change: "+5.2%", trend: "up", desc: "You are 12% above market" },
          { label: "ADR Index", value: "94", change: "-2.1%", trend: "down", desc: "You are 6% below market" },
          { label: "RevPAR Index", value: "105", change: "+3.4%", trend: "up", desc: "You are 5% above market" },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{item.label}</span>
              <div className={`flex items-center gap-1 text-xs font-bold ${item.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                {item.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.change}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900 dark:text-white">{item.value}</span>
              <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Points</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-500 mt-2 font-medium flex items-center gap-1">
              <Info className="w-3 h-3" />
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Market Comparison Chart */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Occupancy Breakdown</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Your daily occupancy vs market city average</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-gray-700 dark:text-slate-200">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600" />
              <span className="text-gray-500 dark:text-slate-400">Market Avg</span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={comparisonData}>
              <defs>
                <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "12px", 
                  border: "none", 
                  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                  backgroundColor: "rgba(255,255,255,0.95)"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="you" 
                stroke="var(--primary)" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorYou)" 
              />
              <Line 
                type="monotone" 
                dataKey="market" 
                stroke="#cbd5e1" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pricing Insight */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Pricing Sentiment</h3>
            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
              Underpriced
            </span>
          </div>
          
          <div className="space-y-5">
            {priceMarketData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700 dark:text-slate-200">{item.name} Room</span>
                  <span className="text-gray-400 dark:text-slate-500">
                    Rp {item.yourPrice.toLocaleString()} vs <span className="text-gray-900 dark:text-white">Rp {item.marketAvg.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(item.yourPrice / Math.max(item.yourPrice, item.marketAvg)) * 100}%` }} 
                  />
                </div>
                {item.yourPrice < item.marketAvg && (
                  <p className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    You are priced {(100 - (item.yourPrice / item.marketAvg * 100)).toFixed(1)}% below market
                  </p>
                )}
                {item.yourPrice > item.marketAvg && (
                  <p className="text-[10px] font-semibold text-amber-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    You are priced {(item.yourPrice / item.marketAvg * 100 - 100).toFixed(1)}% above market
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
              Your <span className="font-bold text-gray-900 dark:text-white">Suite Rooms</span> are significantly underpriced compared to the Nagoya market average. Consider increasing rates by 10-15% for upcoming weekends.
            </p>
          </div>
        </div>

        {/* High Demand Dates */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Upcoming High Demand</h3>
          
          <div className="space-y-4">
            {[
              { date: "Fri, 27 Feb", reason: "Batam Jazz Festival", demand: "Very High", availability: "Sold Out", color: "bg-red-500" },
              { date: "Sat, 28 Feb", reason: "Batam Jazz Festival", demand: "Peak", availability: "2 Rooms left", color: "bg-orange-500" },
              { date: "Wed, 04 Mar", reason: "Public Holiday", demand: "High", availability: "12 Rooms left", color: "bg-blue-500" },
              { date: "Sat, 14 Mar", reason: "Corporate Event", demand: "High", availability: "15 Rooms left", color: "bg-blue-500" },
            ].map((date, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                <div className={`w-10 h-10 ${date.color} text-white rounded-xl flex flex-col items-center justify-center shrink-0`}>
                  <span className="text-[10px] font-bold uppercase">{date.date.split(",")[0]}</span>
                  <span className="text-sm font-black">{date.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{date.reason}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Demand: {date.demand}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-bold ${date.availability === "Sold Out" ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                    {date.availability}
                  </p>
                  <button className="text-[10px] font-bold text-primary hover:underline mt-1 uppercase">Manage Rate</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="w-full py-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-gray-100 dark:border-slate-700">
              <Calendar className="w-4 h-4" />
              View Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

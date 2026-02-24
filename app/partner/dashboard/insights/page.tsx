"use client";

import { useState, useEffect, useCallback } from "react";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Compass, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  AlertTriangle,
  Plane,
  Building2,
  Loader2
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { getPartnerInsights, InsightsResponse } from "@/lib/api";

export default function InsightsPage() {
  const { partnerType } = usePartner();
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPartnerInsights();
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load insights");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const isHotel = data?.partner_type === "hotel" || partnerType === "hotel";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <span className="ml-3 text-gray-500 dark:text-slate-400">Loading market insights...</span>
      </div>
    );
  }

  const metrics = data?.metrics || [];
  const comparisonData = data?.comparison_data || [];
  const pricingData = data?.pricing_data || [];
  const highDemandEvents = data?.high_demand || [];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary" />
            Market Insights
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {isHotel ? "Comparing your performance with Batam market benchmarks" : "Route performance against regional competitors"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
          <Info className="w-3.5 h-3.5" />
          Market: {isHotel ? "Batam (4-Star Hotels)" : "Regional (Direct Competitors)"}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>
      )}

      {/* Index Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((item, i) => (
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
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
               {isHotel ? <Building2 className="w-4 h-4 text-primary" /> : <Plane className="w-4 h-4 text-primary" />}
               {isHotel ? "Occupancy Breakdown" : "Load Factor Analysis"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
               {isHotel ? "Your daily occupancy vs market city average" : "Your seat fill rate vs competitor average"}
            </p>
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
               {isHotel ? "Underpriced" : "Competitive"}
            </span>
          </div>
          
          <div className="space-y-5">
            {pricingData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700 dark:text-slate-200">{item.name}</span>
                  <span className="text-gray-400 dark:text-slate-500">
                    Rp {item.your_price.toLocaleString()} vs <span className="text-gray-900 dark:text-white">Rp {item.market_avg.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(item.your_price / Math.max(item.your_price, item.market_avg)) * 100}%` }} 
                  />
                </div>
                {item.your_price < item.market_avg && (
                  <p className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    You are priced {(100 - (item.your_price / item.market_avg * 100)).toFixed(1)}% below market
                  </p>
                )}
                {item.your_price > item.market_avg && (
                  <p className="text-[10px] font-semibold text-amber-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    You are priced {(item.your_price / item.market_avg * 100 - 100).toFixed(1)}% above market
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
               {isHotel 
                 ? <span>Your <span className="font-bold text-gray-900 dark:text-white">Suite Rooms</span> are significantly underpriced compared to the Nagoya market average.</span>
                 : <span>Review your pricing strategy against <span className="font-bold text-gray-900 dark:text-white">market benchmarks</span> to optimize revenue per available unit.</span>
               }
            </p>
          </div>
        </div>

        {/* High Demand Dates */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Upcoming High Demand</h3>
          
          <div className="space-y-4">
            {highDemandEvents.map((date, idx) => (
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
                  <p className={`text-xs font-bold ${date.availability === "Sold Out" || date.availability === "Full Flight" ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
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
              View Full {isHotel ? "Availability" : "Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

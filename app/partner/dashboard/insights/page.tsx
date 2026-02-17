"use client";

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
  Building2
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

// --- Mock Data: Hotel ---
const comparisonDataHotel = [
  { date: "01 Feb", you: 65, market: 58 },
  { date: "03 Feb", you: 68, market: 60 },
  { date: "05 Feb", you: 72, market: 62 },
  { date: "07 Feb", you: 85, market: 75 },
  { date: "09 Feb", you: 78, market: 70 },
  { date: "11 Feb", you: 74, market: 68 },
  { date: "13 Feb", you: 82, market: 72 },
  { date: "15 Feb", you: 90, market: 85 },
];

const priceMarketDataHotel = [
  { name: "Economy", yourPrice: 450000, marketAvg: 420000 },
  { name: "Standard", yourPrice: 650000, marketAvg: 600000 },
  { name: "Deluxe", yourPrice: 850000, marketAvg: 950000 },
  { name: "Suite", yourPrice: 1250000, marketAvg: 1400000 },
];

// --- Mock Data: Airline ---
const comparisonDataAirline = [
  { date: "01 Feb", you: 78, market: 72 },
  { date: "03 Feb", you: 80, market: 74 },
  { date: "05 Feb", you: 85, market: 76 },
  { date: "07 Feb", you: 92, market: 88 }, // Weekend spike
  { date: "09 Feb", you: 88, market: 82 },
  { date: "11 Feb", you: 84, market: 80 },
  { date: "13 Feb", you: 86, market: 81 },
  { date: "15 Feb", you: 95, market: 90 },
];

const priceMarketDataAirline = [
  { name: "CGK-DPS (Eco)", yourPrice: 1250000, marketAvg: 1150000 },
  { name: "CGK-SIN (Eco)", yourPrice: 950000, marketAvg: 1050000 },
  { name: "SUB-KUL (Eco)", yourPrice: 850000, marketAvg: 900000 },
  { name: "CGK-DPS (Biz)", yourPrice: 3500000, marketAvg: 3800000 },
];

export default function InsightsPage() {
  const { partnerType } = usePartner();
  const isHotel = partnerType === "hotel";

  // Select Data based on Partner Type
  const comparisonData = isHotel ? comparisonDataHotel : comparisonDataAirline;
  const priceMarketData = isHotel ? priceMarketDataHotel : priceMarketDataAirline;

  // Metrics Configuration
  const metrics = isHotel 
    ? [
        { label: "Occupancy Index", value: "112", change: "+5.2%", trend: "up", desc: "You are 12% above market" },
        { label: "ADR Index", value: "94", change: "-2.1%", trend: "down", desc: "You are 6% below market" },
        { label: "RevPAR Index", value: "105", change: "+3.4%", trend: "up", desc: "You are 5% above market" },
      ]
    : [
        { label: "Load Factor Index", value: "108", change: "+4.1%", trend: "up", desc: "Seats filled 8% above avg" },
        { label: "Yield Index", value: "98", change: "-1.5%", trend: "down", desc: "Yield 2% below competitors" },
        { label: "RASK Index", value: "103", change: "+2.8%", trend: "up", desc: "Unit revenue 3% above avg" },
      ];

  // High Demand Events
  const highDemandEvents = [
    { date: "Fri, 27 Feb", reason: "Batam Jazz Festival", demand: "Very High", availability: isHotel ? "Sold Out" : "Full Flight", color: "bg-red-500" },
    { date: "Sat, 28 Feb", reason: "Batam Jazz Festival", demand: "Peak", availability: isHotel ? "2 Rooms left" : "5 Seats left", color: "bg-orange-500" },
    { date: "Wed, 04 Mar", reason: "Public Holiday", demand: "High", availability: isHotel ? "12 Rooms left" : "20 Seats left", color: "bg-blue-500" },
    { date: "Sat, 14 Mar", reason: "Corporate Event", demand: "High", availability: isHotel ? "15 Rooms left" : "High Load", color: "bg-blue-500" },
  ];

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
            {priceMarketData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700 dark:text-slate-200">{item.name}</span>
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
               {isHotel 
                 ? <span>Your <span className="font-bold text-gray-900 dark:text-white">Suite Rooms</span> are significantly underpriced compared to the Nagoya market average.</span>
                 : <span>Your <span className="font-bold text-gray-900 dark:text-white">CGK-SIN Route</span> is priced 10% below competitors despite high demand. Consider adjusting yield.</span>
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

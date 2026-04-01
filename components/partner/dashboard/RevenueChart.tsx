"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getPartnerFinance } from "@/lib/api";

const periods = ["Monthly", "Weekly"] as const;
type Period = typeof periods[number];

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

interface RevenueChartProps {
  data?: any[];
}

export default function RevenueChart({ data: initialData }: RevenueChartProps) {
  const [period, setPeriod] = useState<Period>("Monthly");
  const [chartData, setChartData] = useState<any[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
      setChartData(initialData);
      setIsLoading(false);
      return;
    }

    async function fetchChartData() {
      try {
        const res = await getPartnerFinance();
        if (res.chart_data && res.chart_data.length > 0) {
          setChartData(res.chart_data);
        } else if (res.summary) {
          // If backend doesn't provide historical yet, we show current month
          setChartData([
            { name: "Current", revenue: res.summary.net_revenue, previous: 0 }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChartData();
  }, [initialData]);

  const data = chartData;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Revenue over the last 6 months</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                period === p
                  ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-500" />
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Previous</span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D1D5DB" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#D1D5DB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              isAnimationActive={false}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "10px 14px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
              formatter={(value: any) => [`Rp ${value?.toLocaleString("id-ID")}`, ""]}
              labelStyle={{ fontWeight: 700, marginBottom: 4, color: "#111" }}
            />
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey="previous"
              stroke="#D1D5DB"
              strokeWidth={2}
              fill="url(#colorPrevious)"
              strokeDasharray="5 5"
              dot={false}
            />
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey="revenue"
              stroke="#14B8A6"
              strokeWidth={2.5}
              fill="url(#colorRevenue)"
              dot={{ r: 4, fill: "#14B8A6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#14B8A6", strokeWidth: 3, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Eye, MousePointerClick, CalendarCheck, CheckCircle, Users, MapPin, Download, Plane, Building2 } from "lucide-react";
import { useDateRange } from "@/components/partner/dashboard/DateRangeContext";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
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

// Hotel Data
const hotelFunnelData = [
  { name: "Impressions", value: 12450, icon: Eye },
  { name: "Clicks", value: 3820, icon: MousePointerClick },
  { name: "Bookings", value: 312, icon: CalendarCheck },
  { name: "Completed", value: 278, icon: CheckCircle },
];

const hotelConversionData = [
  { month: "Sep", rate: 2.1 },
  { month: "Oct", rate: 2.8 },
  { month: "Nov", rate: 2.4 },
  { month: "Dec", rate: 3.2 },
  { month: "Jan", rate: 3.0 },
  { month: "Feb", rate: 3.5 },
];

const hotelGuestDemographics = [
  { name: "Solo", value: 22, color: "#14B8A6" },
  { name: "Couple", value: 35, color: "#3B82F6" },
  { name: "Family", value: 28, color: "#F59E0B" },
  { name: "Business", value: 15, color: "#8B5CF6" },
];

const hotelTopRegions = [
  { region: "Jakarta", bookings: 86, pct: 28 },
  { region: "Surabaya", bookings: 52, pct: 17 },
  { region: "Singapore", bookings: 45, pct: 14 },
  { region: "Medan", bookings: 38, pct: 12 },
  { region: "Bandung", bookings: 31, pct: 10 },
  { region: "Others", bookings: 60, pct: 19 },
];

const hotelBookingChannels = [
  { channel: "Search", bookings: 145, pct: 47 },
  { channel: "Direct Link", bookings: 82, pct: 26 },
  { channel: "Promo/Deals", bookings: 55, pct: 18 },
  { channel: "Referral", bookings: 30, pct: 9 },
];

const hotelMetricData = [
  { month: "Sep", value: 620000 },
  { month: "Oct", value: 740000 },
  { month: "Nov", value: 680000 },
  { month: "Dec", value: 890000 },
  { month: "Jan", value: 810000 },
  { month: "Feb", value: 950000 },
];

// Airline Data
const airlineFunnelData = [
  { name: "Impressions", value: 45000, icon: Eye },
  { name: "Searches", value: 12500, icon: MousePointerClick },
  { name: "Tickets", value: 1800, icon: Plane }, // Standard icon usage
  { name: "Flown", value: 1650, icon: CheckCircle },
];

const airlineConversionData = [
  { month: "Sep", rate: 3.5 },
  { month: "Oct", rate: 3.8 },
  { month: "Nov", rate: 3.2 },
  { month: "Dec", rate: 4.5 },
  { month: "Jan", rate: 4.0 },
  { month: "Feb", rate: 4.2 },
];

const airlinePassengerDemographics = [
  { name: "Economy", value: 65, color: "#3B82F6" },
  { name: "Business", value: 15, color: "#8B5CF6" },
  { name: "First", value: 5, color: "#F59E0B" },
  { name: "Promo", value: 15, color: "#14B8A6" },
];

const airlineTopRoutes = [
  { region: "CGK - DPS", bookings: 450, pct: 35 },
  { region: "CGK - SIN", bookings: 320, pct: 25 },
  { region: "SUB - KUL", bookings: 180, pct: 14 },
  { region: "DPS - SYD", bookings: 150, pct: 12 },
  { region: "KNO - PEN", bookings: 100, pct: 8 },
  { region: "Others", bookings: 80, pct: 6 },
];

const airlineMetricData = [ // RASK or Yield
  { month: "Sep", value: 850 }, // Rp 850 per ASK
  { month: "Oct", value: 920 },
  { month: "Nov", value: 880 },
  { month: "Dec", value: 1100 },
  { month: "Jan", value: 950 },
  { month: "Feb", value: 980 },
];


const formatCurrency = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}jt`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
  return v.toString();
};

export default function AnalyticsPage() {
  const { dateRange } = useDateRange();
  const { partnerType } = usePartner();

  // Select Data based on Partner Type
  const funnelData = partnerType === "hotel" ? hotelFunnelData : airlineFunnelData;
  const conversionData = partnerType === "hotel" ? hotelConversionData : airlineConversionData;
  const demographics = partnerType === "hotel" ? hotelGuestDemographics : airlinePassengerDemographics;
  const topRegions = partnerType === "hotel" ? hotelTopRegions : airlineTopRoutes;
  const channels = partnerType === "hotel" ? hotelBookingChannels : hotelBookingChannels; // Reuse channels for now
  const metricData = partnerType === "hotel" ? hotelMetricData : airlineMetricData;
  
  const metricLabel = partnerType === "hotel" ? "RevPAR Trend" : "Yield Trend (RASK)";
  const metricUnit = partnerType === "hotel" ? "Rp" : "Rp/km";
  const demographicLabel = partnerType === "hotel" ? "Guest Type" : "Seat Class";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Performance from {dateRange.from?.toLocaleDateString()} to {dateRange.to?.toLocaleDateString()}
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
          {funnelData.map((item, i) => (
            <div key={item.name} className="relative">
              <div className={`p-4 rounded-2xl border ${i === funnelData.length - 1 ? "bg-primary/5 border-primary/20" : "bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-700"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === funnelData.length - 1 ? "bg-primary text-white" : "bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 shadow-sm"}`}>
                     {/* Render icon properly if it's a function or component */}
                     <item.icon className="w-4 h-4" />
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
          ))}
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
             {partnerType === "hotel" ? "Top Guest Regions" : "Top Routes"}
          </h3>
          <div className="space-y-4">
            {topRegions.map((item, index) => (
              <div key={item.region} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 w-4">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{item.region}</span>
                    <span className="text-xs font-medium text-gray-500">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${item.pct}%`,
                        backgroundColor: index === 0 ? "#F59E0B" : index === 1 ? "#3B82F6" : "#14B8A6"
                      }} 
                    />
                  </div>
                </div>
                <div className="text-right min-w-[60px]">
                  <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{item.bookings}</span>
                  <p className="text-[10px] text-gray-400">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

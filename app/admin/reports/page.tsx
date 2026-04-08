"use client";

import { useState, useEffect } from "react";
import { Download, Calendar as CalendarIcon, Filter, TrendingUp, Users, CreditCard, Hotel } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("Last 12 Months");
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_bookings: 0,
    new_users: 0,
    avg_order_value: 0
  });
  
  const [bookingData, setBookingData] = useState<{name: string, revenue: number, bookings: number, commission: number, profit: number}[]>([]);
  const [categoryData, setCategoryData] = useState<{name: string, value: number}[]>([
    { name: 'Hotels', value: 0 },
    { name: 'Flights', value: 0 },
  ]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const api = await import("@/lib/api");
        const res = await api.getAdminReports();
        if (res) {
          setStats({
            total_revenue: res.summary?.total_revenue || 0,
            total_bookings: res.summary?.total_bookings || 0,
            new_users: res.summary?.new_users || 0,
            avg_order_value: res.summary?.avg_order || 0,
          });
          
          if (res.monthly_data) {
            const chartData = res.monthly_data.map((d: any) => ({
              name: d.name,
              revenue: d.revenue,
              bookings: d.bookings,
              commission: d.commission,
              profit: d.profit
            }));
            setBookingData(chartData);
          }

          if (res.distribution) {
            setCategoryData(res.distribution);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(1)}k`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const formatYAxis = (val: number) => {
    if (val >= 1000000) return `${val / 1000000}M`;
    if (val >= 1000) return `${val / 1000}k`;
    return val.toString();
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Deep dive into platform performance and metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <CalendarIcon className="w-4 h-4" />
            {dateRange}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading reports data...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: formatCurrency(stats.total_revenue), change: "", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
              { label: "Total Bookings", value: stats.total_bookings.toLocaleString(), change: "", icon: Hotel, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
              { label: "New Users", value: stats.new_users.toLocaleString(), change: "", icon: Users, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
              { label: "Avg. Order Value", value: formatCurrency(stats.avg_order_value), change: "", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.change && <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bookingData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={formatYAxis} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Booking Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Booking Split</h3>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" barSize={30}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} width={70} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} background={{ fill: '#F1F5F9', radius: 4 }} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                {categoryData.map((d, i) => (
                  <div key={i} className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{d.name}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{d.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white">Report Details</h3>
              <button className="text-sm font-medium text-primary hover:text-primary/80">View Full History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th className="px-6 py-4">Period</th>
                    <th className="px-6 py-4">Bookings</th>
                    <th className="px-6 py-4">Gross Revenue</th>
                    <th className="px-6 py-4">Commission</th>
                    <th className="px-6 py-4">Net Profit</th>
                    <th className="px-6 py-4 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {bookingData.slice().reverse().slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.name} {new Date().getFullYear()}</td>
                      <td className="px-6 py-4">{row.bookings}</td>
                      <td className="px-6 py-4">Rp {row.revenue.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-red-500">- Rp {row.commission.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">+ Rp {row.profit.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-right text-gray-400 font-medium">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

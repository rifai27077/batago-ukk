"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, Wallet, BarChart3, Star } from "lucide-react";
import StatCard from "@/components/partner/dashboard/StatCard";
import RevenueChart from "@/components/partner/dashboard/RevenueChart";
import BookingTable from "@/components/partner/dashboard/BookingTable";
import { DashboardSkeleton } from "@/components/partner/dashboard/Skeleton";
import Link from "next/link";
import { Building2, Bell, ArrowRight } from "lucide-react";

const quickActions = [
  { label: "Add New Listing", href: "/partner/dashboard/listings", icon: Building2, color: "bg-primary" },
  { label: "View All Bookings", href: "/partner/dashboard/bookings", icon: CalendarCheck, color: "bg-blue-500" },
  { label: "Check Notifications", href: "#", icon: Bell, color: "bg-amber-500" },
];

import OnboardingProgress from "@/components/partner/dashboard/OnboardingProgress";
import { getDashboardStats, DashboardStats } from "@/lib/api";

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getDashboardStats();
        if (res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 text-black dark:text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">Selamat Sore, Partner! 👋</h1>
          </div>
          <p className="text-black dark:text-white/70 text-sm md:text-base max-w-lg">
            Berikut ringkasan performa bisnis Anda hari ini. Ada <span className="text-primary font-semibold">{stats?.bookings?.trend || 0} booking baru</span> minggu ini.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-5">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 backdrop-blur-sm text-black dark:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-white/10 hover:border-white/20"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding Progress - NEW */}
      <OnboardingProgress />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats?.bookings?.total.toString() || "0"}
          subtitle="All time"
          icon={CalendarCheck}
          trend={{ value: `${(stats?.bookings?.trend ?? 0) > 0 ? "+" : ""}${stats?.bookings?.trend ?? 0}%`, direction: (stats?.bookings?.trend ?? 0) >= 0 ? "up" : "down" }}
          accentColor="bg-primary"
        />
        <StatCard
          title="Revenue"
          value={`Rp ${(stats?.revenue?.total || 0).toLocaleString()}`}
          subtitle="All time"
          icon={Wallet}
          trend={{ value: `${(stats?.revenue?.trend ?? 0) > 0 ? "+" : ""}${stats?.revenue?.trend ?? 0}%`, direction: (stats?.revenue?.trend ?? 0) >= 0 ? "up" : "down" }}
          accentColor="bg-primary"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats?.occupancy?.rate || 0}%`}
          subtitle="Average"
          icon={BarChart3}
          trend={{ value: `${(stats?.occupancy?.trend ?? 0) > 0 ? "+" : ""}${stats?.occupancy?.trend ?? 0}%`, direction: (stats?.occupancy?.trend ?? 0) >= 0 ? "up" : "down" }}
          accentColor="bg-primary"
        />
        <StatCard
          title="Avg. Rating"
          value={stats?.rating?.average.toString() || "0"}
          subtitle={`dari ${stats?.rating?.count || 0} reviews`}
          icon={Star}
          trend={{ value: `${(stats?.rating?.trend ?? 0) > 0 ? "+" : ""}${stats?.rating?.trend ?? 0}`, direction: (stats?.rating?.trend ?? 0) >= 0 ? "up" : "down" }}
          accentColor="bg-primary"
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Activity</h3>
          <div className="space-y-4">
            {stats?.recent_activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group cursor-pointer">
                <div className="relative mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full block bg-primary`} />
                  {i < (stats?.recent_activity.length || 0) - 1 && <span className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-100 dark:bg-slate-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{item.desc}</p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
            {!stats?.recent_activity.length && (
                <p className="text-sm text-gray-500">No recent activity.</p>
            )}
          </div>
          <Link
            href="/partner/dashboard/bookings"
            className="flex items-center justify-center gap-1 mt-5 text-sm text-primary font-semibold hover:gap-2 transition-all"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <BookingTable showPagination={true} itemsPerPage={5} />
    </div>
  );
}

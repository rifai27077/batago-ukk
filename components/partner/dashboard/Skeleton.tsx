"use client";

/**
 * Reusable skeleton loading components for the Partner Dashboard.
 * Provides shimmer-effect placeholders for charts, tables, and stat cards.
 */

function ShimmerBlock({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse ${className}`}
      style={style}
    />
  );
}

/* ─── Stat Card Skeleton ─── */
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <ShimmerBlock className="w-11 h-11 rounded-xl" />
        <ShimmerBlock className="w-14 h-6 rounded-full" />
      </div>
      <ShimmerBlock className="w-24 h-7 mb-2" />
      <ShimmerBlock className="w-20 h-4" />
      <ShimmerBlock className="w-16 h-3 mt-1" />
    </div>
  );
}

/* ─── Chart Skeleton ─── */
export function ChartSkeleton({ height = "h-72" }: { height?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <ShimmerBlock className="w-36 h-5 mb-2" />
          <ShimmerBlock className="w-48 h-3" />
        </div>
        <ShimmerBlock className="w-36 h-8 rounded-xl" />
      </div>
      {/* Chart area */}
      <div className={`${height} flex items-end gap-3 px-4`}>
        {[40, 65, 50, 80, 70, 90].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <ShimmerBlock className="rounded-t-md" style={{ height: `${h}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Table Skeleton ─── */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <ShimmerBlock className="w-36 h-5 mb-1.5" />
          <ShimmerBlock className="w-28 h-3" />
        </div>
        <ShimmerBlock className="w-16 h-4" />
      </div>
      {/* Table header */}
      <div className="hidden md:block">
        <div className="flex items-center gap-4 bg-gray-50/80 px-5 py-3">
          {[80, 100, 80, 90, 70, 80, 50].map((w, i) => (
            <ShimmerBlock key={i} className="h-3" style={{ width: `${w}px` }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
            <ShimmerBlock className="w-28 h-4" />
            <ShimmerBlock className="w-24 h-4" />
            <ShimmerBlock className="w-20 h-4" />
            <ShimmerBlock className="w-28 h-4" />
            <ShimmerBlock className="w-16 h-5 rounded-full" />
            <ShimmerBlock className="w-24 h-4 ml-auto" />
            <ShimmerBlock className="w-8 h-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Activity Feed Skeleton ─── */
export function ActivitySkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <ShimmerBlock className="w-28 h-5 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <ShimmerBlock className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" />
            <div className="flex-1">
              <ShimmerBlock className="w-32 h-4 mb-1.5" />
              <ShimmerBlock className="w-44 h-3 mb-1" />
              <ShimmerBlock className="w-16 h-2.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dashboard Overview Skeleton (full page) ─── */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <ShimmerBlock className="w-72 h-7 mb-3 bg-white" />
        <ShimmerBlock className="w-96 h-4 bg-white" />
        <div className="flex gap-3 mt-5">
          <ShimmerBlock className="w-36 h-9 rounded-xl bg-white" />
          <ShimmerBlock className="w-36 h-9 rounded-xl bg-white" />
          <ShimmerBlock className="w-40 h-9 rounded-xl bg-white" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ActivitySkeleton />
      </div>

      {/* Table */}
      <TableSkeleton />
    </div>
  );
}

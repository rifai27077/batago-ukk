"use client";

import { DashboardSkeleton } from "@/components/partner/dashboard/Skeleton";

export default function AdminLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <DashboardSkeleton />
    </div>
  );
}

"use client";

type StatusType = "confirmed" | "pending" | "cancelled" | "completed" | "active" | "draft" | "inactive";

const statusStyles: Record<StatusType, { bg: string; text: string; dot: string; label: string }> = {
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Confirmed" },
  pending:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   label: "Pending" },
  cancelled: { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     label: "Cancelled" },
  completed: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",    label: "Completed" },
  active:    { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Active" },
  draft:     { bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400",    label: "Draft" },
  inactive:  { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400",    label: "Inactive" },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

export type { StatusType };

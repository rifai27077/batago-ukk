"use client";

type StatusType = "confirmed" | "pending" | "cancelled" | "completed" | "active" | "draft" | "inactive" | "refunded";

const statusStyles: Record<StatusType, { bg: string; text: string; dot: string; label: string }> = {
  confirmed: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", label: "Confirmed" },
  pending:   { bg: "bg-amber-50 dark:bg-amber-500/10",     text: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500",   label: "Pending" },
  cancelled: { bg: "bg-red-50 dark:bg-red-500/10",         text: "text-red-700 dark:text-red-400",         dot: "bg-red-500",     label: "Cancelled" },
  completed: { bg: "bg-blue-50 dark:bg-blue-500/10",       text: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500",    label: "Completed" },
  refunded:  { bg: "bg-gray-100 dark:bg-slate-700",        text: "text-gray-600 dark:text-slate-300",      dot: "bg-gray-500",    label: "Refunded" },
  active:    { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", label: "Active" },
  draft:     { bg: "bg-gray-100 dark:bg-slate-700",        text: "text-gray-600 dark:text-slate-300",      dot: "bg-gray-400 dark:bg-slate-500",    label: "Draft" },
  inactive:  { bg: "bg-gray-100 dark:bg-slate-700",        text: "text-gray-500 dark:text-slate-400",      dot: "bg-gray-400 dark:bg-slate-500",    label: "Inactive" },
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

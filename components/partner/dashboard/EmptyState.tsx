"use client";

import { ReactNode } from "react";
import {
  CalendarX,
  MessageSquareOff,
  Building2,
  SearchX,
  FileQuestion,
  type LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "booking" | "review" | "listing" | "search";
  compact?: boolean;
}

const variantConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  default:  { icon: FileQuestion,     color: "text-gray-300", bg: "bg-gray-100" },
  booking:  { icon: CalendarX,        color: "text-teal-300", bg: "bg-teal-50" },
  review:   { icon: MessageSquareOff, color: "text-amber-300", bg: "bg-amber-50" },
  listing:  { icon: Building2,        color: "text-blue-300", bg: "bg-blue-50" },
  search:   { icon: SearchX,          color: "text-gray-300", bg: "bg-gray-100" },
};

export default function EmptyState({
  icon: CustomIcon,
  title,
  description,
  action,
  variant = "default",
  compact = false,
}: EmptyStateProps) {
  const config = variantConfig[variant] || variantConfig.default;
  const Icon = CustomIcon || config.icon;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-8 px-4" : "py-16 px-6"}`}>
      {/* Decorative circles */}
      <div className="relative mb-5">
        <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center`}>
          <Icon className={`w-9 h-9 ${config.color}`} />
        </div>
        {/* Floating dots */}
        <span className={`absolute -top-1 -right-1 w-3 h-3 ${config.bg} rounded-full opacity-60`} />
        <span className={`absolute -bottom-1 -left-2 w-2 h-2 ${config.bg} rounded-full opacity-40`} />
      </div>

      <h3 className={`font-bold text-gray-700 ${compact ? "text-sm" : "text-base"}`}>
        {title}
      </h3>
      {description && (
        <p className={`text-gray-400 mt-1.5 max-w-xs ${compact ? "text-xs" : "text-sm"}`}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { startOfMonth, endOfMonth, subDays } from "date-fns";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}

export function DateRangeProvider({ children }: { children: ReactNode }) {
  // Default to current month or last 30 days
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

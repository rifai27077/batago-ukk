"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import BlockDateModal from "@/components/partner/dashboard/BlockDateModal";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type DayStatus = "available" | "booked" | "blocked" | "pending";

interface CalendarDay {
  date: number;
  status: DayStatus;
  price?: string;
  guest?: string;
}

// Mock data generator
function generateMockDays(year: number, month: number): CalendarDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];
  const bookedRanges = [
    { start: 3, end: 5, guest: "Ahmad R." },
    { start: 10, end: 12, guest: "Budi P." },
    { start: 16, end: 18, guest: "Siti N." },
    { start: 22, end: 25, guest: "Reza A." },
  ];
  const blockedDays = [8, 9, 28, 29];
  const pendingDays = [14, 15];

  for (let d = 1; d <= daysInMonth; d++) {
    const booked = bookedRanges.find((r) => d >= r.start && d <= r.end);
    if (booked) {
      days.push({ date: d, status: "booked", guest: booked.guest, price: "Rp 850.000" });
    } else if (blockedDays.includes(d)) {
      days.push({ date: d, status: "blocked" });
    } else if (pendingDays.includes(d)) {
      days.push({ date: d, status: "pending", guest: "Dewi L.", price: "Rp 850.000" });
    } else {
      days.push({ date: d, status: "available", price: "Rp 850.000" });
    }
  }
  return days;
}

const statusColors: Record<DayStatus, { bg: string; border: string; text: string; darkBg: string; darkBorder: string; darkText: string }> = {
  available: { bg: "bg-emerald-50 hover:bg-emerald-100", border: "border-emerald-200", text: "text-emerald-700", darkBg: "dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20", darkBorder: "dark:border-emerald-500/20", darkText: "dark:text-emerald-400" },
  booked: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", darkBg: "dark:bg-blue-500/10", darkBorder: "dark:border-blue-500/20", darkText: "dark:text-blue-400" },
  blocked: { bg: "bg-gray-100", border: "border-gray-200", text: "text-gray-400", darkBg: "dark:bg-slate-800", darkBorder: "dark:border-slate-700", darkText: "dark:text-slate-500" },
  pending: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", darkBg: "dark:bg-amber-500/10", darkBorder: "dark:border-amber-500/20", darkText: "dark:text-amber-400" },
};

const rooms = ["All Rooms", "Deluxe Room", "Suite Room", "Family Room", "Standard Room"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Feb 2026
  const [selectedRoom, setSelectedRoom] = useState("All Rooms");
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const handleBlockDates = (data: any) => {
    console.log("Blocking Dates:", data);
    setIsBlockModalOpen(false);
    // Add logic to update calendar state
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateMockDays(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Availability Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage room availability and pricing</p>
        </div>
        <button 
          onClick={() => setIsBlockModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Block Dates
        </button>
      </div>

      <BlockDateModal 
        isOpen={isBlockModalOpen} 
        onClose={() => setIsBlockModalOpen(false)} 
        onSave={handleBlockDates} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Calendar */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          {/* Month Navigation + Room Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-500 dark:text-slate-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white min-w-[180px] text-center">
                {MONTHS[month]} {year}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-gray-500 dark:text-slate-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="text-sm bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-2 text-gray-700 dark:text-slate-200 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
            >
              {rooms.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {days.map((day) => {
              const colors = statusColors[day.status];
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl border ${colors.bg} ${colors.darkBg} ${colors.border} ${colors.darkBorder} p-1.5 flex flex-col items-start justify-between transition-all ${
                    selectedDay?.date === day.date ? "ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-800" : ""
                  } ${day.status === "blocked" ? "line-through opacity-60" : "cursor-pointer"}`}
                >
                  <span className={`text-sm font-bold ${colors.text} ${colors.darkText}`}>{day.date}</span>
                  {day.price && day.status !== "blocked" && (
                    <span className="text-[9px] font-medium text-gray-400 dark:text-slate-500 hidden sm:block">{day.price.replace("Rp ", "").replace(".000", "k")}</span>
                  )}
                  {day.guest && (
                    <span className="text-[8px] font-semibold text-blue-600 dark:text-blue-400 truncate w-full hidden md:block">{day.guest}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
            {(["available", "booked", "pending", "blocked"] as DayStatus[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm border ${statusColors[s].bg} ${statusColors[s].darkBg} ${statusColors[s].border} ${statusColors[s].darkBorder}`} />
                <span className="text-xs text-gray-500 dark:text-slate-400 capitalize font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Day Detail / Rate Manager */}
        <div className="space-y-5">
          {/* Selected Day Detail */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Day Detail</h3>
              {selectedDay && (
                <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {selectedDay ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Date</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{selectedDay.date} {MONTHS[month]} {year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 capitalize ${statusColors[selectedDay.status].bg} ${statusColors[selectedDay.status].darkBg} ${statusColors[selectedDay.status].text} ${statusColors[selectedDay.status].darkText}`}>
                    {selectedDay.status}
                  </span>
                </div>
                {selectedDay.price && (
                  <div>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Rate</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{selectedDay.price}</p>
                  </div>
                )}
                {selectedDay.guest && (
                  <div>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Guest</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{selectedDay.guest}</p>
                  </div>
                )}
                <div className="pt-2 space-y-2">
                  {selectedDay.status === "available" && (
                    <button className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium py-2 rounded-xl transition-colors">
                      Block This Date
                    </button>
                  )}
                  {selectedDay.status === "blocked" && (
                    <button className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium py-2 rounded-xl transition-colors">
                      Unblock Date
                    </button>
                  )}
                  <button className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-200 text-sm font-medium py-2 rounded-xl transition-colors">
                    Edit Rate
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Click a date to see details</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Month Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Available", value: "15 days", color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Booked", value: "10 days", color: "text-blue-600 dark:text-blue-400" },
                { label: "Pending", value: "2 days", color: "text-amber-600 dark:text-amber-400" },
                { label: "Blocked", value: "4 days", color: "text-gray-500 dark:text-slate-400" },
                { label: "Occupancy", value: "67%", color: "text-primary dark:text-primary" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-slate-400">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

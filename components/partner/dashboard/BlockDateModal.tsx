"use client";

import { useState } from "react";
import { X, Calendar, Info, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface BlockDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const REASONS = [
  { id: "maintenance", label: "Maintenance", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { id: "personal", label: "Personal Use", icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { id: "fully_booked", label: "Fully Booked", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { id: "other", label: "Other", icon: Info, color: "text-gray-500", bg: "bg-gray-50 dark:bg-slate-700" },
];

export default function BlockDateModal({ isOpen, onClose, onSave, initialStartDate, initialEndDate }: BlockDateModalProps) {
  const [formData, setFormData] = useState({
    startDate: initialStartDate || "",
    endDate: initialEndDate || "",
    reason: "maintenance",
    notes: "",
    allRooms: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
               <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Block Dates</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Prevent bookings for a specific period</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Reason for Blocking</label>
            <div className="grid grid-cols-4 gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, reason: r.id })}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                    formData.reason === r.id 
                      ? "border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/5 text-amber-600 dark:text-amber-500" 
                      : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-600"
                  }`}
                  title={r.label}
                >
                  <div className={`w-8 h-8 ${r.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <r.icon className={`w-4 h-4 ${r.color}`} />
                  </div>
                  <span className="text-[10px] font-bold truncate w-full">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Notes (Optional)</label>
              <textarea
                placeholder="e.g. Annual maintenance"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white resize-none"
              />
            </div>
            <div className="shrink-0 flex items-end">
              <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 cursor-pointer h-fit">
                <input 
                  type="checkbox"
                  checked={formData.allRooms}
                  onChange={(e) => setFormData({ ...formData, allRooms: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500" 
                />
                <span className="text-[11px] font-bold text-gray-700 dark:text-slate-200">Block all rooms</span>
              </label>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-50 dark:bg-red-500/5 rounded-xl border border-red-100/50 dark:border-red-500/10 flex gap-2.5">
             <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-red-800 dark:text-red-400/80 leading-relaxed font-medium">
               Blocking dates will decline pending inquiries. Booked reservations are unaffected.
             </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-2 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg hover:shadow-gray-200 dark:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0"
            >
              Block Availability
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Plane, MapPin, Clock, Calendar, CheckCircle2, ChevronRight, Hash, ArrowRight, DollarSign } from "lucide-react";

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const DAYS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

export default function AddRouteModal({ isOpen, onClose, onSave }: AddRouteModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    flightNumber: "",
    duration: "", // in minutes or text like "1h 30m"
    aircraft: "",
    schedule: [] as string[],
    basePrice: "",
  });

  if (!isOpen) return null;

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleDay = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.includes(id)
        ? prev.schedule.filter((d) => d !== id)
        : [...prev.schedule, id],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Route</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Step {step} of 3: {step === 1 ? "Route Details" : step === 2 ? "Schedule & Aircraft" : "Pricing & Review"}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100 dark:bg-slate-700 flex">
          <div 
            className="h-full bg-sky-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-200">Origin (From)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. CGK (Jakarta)"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value.toUpperCase() })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-bold text-gray-700 dark:text-slate-200">Destination (To)</label>
                   <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. DPS (Bali)"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value.toUpperCase() })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Route Connector */}
              {(formData.origin || formData.destination) && (
                <div className="flex items-center justify-center gap-4 py-4 opacity-50">
                   <span className="text-2xl font-bold text-gray-400">{formData.origin || "ORG"}</span>
                   <div className="flex-1 max-w-[100px] h-[2px] bg-gray-200 dark:bg-slate-700 relative flex items-center justify-center">
                      <Plane className="w-5 h-5 text-gray-300 dark:text-slate-600 rotate-90 absolute" />
                   </div>
                   <span className="text-2xl font-bold text-gray-400">{formData.destination || "DST"}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Flight Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. GA-102"
                    value={formData.flightNumber}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Duration</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input
                    type="text"
                    placeholder="e.g. 1h 45m"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Assign Aircraft</label>
                <div className="relative">
                   <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <select
                    value={formData.aircraft}
                    onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select an aircraft</option>
                    <option value="boeing-737">Boeing 737-800 (PK-GIA)</option>
                    <option value="airbus-a320">Airbus A320 (PK-GIB)</option>
                    <option value="atr-72">ATR 72-600 (PK-GIC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Weekly Schedule</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        formData.schedule.includes(day.id)
                          ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {day.label.charAt(0)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Select operating days.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Base Economy Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                  <input
                    type="number"
                    placeholder="1.200.000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

               <div className="p-4 bg-sky-500/5 rounded-2xl border border-sky-500/10">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-sky-500 italic">Ready to take off!</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                       New route <b>{formData.origin || "..."}</b> <ArrowRight className="inline w-3 h-3" /> <b>{formData.destination || "..."}</b> will be added to your schedule.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <button 
            onClick={step === 1 ? onClose : handleBack}
            className="px-5 py-2.5 text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          <button 
            disabled={step === 1 && (!formData.origin || !formData.destination)}
            onClick={step === 3 ? () => onSave(formData) : handleNext}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-sky-500/20"
          >
            {step === 3 ? "Launch Route" : "Next Step"}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
            {step === 3 && <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

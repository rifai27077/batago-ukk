"use client";

import { useState } from "react";
import { X, Plane, Wrench, Users, CheckCircle2, ChevronRight, Hash, Gauge, Armchair, Calendar } from "lucide-react";

interface AddAircraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AIRCRAFT_TYPES = [
  { id: "boeing-737", label: "Boeing 737-800", capacity: 189, range: "Short-Medium" },
  { id: "airbus-a320", label: "Airbus A320", capacity: 180, range: "Short-Medium" },
  { id: "atr-72", label: "ATR 72-600", capacity: 70, range: "Short" },
  { id: "boeing-777", label: "Boeing 777-300ER", capacity: 396, range: "Long Haul" },
];

export default function AddAircraftModal({ isOpen, onClose, onSave }: AddAircraftModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    registration: "",
    model: "",
    capacity: 0,
    yom: "", // Year of Manufacture
    status: "active",
    maintenanceDate: "",
  });

  if (!isOpen) return null;

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Aircraft</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Step {step} of 2: {step === 1 ? "Aircraft Details" : "Configuration & Status"}</p>
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
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Model & Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AIRCRAFT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFormData({ ...formData, model: t.label, capacity: t.capacity })}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        formData.model === t.label
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300"
                          : "border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                         <Plane className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-bold text-sm">{t.label}</p>
                         <p className="text-xs opacity-70">{t.range} • {t.capacity} Seats</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Registration Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. PK-GIA"
                    value={formData.registration}
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value.toUpperCase() })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Total Capacity</label>
                    <div className="relative">
                      <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Year of Manufacture</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. 2018"
                        value={formData.yom}
                        onChange={(e) => setFormData({ ...formData, yom: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Operational Status</label>
                 <div className="flex gap-2">
                    <button 
                       onClick={() => setFormData({...formData, status: "active"})}
                       className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${formData.status === "active" ? "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600" : "border-gray-200 dark:border-slate-700 text-gray-500"}`}
                    >
                       Active
                    </button>
                    <button 
                       onClick={() => setFormData({...formData, status: "maintenance"})}
                       className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${formData.status === "maintenance" ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600" : "border-gray-200 dark:border-slate-700 text-gray-500"}`}
                    >
                       Maintenance
                    </button>
                 </div>
               </div>

               <div className="p-4 bg-sky-500/5 rounded-2xl border border-sky-500/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center shrink-0">
                     <Gauge className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-sky-900 dark:text-sky-100">Fleet Optimization</p>
                     <p className="text-xs text-sky-700 dark:text-sky-300 mt-1">Adding newer aircraft improves your fuel efficiency rating. Make sure to update maintenance logs regularly.</p>
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
            disabled={step === 1 && (!formData.model || !formData.registration)}
            onClick={step === 2 ? () => onSave(formData) : handleNext}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-sky-500/20"
          >
            {step === 2 ? "Add Aircraft" : "Next Step"}
            {step < 2 && <ChevronRight className="w-4 h-4" />}
            {step === 2 && <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

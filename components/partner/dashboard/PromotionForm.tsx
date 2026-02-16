"use client";

import { useState, useEffect } from "react";
import { X, Tag, Calendar, Building2, CheckCircle2, ChevronRight, ChevronLeft, Percent, Clock, Zap, Star } from "lucide-react";

interface PromotionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const promoTypes = [
  { 
    id: "flash_sale", 
    label: "Flash Sale", 
    desc: "Short duration, deep discount (e.g. 24h limited)", 
    icon: Zap, 
    color: "bg-red-500", 
    defaultDisc: 25,
    suggestedDuration: 1 
  },
  { 
    id: "last_minute", 
    label: "Last Minute", 
    desc: "Target empty rooms for the next 48 hours", 
    icon: Clock, 
    color: "bg-orange-500", 
    defaultDisc: 15,
    suggestedDuration: 2 
  },
  { 
    id: "early_bird", 
    label: "Early Bird", 
    desc: "Reward guests who book 30+ days in advance", 
    icon: Star, 
    color: "bg-blue-500", 
    defaultDisc: 20,
    suggestedDuration: 90 
  },
  { 
    id: "seasonal", 
    label: "Seasonal", 
    desc: "Holidays, festivals, or local events", 
    icon: Calendar, 
    color: "bg-purple-500", 
    defaultDisc: 10,
    suggestedDuration: 30 
  },
];

export default function PromotionForm({ isOpen, onClose, onSave, initialData }: PromotionFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "flash_sale",
    discount: 25,
    startDate: "",
    endDate: "",
    listings: [] as string[],
    minStay: 1,
    autoApply: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const selectedType = promoTypes.find(t => t.id === formData.type);

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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData ? "Edit Promotion" : "Create New Promotion"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Step {step} of 3: {step === 1 ? "Select Type" : step === 2 ? "Configure Rules" : "Select Listings"}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Select Promotion Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {promoTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({ ...formData, type: t.id, discount: t.defaultDisc })}
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      formData.type === t.id 
                        ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                        : "border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className={`w-12 h-12 ${t.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                      <t.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t.label}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 leading-snug">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="pt-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Special 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Discount Percentage</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Min. Stay (Nights)</label>
                  <input
                    type="number"
                    value={formData.minStay}
                    onChange={(e) => setFormData({ ...formData, minStay: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                     <Zap className="w-4 h-4" />
                   </div>
                   <p className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-wider">Estimated Impact</p>
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-400/90 mt-2 leading-relaxed font-medium">
                   Based on your settings, we estimate a <span className="underline decoration-2">15-22% increase</span> in visibility for these dates.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Apply to Properties</label>
              <div className="space-y-2">
                {[
                  { id: "1", name: "Hotel Santika Premiere Batam", type: "Hotel" },
                  { id: "2", name: "Santika Beach Resort", type: "Resort" },
                  { id: "3", name: "Villa Paradise Bintan", type: "Villa" },
                ].map((listing) => (
                  <label 
                    key={listing.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <input 
                      type="checkbox"
                      checked={formData.listings.includes(listing.id)}
                      onChange={(e) => {
                        const newSelection = e.target.checked 
                          ? [...formData.listings, listing.id]
                          : formData.listings.filter(id => id !== listing.id);
                        setFormData({ ...formData, listings: newSelection });
                      }}
                      className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary" 
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{listing.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{listing.type} · Batam</p>
                    </div>
                  </label>
                ))}
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
            disabled={step === 1 && !formData.name}
            onClick={step === 3 ? () => onSave(formData) : handleNext}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-primary/20"
          >
            {step === 3 ? "Launch Promotion" : "Next Step"}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
            {step === 3 && <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

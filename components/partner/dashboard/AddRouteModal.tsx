"use client";

import { useState, useEffect } from "react";
import { X, Plane, MapPin, Clock, Calendar, CheckCircle2, ChevronRight, Hash, ArrowRight, DollarSign, Users } from "lucide-react";
import { getPartnerFleet, PartnerAircraft } from "@/lib/api";

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  isViewOnly?: boolean;
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

export default function AddRouteModal({ isOpen, onClose, onSave, initialData, isViewOnly }: AddRouteModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    flightNumber: "",
    duration: "", 
    aircraft: "",
    schedule: [] as string[],
    classes: [
      { class: "Economy", price: "", capacity: "180", active: true },
      { class: "Business", price: "", capacity: "20", active: false },
      { class: "First", price: "", capacity: "8", active: false },
    ],
  });
  const [fleet, setFleet] = useState<PartnerAircraft[]>([]);

  useEffect(() => {
    if (isOpen) {
      getPartnerFleet().then(res => setFleet(res.data || [])).catch(console.error);

      if (initialData) {
        setFormData({
          origin: initialData.origin || "",
          destination: initialData.destination || "",
          flightNumber: initialData.flight_number || initialData.flightNumber || "",
          duration: initialData.duration || "",
          aircraft: initialData.aircraft || "",
          schedule: Array.isArray(initialData.schedule) ? initialData.schedule : [],
          classes: Array.isArray(initialData.classes) && initialData.classes.length > 0
            ? [
                { 
                  class: "Economy", 
                  price: initialData.classes.find((c:any)=>c.class==="Economy")?.price || "", 
                  capacity: initialData.classes.find((c:any)=>c.class==="Economy")?.capacity || "180", 
                  active: !!initialData.classes.find((c:any)=>c.class==="Economy") 
                },
                { 
                  class: "Business", 
                  price: initialData.classes.find((c:any)=>c.class==="Business")?.price || "", 
                  capacity: initialData.classes.find((c:any)=>c.class==="Business")?.capacity || "20", 
                  active: !!initialData.classes.find((c:any)=>c.class==="Business") 
                },
                { 
                  class: "First", 
                  price: initialData.classes.find((c:any)=>c.class==="First")?.price || "", 
                  capacity: initialData.classes.find((c:any)=>c.class==="First")?.capacity || "8", 
                  active: !!initialData.classes.find((c:any)=>c.class==="First") 
                },
              ]
            : [
                { class: "Economy", price: initialData.base_price || "", capacity: "180", active: true },
                { class: "Business", price: "", capacity: "20", active: false },
                { class: "First", price: "", capacity: "8", active: false },
              ],
        });
        setStep(1);
      } else {
        setFormData({
          origin: "", destination: "", flightNumber: "", duration: "", aircraft: "", schedule: [],
          classes: [
            { class: "Economy", price: "", capacity: "180", active: true },
            { class: "Business", price: "", capacity: "20", active: false },
            { class: "First", price: "", capacity: "8", active: false },
          ]
        });
        setStep(1);
      }
    }
  }, [isOpen, initialData]);

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

  const updateClass = (idx: number, field: string, value: any) => {
    setFormData((prev) => {
      const newClasses = [...prev.classes];
      newClasses[idx] = { ...newClasses[idx], [field]: value };
      return { ...prev, classes: newClasses };
    });
  };

  const hasAnyActiveClassesWithPrices = formData.classes.some(c => c.active && c.price);

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
              {isViewOnly ? "Route Details" : initialData ? "Edit Route" : "Add New Route"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Step {step} of 3: {step === 1 ? "Route Details" : step === 2 ? "Schedule & Aircraft" : "Pricing & Capacity"}</p>
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
                      disabled={isViewOnly || !!initialData}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value.toUpperCase() })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white uppercase disabled:opacity-50"
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
                      disabled={isViewOnly || !!initialData}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value.toUpperCase() })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white uppercase disabled:opacity-50"
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
                    disabled={isViewOnly}
                    onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white disabled:opacity-50"
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
                    disabled={isViewOnly}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Assign Aircraft</label>
                <div className="relative">
                   <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.aircraft}
                    disabled={isViewOnly}
                    onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled>Select an aircraft</option>
                    {fleet.map((plane: any) => (
                      <option key={plane.ID || plane.id} value={plane.registration}>
                        {plane.model} ({plane.registration})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Weekly Schedule</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.id}
                      disabled={isViewOnly}
                      onClick={() => toggleDay(day.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all disabled:opacity-50 ${
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
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Flight Classes & Pricing</label>
                <div className="space-y-3">
                  {formData.classes.map((cls, idx) => (
                    <div key={cls.class} className={`border rounded-xl transition-all ${cls.active ? 'border-sky-500/30 bg-sky-50 dark:bg-sky-500/5' : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                      {/* Checkbox Header */}
                      <label className="flex items-center gap-3 p-4 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${cls.active ? 'bg-sky-500 border-sky-500' : 'border-gray-300 dark:border-slate-600'}`}>
                          {cls.active && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={cls.active} 
                          disabled={isViewOnly}
                          onChange={(e) => updateClass(idx, 'active', e.target.checked)} 
                        />
                        <span className={`font-bold ${cls.active ? 'text-sky-700 dark:text-sky-400' : 'text-gray-600 dark:text-slate-400'}`}>
                          {cls.class} Class
                        </span>
                      </label>

                      {/* Inputs */}
                      {cls.active && (
                        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 font-medium">Ticket Price</p>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                              <input
                                type="number"
                                placeholder={cls.class === 'Economy' ? "1200000" : cls.class === 'Business' ? "4500000" : "8000000"}
                                value={cls.price}
                                disabled={isViewOnly}
                                onChange={(e) => updateClass(idx, 'price', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1.5 font-medium">Seat Capacity</p>
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="number"
                                placeholder="Number of seats"
                                value={cls.capacity}
                                disabled={isViewOnly}
                                onChange={(e) => updateClass(idx, 'capacity', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 outline-none transition-all dark:text-white disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

               <div className="p-4 bg-sky-500/5 rounded-2xl border border-sky-500/10">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-sky-500 italic">Ready to take off!</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                       New route <b>{formData.origin || "..."}</b> <ArrowRight className="inline w-3 h-3" /> <b>{formData.destination || "..."}</b> with {formData.classes.filter(c=>c.active).length} classes will be added to your schedule.
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
          
          {!isViewOnly ? (
            <button 
              disabled={(step === 1 && (!formData.origin || !formData.destination)) || (step === 3 && !hasAnyActiveClassesWithPrices)}
              onClick={step === 3 ? () => onSave?.(formData) : handleNext}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-sky-500/20"
            >
              {step === 3 ? (initialData ? "Save Changes" : "Launch Route") : "Next Step"}
              {step < 3 && <ChevronRight className="w-4 h-4" />}
              {step === 3 && <CheckCircle2 className="w-4 h-4" />}
            </button>
          ) : (
            <button 
              onClick={step === 3 ? onClose : handleNext}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-sky-500/20"
            >
              {step === 3 ? "Close" : "Next Step"}
              {step < 3 && <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

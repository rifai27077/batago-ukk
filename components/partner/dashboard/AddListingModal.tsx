"use client";

import { useState } from "react";
import { X, Building2, MapPin, BedDouble, Wifi, Coffee, Utensils, Tv, Wind, CheckCircle2, ChevronRight, ChevronLeft, Image as ImageIcon, Briefcase, Camera } from "lucide-react";

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const PROPERTY_TYPES = [
  { id: "hotel", label: "Hotel", icon: Building2 },
  { id: "resort", label: "Resort", icon: BedDouble },
  { id: "villa", label: "Villa", icon: Building2 },
  { id: "apartment", label: "Apartment", icon: Building2 },
];

const AMENITIES = [
  { id: "wifi", label: "Free WiFi", icon: Wifi },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "pool", label: "Pool", icon: Wind },
  { id: "parking", label: "Parking", icon: Briefcase },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "tv", label: "Smart TV", icon: Tv },
  { id: "ac", label: "Air Conditioning", icon: Wind },
];

export default function AddListingModal({ isOpen, onClose, onSave }: AddListingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "hotel",
    location: "",
    description: "",
    rooms: 1,
    amenities: [] as string[],
    price: "",
    image: null as File | null,
  });

  if (!isOpen) return null;

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleAmenity = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Listing</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Step {step} of 3: {step === 1 ? "Basic Information" : step === 2 ? "Property Details" : "Photos & Pricing"}</p>
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
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Property Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Batam Hotel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Property Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFormData({ ...formData, type: t.id })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                        formData.type === t.id 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-600"
                      }`}
                    >
                      <t.icon className="w-6 h-6" />
                      <span className="text-xs font-bold">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Nagoya, Batam"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Description</label>
                <textarea
                  placeholder="Tell guests about your property..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITIES.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => toggleAmenity(a.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        formData.amenities.includes(a.id)
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-600"
                      }`}
                    >
                      <a.icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Total Rooms</label>
                <input
                  type="number"
                  min="1"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Main Property Photo</label>
                <div 
                  className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Click to upload photo</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Base Price (per night)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                  <input
                    type="number"
                    placeholder="850.000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-primary italic">Almost there!</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">Once you launch, our team will review your listing within 24 hours. You can still edit these details later.</p>
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
            disabled={step === 1 && (!formData.name || !formData.location)}
            onClick={step === 3 ? () => onSave(formData) : handleNext}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-primary/20"
          >
            {step === 3 ? "Launch Listing" : "Next Step"}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
            {step === 3 && <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

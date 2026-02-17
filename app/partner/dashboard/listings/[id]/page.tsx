"use client";

import { use } from "react";
import { useState } from "react";
import { ArrowLeft, Save, Building2, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import PhotoGalleryManager from "@/components/partner/dashboard/PhotoGalleryManager";

const PROPERTY_TYPES = [
  { id: "hotel", label: "Hotel" },
  { id: "resort", label: "Resort" },
  { id: "villa", label: "Villa" },
  { id: "apartment", label: "Apartment" },
];

const AMENITIES = [
  { id: "wifi", label: "Free WiFi" },
  { id: "breakfast", label: "Breakfast" },
  { id: "pool", label: "Pool" },
  { id: "parking", label: "Parking" },
  { id: "restaurant", label: "Restaurant" },
  { id: "tv", label: "Smart TV" },
  { id: "ac", label: "Air Conditioning" },
  { id: "gym", label: "Gym" },
  { id: "spa", label: "Spa" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: PageProps) {
  const { id } = use(params);
  
  // Mock initial data - in real app fetch based on ID
  const [formData, setFormData] = useState({
    name: "Hotel Santika Premiere Batam",
    type: "hotel",
    location: "Batam, Kepulauan Riau",
    description: "Experience luxury at Hotel Santika Premiere Batam, strategically located in the heart of the city. Our hotel offers modern amenities, exquisite dining options, and spacious rooms with breathtaking views.",
    rooms: 45,
    amenities: ["wifi", "breakfast", "pool", "restaurant", "ac"],
    price: "850000",
    status: "active",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleAmenity = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/partner/dashboard/listings" 
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Listing</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">ID: {id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Property Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Property Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white cursor-pointer"
                >
                  {PROPERTY_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Total Rooms</label>
                <input
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Property Photos</h2>
            <PhotoGalleryManager />
          </div>

          {/* Amenities */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Amenities & Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map((a) => (
                <label 
                  key={a.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.amenities.includes(a.id)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.amenities.includes(a.id)}
                    onChange={() => toggleAmenity(a.id)}
                  />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    formData.amenities.includes(a.id) ? "bg-primary border-primary text-white" : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  }`}>
                    {formData.amenities.includes(a.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm font-medium">{a.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Listing Status</h2>
            
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="active"
                  checked={formData.status === "active"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="block text-sm font-bold text-emerald-900 dark:text-emerald-400">Active</span>
                  <span className="block text-xs text-emerald-700 dark:text-emerald-500/80">Visible to guests</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="draft"
                  checked={formData.status === "draft"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                />
                <div>
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">Draft</span>
                  <span className="block text-xs text-gray-500 dark:text-slate-400">Hidden from search</span>
                </div>
              </label>
            </div>
          </div>

          {/* Pricing */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pricing</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Base Price (per night)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white font-semibold text-lg"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                This is the starting price. You can set dynamic pricing in the Calendar.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 text-sm text-blue-800 dark:text-blue-300">
            <p className="font-bold mb-1">Need Help?</p>
            <p className="text-blue-600 dark:text-blue-400 text-xs">Contact our partner support team for assistance with optimizing your listing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

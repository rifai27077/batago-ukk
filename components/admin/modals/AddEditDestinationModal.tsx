"use client";

import { useState, useEffect } from "react";
import { X, Globe, Save } from "lucide-react";

interface Destination {
  id?: number;
  name: string;
  country: string;
  hotels: number;
  flights: number;
  featured: boolean;
}

interface AddEditDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (destination: Destination) => void;
  destination?: Destination | null;
}

export default function AddEditDestinationModal({ isOpen, onClose, onSave, destination }: AddEditDestinationModalProps) {
  const [formData, setFormData] = useState<Destination>({
    name: "",
    country: "",
    hotels: 0,
    flights: 0,
    featured: false,
  });

  useEffect(() => {
    if (destination) {
      setFormData(destination);
    } else {
      setFormData({
        name: "",
        country: "",
        hotels: 0,
        flights: 0,
        featured: false,
      });
    }
  }, [destination, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-700/30">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            {destination ? "Edit Destination" : "Add Destination"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Destination Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Batam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Country</label>
            <input
              type="text"
              required
              placeholder="e.g. Indonesia"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Total Hotels</label>
              <input
                type="number"
                required
                min="0"
                value={formData.hotels}
                onChange={(e) => setFormData({ ...formData, hotels: parseInt(e.target.value) })}
                className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Total Flights</label>
              <input
                type="number"
                required
                min="0"
                value={formData.flights}
                onChange={(e) => setFormData({ ...formData, flights: parseInt(e.target.value) })}
                className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Featured Destination</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Show this on the homepage</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, featured: !formData.featured })}
              className={`w-12 h-6 rounded-full transition-colors relative ${formData.featured ? "bg-primary" : "bg-gray-200 dark:bg-slate-600"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.featured ? "right-1" : "left-1"}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 border border-gray-100 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {destination ? "Save Changes" : "Add Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

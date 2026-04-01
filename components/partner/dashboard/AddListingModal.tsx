"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Building2, MapPin, BedDouble, Wifi, Coffee, Utensils, Tv, Wind, CheckCircle2, ChevronRight, Camera, Car, Dumbbell, Waves, UtensilsCrossed, ConciergeBell, Sparkles, Loader2, Upload, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-slate-900 rounded-2xl">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  ),
});

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: {
    id: string;
    name: string;
    type: string;
    location: string;
    description?: string;
    rooms: number;
    amenities?: string[];
    price: string;
    image?: string;
    latitude?: number;
    longitude?: number;
  } | null;
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
  { id: "pool", label: "Swimming Pool", icon: Waves },
  { id: "parking", label: "Free Parking", icon: Car },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "tv", label: "Smart TV", icon: Tv },
  { id: "ac", label: "Air Conditioning", icon: Wind },
  { id: "gym", label: "Fitness Center", icon: Dumbbell },
  { id: "spa", label: "Spa & Wellness", icon: Sparkles },
  { id: "room_service", label: "Room Service", icon: ConciergeBell },
  { id: "bar", label: "Bar & Lounge", icon: UtensilsCrossed },
  { id: "laundry", label: "Laundry Service", icon: Sparkles },
];

// Default center for Indonesia/Batam area
const DEFAULT_CENTER = { lat: 1.0456, lng: 104.0305 };

export default function AddListingModal({ isOpen, onClose, onSave, editData }: AddListingModalProps) {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "hotel",
    location: "",
    description: "",
    rooms: 1,
    amenities: [] as string[],
    price: "",
    image: null as File | null,
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
  });

  // Populate form when editData changes
  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        name: editData.name || "",
        type: editData.type || "hotel",
        location: editData.location || "",
        description: editData.description || "",
        rooms: editData.rooms || 1,
        amenities: editData.amenities || [],
        price: editData.price || "",
        image: null,
        latitude: editData.latitude || DEFAULT_CENTER.lat,
        longitude: editData.longitude || DEFAULT_CENTER.lng,
      });
      if (editData.image && !editData.image.includes("unsplash.com")) {
        setImagePreview(editData.image);
      }
      setStep(1);
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: "",
        type: "hotel",
        location: "",
        description: "",
        rooms: 1,
        amenities: [],
        price: "",
        image: null,
        latitude: DEFAULT_CENTER.lat,
        longitude: DEFAULT_CENTER.lng,
      });
      setImagePreview(null);
      setStep(1);
    }
  }, [editData, isOpen]);

  // Load Leaflet CSS dynamically when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      // Add Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      link.id = "leaflet-css";
      if (!document.getElementById("leaflet-css")) {
        document.head.appendChild(link);
      }
      
      // Small delay to ensure CSS is loaded
      const timer = setTimeout(() => setMapReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  }, []);

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

  const isStep1Valid = formData.name && formData.location;
  const isStep2Valid = formData.description;
  const isStep3Valid = formData.price;

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
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Step {step} of 3: {step === 1 ? "Basic Information" : step === 2 ? "Property Details" : "Photos & Pricing"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400 transition-colors"
            aria-label="Close modal"
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
              {/* Property Name */}
              <div>
                <label htmlFor="property-name" className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="property-name"
                  type="text"
                  placeholder="e.g. Grand Batam Hotel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">Property Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      id={t.id}
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t.id })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                        formData.type === t.id 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-600"
                      }`}
                      aria-pressed={formData.type === t.id}
                    >
                      <t.icon className="w-6 h-6" />
                      <span className="text-xs font-bold">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Address */}
              <div>
                <label htmlFor="location-address" className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
                  Location Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="location-address"
                    type="text"
                    placeholder="e.g. Jl. Nagoya Hill, Batam"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Map Location Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
                  Pin Location on Map
                </label>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
                  Click on the map to set your property location. This helps guests find you easily.
                </p>
                <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 h-64 relative">
                  {mapReady ? (
                    <MapComponent
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                      onLocationSelect={handleLocationSelect}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-slate-900">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                  <span>Lat: {formData.latitude.toFixed(6)}</span>
                  <span>Lng: {formData.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Tell guests about your property, what makes it special, nearby attractions, etc..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white resize-none"
                />
              </div>

              {/* Amenities with Checkboxes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">
                  Amenities
                </label>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
                  Select all amenities available at your property
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AMENITIES.map((amenity) => (
                    <label
                      key={amenity.id}
                      htmlFor={`amenity-${amenity.id}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.amenities.includes(amenity.id)
                          ? "border-primary bg-primary/5"
                          : "border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`amenity-${amenity.id}`}
                        name={`amenity-${amenity.id}`}
                        checked={formData.amenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                      <amenity.icon className={`w-4 h-4 ${
                        formData.amenities.includes(amenity.id) ? "text-primary" : "text-gray-400"
                      }`} />
                      <span className={`text-xs font-medium ${
                        formData.amenities.includes(amenity.id) 
                          ? "text-primary" 
                          : "text-gray-600 dark:text-slate-400"
                      }`}>
                        {amenity.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total Rooms */}
              <div>
                <label htmlFor="total-rooms" className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
                  Total Rooms
                </label>
                <input
                  id="total-rooms"
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
              {/* Main Property Photo with Preview */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-3">
                  Main Property Photo
                </label>
                
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    <img 
                      src={imagePreview} 
                      alt="Property preview" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-medium text-white">
                          {formData.image?.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-red-500/90 hover:bg-red-600 rounded-xl text-white transition-colors"
                        title="Remove image"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label="Click to upload photo"
                    title="Click to upload photo"
                  >
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Click to upload photo</p>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Upload className="w-3 h-3" />
                      <span>or drag and drop</span>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Upload property photo"
                  title="Upload property photo"
                />
              </div>

              {/* Base Price */}
              <div>
                <label htmlFor="base-price" className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
                  Base Price (per night) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                  <input
                    id="base-price"
                    type="number"
                    placeholder="850000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Enter the base price per night in Indonesian Rupiah
                </p>
              </div>

              {/* Summary Info */}
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-primary italic">Almost there!</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                      Once you launch, our team will review your listing within 24 hours. You can still edit these details later.
                    </p>
                  </div>
                </div>
              </div>

              {/* Listing Summary */}
              <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Listing Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Property Name:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.name || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Property Type:</span>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{formData.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Location:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.location || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Total Rooms:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.rooms}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Amenities:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.amenities.length} selected</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-slate-400">Base Price:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.price ? `Rp ${Number(formData.price).toLocaleString('id-ID')}` : "-"}
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
            type="button"
            onClick={step === 1 ? onClose : handleBack}
            className="px-5 py-2.5 text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          <button 
            type="button"
            disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : !isStep3Valid}
            onClick={step === 3 ? () => onSave({
              ...formData,
              address: formData.location,
            }) : handleNext}
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

"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Star, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadListingImage } from "@/lib/api";

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface PhotoGalleryManagerProps {
  initialPhotos?: Photo[];
  onPhotosChange?: (photos: Photo[]) => void;
}

export default function PhotoGalleryManager({ initialPhotos = [], onPhotosChange }: PhotoGalleryManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string) => {
    const newPhotos = photos.filter(p => p.id !== id);
    // If we deleted the main photo, set the first remaining as main
    if (newPhotos.length > 0 && !newPhotos.some(p => p.isMain)) {
      newPhotos[0].isMain = true;
    }
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  const handleSetMain = (id: string) => {
    const newPhotos = photos.map(p => ({ ...p, isMain: p.id === id }));
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadListingImage(file);
      const newPhoto: Photo = {
        id: Math.random().toString(36).substring(7),
        url: result.url,
        isMain: photos.length === 0, // First photo is main
      };
      const newPhotos = [...photos, newPhoto];
      setPhotos(newPhotos);
      onPhotosChange?.(newPhotos);
    } catch (err) {
      console.error("Failed to upload photo:", err);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be uploaded again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          Photo Gallery {photos.length > 0 && <span className="text-gray-400 font-normal">({photos.length})</span>}
        </h3>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50"
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="w-4 h-4" /> Add Photos</>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">No photos uploaded yet</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-sm font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
          >
            Upload your first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700">
              <Image 
                src={photo.url} 
                alt="Property photo" 
                fill 
                unoptimized={photo.url.includes("localhost") || photo.url.includes("127.0.0.1") || photo.url.includes("uploads/")}
                className="object-cover transition-transform group-hover:scale-105" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(photo.id)}
                    className="p-1.5 bg-white/10 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {!photo.isMain && (
                  <button 
                    onClick={() => handleSetMain(photo.id)}
                    className="w-full py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-colors"
                  >
                    Set as Main
                  </button>
                )}
              </div>

              {/* Main Badge */}
              {photo.isMain && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-md shadow-sm z-10 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Main
                </div>
              )}
            </div>
          ))}

          {/* Upload Placeholder */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-gray-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            ) : (
              <ImageIcon className="w-8 h-8 mb-2" />
            )}
            <span className="text-xs font-bold">{isUploading ? "Uploading..." : "Upload"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

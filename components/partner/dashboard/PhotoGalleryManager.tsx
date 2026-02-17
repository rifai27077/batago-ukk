"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon, Star, Trash2 } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

interface PhotoGalleryManagerProps {
  initialPhotos?: Photo[];
  onPhotosChange?: (photos: Photo[]) => void;
}

const mockInitialPhotos: Photo[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isMain: true },
  { id: "2", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isMain: false },
  { id: "3", url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isMain: false },
];

export default function PhotoGalleryManager({ initialPhotos = mockInitialPhotos, onPhotosChange }: PhotoGalleryManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const handleDelete = (id: string) => {
    const newPhotos = photos.filter(p => p.id !== id);
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  const handleSetMain = (id: string) => {
    const newPhotos = photos.map(p => ({ ...p, isMain: p.id === id }));
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  const handleUpload = () => {
    // Mock upload
    const newPhoto: Photo = {
      id: Math.random().toString(),
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isMain: false,
    };
    const newPhotos = [...photos, newPhoto];
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Photo Gallery</h3>
        <button 
          onClick={handleUpload}
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
        >
          <Upload className="w-4 h-4" /> Add Photos
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700">
            <Image 
              src={photo.url} 
              alt="Property photo" 
              fill 
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
          onClick={handleUpload}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-gray-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
        >
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold">Upload</span>
        </button>
      </div>
    </div>
  );
}

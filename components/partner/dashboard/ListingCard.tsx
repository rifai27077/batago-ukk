"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Bed, MoreVertical, Pencil, Eye, Trash2, Check } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { StatusType } from "./StatusBadge";
import { useState, useRef, useEffect } from "react";

interface Listing {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  rooms: number;
  occupancy: number;
  status: StatusType;
  type: "hotel" | "flight";
}

interface ListingCardProps {
  listing: Listing;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function ListingCard({ listing, selectable = false, selected = false, onSelect }: ListingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 group relative ${
        selected 
          ? "border-primary ring-1 ring-primary shadow-md" 
          : "border-gray-100 dark:border-slate-700 hover:shadow-md"
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden rounded-t-2xl">
        <Image
          src={listing.image}
          alt={listing.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Selection Checkbox - Always visible if selected or selectable mode is active, otherwise on hover */}
        {(selectable || selected) && onSelect && (
          <div className="absolute top-3 left-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(listing.id);
              }}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                selected
                  ? "bg-primary border-primary text-white"
                  : "bg-white/80 border-gray-300 hover:border-primary backdrop-blur-sm"
              }`}
            >
              {selected && <Check className="w-4 h-4" />}
            </button>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <StatusBadge status={listing.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">{listing.name}</h3>
          <div ref={menuRef} className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
              {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-700 rounded-xl shadow-xl border border-gray-100 dark:border-slate-600 overflow-hidden z-20">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <div className="h-px bg-gray-100 dark:bg-slate-600 my-1"></div>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1.5 text-sm text-gray-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>

        <div className="flex items-center gap-3 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-gray-800 dark:text-slate-200">{listing.rating}</span>
            <span className="text-gray-400 dark:text-slate-500">({listing.reviewCount})</span>
          </div>
          <span className="text-gray-200 dark:text-slate-600">|</span>
          <div className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
            <Bed className="w-4 h-4" />
            <span>{listing.rooms} rooms</span>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500 dark:text-slate-400 font-medium">Occupancy</span>
            <span className={`font-bold ${listing.occupancy >= 70 ? "text-emerald-600" : listing.occupancy >= 40 ? "text-amber-600" : "text-red-500"}`}>
              {listing.occupancy}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                listing.occupancy >= 70 ? "bg-emerald-500" : listing.occupancy >= 40 ? "bg-amber-500" : "bg-red-400"
              }`}
              style={{ width: `${listing.occupancy}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/partner/dashboard/listings/${listing.id}`}
            className="flex-1 text-center bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            Manage
          </Link>
          <button className="flex-1 text-center bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 text-sm font-medium py-2 rounded-xl transition-colors">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Listing };

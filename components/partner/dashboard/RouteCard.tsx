"use client";

import { useState, useRef, useEffect } from "react";
import { Plane, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

interface Route {
  id: number;
  origin: string;
  destination: string;
  flightNumber?: string;
  flight_number?: string;
  duration: string;
  aircraft: string;
  schedule: string | string[];
  status: string;
}

interface RouteCardProps {
  route: Route;
  onDelete?: () => void;
}

export default function RouteCard({ route, onDelete }: RouteCardProps) {
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
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 hover:border-gray-200 dark:hover:border-slate-600 transition-all shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Route Info */}
        <div className="flex items-center gap-6 flex-1 w-full">
          <div className="flex items-center gap-4">
            <div className="text-center w-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{route.origin}</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Origin</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">{route.duration}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-600"></div>
                <div className="w-16 h-[2px] bg-gray-300 dark:bg-slate-600 relative flex items-center justify-center">
                  <Plane className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 absolute rotate-90" />
                </div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <p className="text-xs font-bold text-primary mt-1">Direct</p>
            </div>
            <div className="text-center w-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{route.destination}</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Dest</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-100 dark:bg-slate-700 mx-4"></div>

          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Flight Number</p>
              <p className="font-bold text-gray-800 dark:text-slate-200">{route.flight_number || route.flightNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Aircraft</p>
              <p className="font-bold text-gray-800 dark:text-slate-200">{route.aircraft}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Schedule</p>
              <div className="flex gap-1">
                {Array.isArray(route.schedule) ? route.schedule.map(d => (
                  <span key={d} className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-[10px] font-bold text-gray-600 dark:text-slate-300">{d}</span>
                )) : <span className="font-bold text-gray-800 dark:text-slate-200">{route.schedule}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 dark:border-slate-700 pt-4 md:pt-0">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
            route.status === 'active'
              ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
          }`}>
            {route.status}
          </span>
          
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => { setMenuOpen(false); onDelete?.(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

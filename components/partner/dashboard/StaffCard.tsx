"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Shield, Mail, Pencil, Trash2, Eye } from "lucide-react";

interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

interface StaffCardProps {
  staff: Staff;
}

export default function StaffCard({ staff }: StaffCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 hover:border-primary/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-gray-500">
          {staff.name.charAt(0)}
        </div>
        
        {/* Three Dots Menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" /> {/* Changed to MoreVertical to match Listings */}
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
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{staff.name}</h3>
      
      <div className="space-y-2 mt-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <Shield className="w-4 h-4 text-primary" />
          <span>{staff.role}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{staff.email}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
          staff.status === 'Active' 
            ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' 
            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
        }`}>
          {staff.status}
        </span>
        <span className="text-xs text-gray-400">Active {staff.lastActive}</span>
      </div>
    </div>
  );
}

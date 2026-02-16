"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Shield, Mail, User } from "lucide-react";
import AddStaffModal from "@/components/partner/dashboard/AddStaffModal";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";

const mockStaff = [
  { id: 1, name: "Budi Santoso", email: "budi@hotel.com", role: "General Manager", status: "Active", lastActive: "2 mins ago" },
  { id: 2, name: "Siti Aminah", email: "siti@hotel.com", role: "Receptionist", status: "Active", lastActive: "1 hour ago" },
  { id: 3, name: "Andi Wijaya", email: "andi@hotel.com", role: "Finance Officer", status: "Inactive", lastActive: "2 days ago" },
];

export default function StaffPage() {
  const { partnerType } = usePartner();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffList, setStaffList] = useState(mockStaff);

  const handleSaveStaff = (newStaff: any) => {
    const formattedStaff = {
      id: staffList.length + 1,
      ...newStaff,
      lastActive: "Just now"
    };
    setStaffList([formattedStaff, ...staffList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage access and roles for your {partnerType === 'hotel' ? 'hotel' : 'airline'} team.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Staff</span>
        </button>
      </div>

      <AddStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveStaff} 
      />

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search staff by name or email..." 
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-gray-500">
                  {staff.name.charAt(0)}
               </div>
               <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400">
                  <MoreHorizontal className="w-5 h-5" />
               </button>
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
        ))}
      </div>
    </div>
  );
}

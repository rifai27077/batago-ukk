"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Shield, Mail, User } from "lucide-react";
import AddStaffModal from "@/components/partner/dashboard/AddStaffModal";
import StaffCard from "@/components/partner/dashboard/StaffCard";
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
          <StaffCard key={staff.id} staff={staff} />
        ))}
      </div>
    </div>
  );
}

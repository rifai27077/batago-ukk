"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import AddStaffModal from "@/components/partner/dashboard/AddStaffModal";
import StaffCard from "@/components/partner/dashboard/StaffCard";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import { getPartnerStaff, addPartnerStaff, removePartnerStaff, PartnerStaff } from "@/lib/api";

export default function StaffPage() {
  const { partnerType } = usePartner();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<PartnerStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await getPartnerStaff();
      setStaffList(res.data);
    } catch (error) {
      console.error("Failed to fetch staff", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSaveStaff = async (newStaff: any) => {
    try {
      await addPartnerStaff(newStaff.email, newStaff.role);
      setIsAddModalOpen(false);
      fetchStaff();
    } catch (error: any) {
      alert(error.message || "Failed to add staff");
    }
  };

  const handleRemoveStaff = async (id: number) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await removePartnerStaff(id);
      fetchStaff();
    } catch (error) {
      alert("Failed to remove staff");
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => (
            <StaffCard 
              key={staff.ID} 
              staff={{
                id: staff.ID,
                name: staff.user.name,
                email: staff.user.email,
                role: staff.role,
                status: "Active", // Mock status for UI
                lastActive: "Recent"
              }} 
              onDelete={() => handleRemoveStaff(staff.ID)}
            />
          ))}
          {filteredStaff.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
              No staff members found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

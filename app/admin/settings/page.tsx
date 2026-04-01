"use client";

import { useState, useEffect } from "react";
import { Settings, Globe, Shield, Users, Plus, Trash2, Save } from "lucide-react";
import AddAdminModal from "@/components/admin/modals/AddAdminModal";

interface AdminAccount {
  id: number;
  name: string;
  email: string;
  role: string;
  last_active: string;
}

const roleColors: Record<string, string> = {
  super_admin: "bg-primary/10 text-primary",
  support: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  finance: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  content: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  support: "Support",
  finance: "Finance",
  content: "Content",
};

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<"platform" | "admins" | "master">("platform");
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const api = await import("@/lib/api");
      const res = await api.getAdminAccounts();
      if (res.data) setAdmins(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "admins") fetchAdmins();
  }, [tab]);

  const handleAddAdmin = async (newAdmin: any) => {
    try {
      const roleMap: Record<string, string> = {
        "Super Admin": "super_admin",
        "Support": "support",
        "Finance": "finance",
        "Content": "content"
      };
      
      const payload = {
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password || "password123", // Default password if modal doesn't provide
        role: roleMap[newAdmin.role] || "support"
      };

      const api = await import("@/lib/api");
      await api.createAdminAccount(payload);
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (confirm("Are you sure you want to delete this admin account?")) {
      try {
        const api = await import("@/lib/api");
        await api.deleteAdminAccount(id);
        setAdmins(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete admin. You cannot delete your own account.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Platform configuration and admin management</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        {[
          { key: "platform" as const, label: "Platform", icon: Globe },
          { key: "admins" as const, label: "Admin Accounts", icon: Shield },
          { key: "master" as const, label: "Master Data", icon: Settings },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              tab === t.key
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Platform Settings */}
      {tab === "platform" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-6 max-w-2xl">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Platform Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Platform Name</label>
              <input type="text" defaultValue="BataGo" className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Support Email</label>
              <input type="email" defaultValue="support@batago.com" className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Default Currency</label>
              <select className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                <option>IDR — Indonesian Rupiah</option>
                <option>USD — US Dollar</option>
                <option>SGD — Singapore Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Timezone</label>
              <select className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                <option>Asia/Jakarta (WIB, UTC+7)</option>
                <option>Asia/Singapore (SGT, UTC+8)</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Maintenance Mode</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Temporarily disable public access</p>
              </div>
              <div className="w-11 h-6 bg-gray-300 dark:bg-slate-600 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}

      {/* Admin Accounts */}
      {tab === "admins" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-slate-400">Manage admin team access</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> Add Admin
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Last Active</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-bold text-white shadow-sm overflow-hidden">
                          {admin.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-slate-200">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{admin.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[admin.role]}`}>
                        {roleLabels[admin.role]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`text-xs ${admin.last_active === "Online" ? "text-emerald-500 font-medium" : "text-gray-400 dark:text-slate-500"}`}>
                        {admin.last_active}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {admin.role !== "super_admin" && (
                        <button 
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Master Data */}
      {tab === "master" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Locations */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Locations</h3>
              <button className="text-xs text-primary hover:text-primary/80 font-medium">+ Add</button>
            </div>
            <div className="space-y-2">
              {["Batam", "Jakarta", "Bali", "Singapore", "Kuala Lumpur"].map((loc) => (
                <div key={loc} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-slate-300">{loc}</span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Hotel Amenities</h3>
              <button className="text-xs text-primary hover:text-primary/80 font-medium">+ Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Parking", "Room Service", "Laundry", "Airport Shuttle", "Beach Access"].map((amenity) => (
                <span key={amenity} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 rounded-full text-gray-600 dark:text-slate-300 group hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer">
                  {amenity}
                  <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <AddAdminModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddAdmin} 
      />
    </div>
  );
}

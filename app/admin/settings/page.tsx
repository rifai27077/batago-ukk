"use client";

import { useState, useEffect } from "react";
import { Settings, Globe, Shield, Users, Plus, Trash2, Save, Pencil } from "lucide-react";
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
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(false);

  // Platform Config
  const [platformConfig, setPlatformConfig] = useState<Record<string, string>>({
    platform_name: "BataGo",
    support_email: "support@batago.com",
    default_currency: "IDR — Indonesian Rupiah",
    timezone: "Asia/Jakarta (WIB, UTC+7)",
    maintenance_mode: "false"
  });
  const [isSavingPlatform, setIsSavingPlatform] = useState(false);

  // Master Data
  const [facilities, setFacilities] = useState<{id: number, name: string}[]>([]);
  const [destinations, setDestinations] = useState<{id: number, name: string}[]>([]);
  const [newFacility, setNewFacility] = useState("");

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

  const fetchPlatformData = async () => {
    try {
      const api = await import("@/lib/api");
      const res = await api.getPlatformSettings();
      if (res.data && Object.keys(res.data).length > 0) {
        setPlatformConfig(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMasterData = async () => {
    try {
      const api = await import("@/lib/api");
      const [facRes, destRes] = await Promise.all([
        api.getAdminFacilities(),
        api.getAdminDestinations() // uses existing Destinations API
      ]);
      if (facRes.data) setFacilities(facRes.data);
      if (destRes.data) setDestinations(destRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (tab === "admins") fetchAdmins();
    if (tab === "platform") fetchPlatformData();
    if (tab === "master") fetchMasterData();
  }, [tab]);

  const handlePlatformChange = (key: string, value: string) => {
    setPlatformConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePlatform = async () => {
    try {
      setIsSavingPlatform(true);
      const api = await import("@/lib/api");
      await api.updatePlatformSettings(platformConfig);
      alert("Platform settings saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save platform settings");
    } finally {
      setIsSavingPlatform(false);
    }
  };

  const handleAddLocation = async () => {
    const loc = prompt("Enter new location name:");
    if (!loc) return;
    try {
      const api = await import("@/lib/api");
      const res = await api.createAdminDestination({ name: loc, country: "Indonesia", featured: false, image_url: "" });
      setDestinations(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      const api = await import("@/lib/api");
      await api.deleteAdminDestination(id);
      setDestinations(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFacility = async () => {
    const fac = prompt("Enter new amenity name:");
    if (!fac) return;
    try {
      const api = await import("@/lib/api");
      const res = await api.createAdminFacility({ name: fac, icon: "Check" });
      setFacilities(prev => [...prev, res.data]);
      setNewFacility("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFacility = async (id: number) => {
    try {
      const api = await import("@/lib/api");
      await api.deleteAdminFacility(id);
      setFacilities(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  const handleSaveAdmin = async (data: any) => {
    try {
      const roleMap: Record<string, string> = {
        "Super Admin": "super_admin",
        "Support": "support",
        "Finance": "finance",
        "Content": "content"
      };
      
      const payload = {
        name: data.name,
        email: data.email,
        role: roleMap[data.role] || "support"
      };

      const api = await import("@/lib/api");
      if (data.id && typeof data.id === 'number' && data.id < 1000000000000) {
        if (data.password) (payload as any).password = data.password;
        await api.updateAdminAccount(data.id, payload as any);
      } else {
        (payload as any).password = data.password || "password123";
        await api.createAdminAccount(payload as any);
      }
      fetchAdmins();
    } catch (err: any) {
      console.error(err);
      const msg = err?.error || "Failed to save admin account";
      alert(msg);
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
              <input type="text" value={platformConfig.platform_name} onChange={(e) => handlePlatformChange('platform_name', e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Support Email</label>
              <input type="email" value={platformConfig.support_email} onChange={(e) => handlePlatformChange('support_email', e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Default Currency</label>
              <select value={platformConfig.default_currency} onChange={(e) => handlePlatformChange('default_currency', e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                <option>IDR — Indonesian Rupiah</option>
                <option>USD — US Dollar</option>
                <option>SGD — Singapore Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Timezone</label>
              <select value={platformConfig.timezone} onChange={(e) => handlePlatformChange('timezone', e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                <option>Asia/Jakarta (WIB, UTC+7)</option>
                <option>Asia/Singapore (SGT, UTC+8)</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Maintenance Mode</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Temporarily disable public access</p>
              </div>
              <div 
                onClick={() => handlePlatformChange('maintenance_mode', platformConfig.maintenance_mode === 'true' ? 'false' : 'true')}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${platformConfig.maintenance_mode === 'true' ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${platformConfig.maintenance_mode === 'true' ? 'translate-x-5.5 left-0' : 'left-0.5'}`} />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSavePlatform}
            disabled={isSavingPlatform}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-70"
          >
            <Save className="w-4 h-4" /> {isSavingPlatform ? "Saving..." : "Save Changes"}
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
                    <td className="px-5 py-3.5 text-right flex items-center justify-end gap-1">
                      <button 
                        onClick={() => {
                          setEditingAdmin(admin);
                          setIsAddModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
              <button onClick={handleAddLocation} className="text-xs text-primary hover:text-primary/80 font-medium">+ Add</button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {destinations.map((loc) => (
                <div key={loc.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-slate-300">{loc.name}</span>
                  <button onClick={() => handleDeleteLocation(loc.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              {destinations.length === 0 && <p className="text-sm text-gray-500">No locations added yet.</p>}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Hotel Amenities</h3>
              <button onClick={handleAddFacility} className="text-xs text-primary hover:text-primary/80 font-medium">+ Add</button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto content-start">
              {facilities.map((amenity) => (
                <span key={amenity.id} onClick={() => handleDeleteFacility(amenity.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 rounded-full text-gray-600 dark:text-slate-300 group hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer">
                  {amenity.name}
                  <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              ))}
              {facilities.length === 0 && <p className="text-sm text-gray-500 w-full">No amenities added yet.</p>}
            </div>
          </div>
        </div>
      )}

      <AddAdminModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAdmin(null);
        }} 
        onSave={handleSaveAdmin} 
        editData={editingAdmin}
      />
    </div>
  );
}

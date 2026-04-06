"use client";

import { useState, useEffect } from "react";
import { Shield, Plus, Trash2, Pencil } from "lucide-react";
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

export default function AdminTeamPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
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
    fetchAdmins();
  }, []);

  const handleSaveAdmin = async (data: any) => {
    try {
      const roleMap: Record<string, string> = {
        "Super Admin": "super_admin",
        "Support": "support",
        "Finance": "finance",
        "Content": "content",
      };
      
      const payload = {
        name: data.name,
        email: data.email,
        role: roleMap[data.role] || "support",
      };

      const api = await import("@/lib/api");
      
      if (data.id && typeof data.id === 'number' && data.id < 1000000000000) { 
        // Update existing
        if (data.password) (payload as any).password = data.password;
        await api.updateAdminAccount(data.id, payload as any);
      } else {
        // Create new
        (payload as any).password = data.password || "password123";
        await api.createAdminAccount(payload as any);
      }
      
      fetchAdmins();
    } catch (err: any) {
      console.error(err);
      const msg = err.error || "Failed to save admin account";
      alert(msg);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (confirm("Are you sure you want to delete this admin account?")) {
      try {
        const api = await import("@/lib/api");
        await api.deleteAdminAccount(id);
        setAdmins((prev) => prev.filter((a) => a.id !== id));
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Team</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage admin team accounts and access levels</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-slate-400">Total {admins.length} administrators</p>
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

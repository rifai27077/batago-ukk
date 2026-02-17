"use client";

import { useState } from "react";
import { X, User, Mail, Shield, CheckCircle2 } from "lucide-react";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function AddAdminModal({ isOpen, onClose, onSave }: AddAdminModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Support",
  });

  if (!isOpen) return null;

  const roles = [
    { id: "super_admin", label: "Super Admin", desc: "Full access to all settings" },
    { id: "support", label: "Support", desc: "Manage users and bookings" },
    { id: "finance", label: "Finance", desc: "Manage payouts and refunds" },
    { id: "content", label: "Content", desc: "Manage banners and articles" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: Date.now(), status: "active", lastActive: "Just now" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Admin</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. Admin Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Email Address</label>
             <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="e.g. admin@batago.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Assign Role</label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.label })}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    formData.role === role.label
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${formData.role === role.label ? "bg-primary text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-400"}`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block">{role.label}</span>
                    <span className="text-[10px] opacity-80 block">{role.desc}</span>
                  </div>
                  {formData.role === role.label && <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={!formData.name || !formData.email || !formData.role}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  );
}

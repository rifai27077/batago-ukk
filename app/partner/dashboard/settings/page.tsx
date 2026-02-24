"use client";

import { useState, useEffect } from "react";
import { User, Building, CreditCard, Bell, Shield, Globe, Camera, Save, Eye, EyeOff, Plane, Loader2 } from "lucide-react";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";
import { getProfile, updateProfile } from "@/lib/api";

export default function SettingsPage() {
  const { partnerType } = usePartner();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar_url: "",
    company_name: "",
    company_type: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.user) {
          setForm({
            name: res.user.name,
            email: res.user.email,
            phone: res.user.phone || "",
            role: res.user.role,
            avatar_url: res.user.avatar_url || "",
            company_name: res.user.partner_company_name || "",
            company_type: res.user.partner_type || "",
            address: res.user.partner_address || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        company_name: form.company_name,
        company_type: form.company_type,
        address: form.address,
      });
      alert("Settings updated successfully");
    } catch (error) {
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "property", label: partnerType === "hotel" ? "Property" : "Airline Info", icon: partnerType === "hotel" ? Building : Plane },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your account and {partnerType === "hotel" ? "property" : "airline"} settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-2 h-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 dark:bg-primary/20 text-primary"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 space-y-5">
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                  ) : (
                    <div className="w-20 h-20 bg-linear-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                      {form.name.charAt(0)}
                    </div>
                  )}
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600">
                    <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{form.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 uppercase">{form.role} · {form.company_name || "BataGo Partner"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Role</label>
                  <input
                    type="text"
                    value={form.role}
                    disabled
                    className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "property" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                 {partnerType === "hotel" ? "Property Details" : "Airline Information"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    {partnerType === "hotel" ? "Property Name" : "Airline Name"}
                  </label>
                  <input
                    type="text"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Type</label>
                    <select
                      value={form.company_type}
                      onChange={(e) => setForm({ ...form, company_type: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                    >
                      <option value="hotel">Hotel</option>
                      <option value="airline">Airline</option>
                      <option value="travel_agent">Travel Agent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Address / Headquarters</label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all resize-none text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Payment Methods</h3>
               <p className="text-sm text-gray-500 mb-6">Manage your payout methods</p>
               <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-center text-sm text-gray-500">
                  Payout integration coming soon.
               </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Notification Preferences</h3>
              <p className="text-sm text-gray-500 mb-6">Currently managed via system defaults.</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Security Settings</h3>
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm rounded-xl">
                Password updates are currently handled via our authentication portal.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

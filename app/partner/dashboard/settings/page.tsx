"use client";

import { useState } from "react";
import { User, Building, CreditCard, Bell, Shield, Globe, Camera, Save, Eye, EyeOff } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "property", label: "Property", icon: Building },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
] as const;

type TabId = typeof tabs[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [showPassword, setShowPassword] = useState(false);

  // Mock form states
  const [profile, setProfile] = useState({
    name: "Ahmad Rifai",
    email: "ahmad@hotelsantika.com",
    phone: "+62 812 3456 7890",
    role: "Owner",
  });

  const [property, setProperty] = useState({
    name: "Hotel Santika Batam",
    type: "Hotel",
    address: "Jl. Engku Putri No. 18, Batam Center, Batam",
    city: "Batam",
    description: "Hotel bintang 4 dengan fasilitas lengkap di pusat kota Batam. Menawarkan kamar nyaman, kolam renang, spa, dan restoran dengan pemandangan laut.",
    checkIn: "14:00",
    checkOut: "12:00",
    website: "https://hotelsantika.com",
  });

  const [notifications, setNotifications] = useState({
    newBooking: true,
    bookingCancel: true,
    newReview: true,
    payout: true,
    promo: false,
    newsletter: false,
    sms: false,
    whatsapp: true,
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your account and property settings</p>
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
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                    AR
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600">
                    <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{profile.role} · Bakso</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Role</label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white"
                  >
                    <option>Owner</option>
                    <option>Manager</option>
                    <option>Admin</option>
                    <option>Staff</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "property" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Property Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Property Name</label>
                  <input type="text" value={property.name} onChange={(e) => setProperty({ ...property, name: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Property Type</label>
                  <select value={property.type} onChange={(e) => setProperty({ ...property, type: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white">
                    <option>Hotel</option>
                    <option>Villa</option>
                    <option>Resort</option>
                    <option>Homestay</option>
                    <option>Guesthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">City</label>
                  <input type="text" value={property.city} onChange={(e) => setProperty({ ...property, city: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Address</label>
                  <input type="text" value={property.address} onChange={(e) => setProperty({ ...property, address: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Description</label>
                  <textarea value={property.description} onChange={(e) => setProperty({ ...property, description: e.target.value })} rows={3} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 resize-none text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Check-in Time</label>
                  <input type="time" value={property.checkIn} onChange={(e) => setProperty({ ...property, checkIn: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Check-out Time</label>
                  <input type="time" value={property.checkOut} onChange={(e) => setProperty({ ...property, checkOut: e.target.value })} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Website</label>
                  <div className="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10">
                    <span className="px-3 text-sm text-gray-400 dark:text-slate-500"><Globe className="w-4 h-4" /></span>
                    <input type="url" value={property.website} onChange={(e) => setProperty({ ...property, website: e.target.value })} className="flex-1 bg-transparent py-2.5 pr-4 text-sm outline-none text-gray-900 dark:text-white" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Bank Account</h3>
                <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 mb-5 border border-blue-100 dark:border-blue-500/20">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">BCA</div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">Bank Central Asia</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">****7890 · Ahmad Rifai</p>
                  </div>
                  <button className="ml-auto text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">Change</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Payout Schedule</label>
                    <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white">
                      <option>Weekly (Every Monday)</option>
                      <option>Bi-weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Minimum Payout</label>
                    <input type="text" defaultValue="Rp 500.000" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tax Information</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">Required for tax reporting purposes</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Tax ID / NPWP</label>
                    <input type="text" defaultValue="12.345.678.9-012.000" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Business Entity</label>
                    <select className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white">
                      <option>PT (Perseroan Terbatas)</option>
                      <option>CV</option>
                      <option>Individual</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Notification Preferences</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: "newBooking" as const, label: "New Booking", desc: "Get notified when you receive a new booking" },
                      { key: "bookingCancel" as const, label: "Booking Cancellation", desc: "Get notified when a guest cancels" },
                      { key: "newReview" as const, label: "New Review", desc: "Get notified when a guest leaves a review" },
                      { key: "payout" as const, label: "Payout Processed", desc: "Get notified when your payout is sent" },
                      { key: "promo" as const, label: "Promotions & Deals", desc: "Platform promotions and special offers" },
                      { key: "newsletter" as const, label: "Newsletter", desc: "Tips and insights for partners" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{item.desc}</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6 bg-gray-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-5">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-3">Other Channels</h4>
                  <div className="space-y-3">
                    {[
                      { key: "sms" as const, label: "SMS Notifications", desc: "Receive notifications via SMS" },
                      { key: "whatsapp" as const, label: "WhatsApp", desc: "Receive notifications via WhatsApp" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{item.desc}</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-6 bg-gray-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Current Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 text-gray-900 dark:text-white" />
                  </div>
                  <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                    <Save className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Add an extra layer of security to your account</p>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">Authenticator App</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Not configured</p>
                    </div>
                  </div>
                  <button className="text-sm text-primary font-semibold hover:underline">Enable</button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-900/20 p-6">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-500 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Irreversible actions for your account</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Delete Account</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Permanently delete your partner account and all data</p>
                  </div>
                  <button className="text-sm text-red-500 font-semibold border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-xl transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

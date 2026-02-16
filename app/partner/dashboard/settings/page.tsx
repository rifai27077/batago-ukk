"use client";

import { useState } from "react";
import { User, Building, CreditCard, Bell, Shield, Globe, Camera, Save, Eye, EyeOff, Plane } from "lucide-react";
import { usePartner } from "@/components/partner/dashboard/PartnerContext";

export default function SettingsPage() {
  const { partnerType } = usePartner();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  // Mock form states
  const [profile, setProfile] = useState({
    name: "Ahmad Rifai",
    email: "ahmad@batago.com",
    phone: "+62 812 3456 7890",
    role: partnerType === "hotel" ? "Owner" : "Station Manager",
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

  const [airline, setAirline] = useState({
    name: "Batik Air",
    iataCode: "ID",
    baseAirport: "Soekarno-Hatta (CGK)",
    headquarters: "Jakarta, Indonesia",
    description: "Full service airline serving domestic and international routes with premium service.",
    website: "https://batikair.com",
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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "property", label: partnerType === "hotel" ? "Property" : "Airline Info", icon: partnerType === "hotel" ? Building : Plane },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

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
                  <div className="w-20 h-20 bg-linear-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20">
                    AR
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600">
                    <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{profile.role} · {partnerType === "hotel" ? property.name : airline.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                  <Save className="w-4 h-4" /> Save Changes
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
                {partnerType === "hotel" ? (
                   // Hotel Form
                   <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Property Name</label>
                        <input
                          type="text"
                          value={property.name}
                          onChange={(e) => setProperty({ ...property, name: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Property Type</label>
                          <select
                            value={property.type}
                            onChange={(e) => setProperty({ ...property, type: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                          >
                            <option>Hotel</option>
                            <option>Villa</option>
                            <option>Resort</option>
                            <option>Apartment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">City</label>
                          <input
                            type="text"
                            value={property.city}
                            onChange={(e) => setProperty({ ...property, city: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Address</label>
                        <textarea
                          rows={3}
                          value={property.address}
                          onChange={(e) => setProperty({ ...property, address: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all resize-none text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Check-in Time</label>
                            <input
                              type="time"
                              value={property.checkIn}
                              onChange={(e) => setProperty({ ...property, checkIn: e.target.value })}
                              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Check-out Time</label>
                            <input
                              type="time"
                              value={property.checkOut}
                              onChange={(e) => setProperty({ ...property, checkOut: e.target.value })}
                              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                            />
                         </div>
                      </div>
                   </>
                ) : (
                   // Airline Form
                   <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Airline Name</label>
                        <input
                          type="text"
                          value={airline.name}
                          onChange={(e) => setAirline({ ...airline, name: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">IATA Code</label>
                          <input
                            type="text"
                            value={airline.iataCode}
                            onChange={(e) => setAirline({ ...airline, iataCode: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Base Airport</label>
                          <input
                            type="text"
                            value={airline.baseAirport}
                            onChange={(e) => setAirline({ ...airline, baseAirport: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Headquarters</label>
                        <input
                          type="text"
                          value={airline.headquarters}
                          onChange={(e) => setAirline({ ...airline, headquarters: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                        />
                      </div>
                   </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    value={partnerType === "hotel" ? property.description : airline.description}
                    onChange={(e) => partnerType === "hotel" ? setProperty({ ...property, description: e.target.value }) : setAirline({...airline, description: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all resize-none text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Website</label>
                  <div className="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="url"
                      value={partnerType === "hotel" ? property.website : airline.website}
                      onChange={(e) => partnerType === "hotel" ? setProperty({ ...property, website: e.target.value }) : setAirline({...airline, website: e.target.value})}
                      className="w-full bg-transparent py-2.5 text-sm outline-none text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Payment Methods</h3>
               <p className="text-sm text-gray-500 mb-6">Manage your payout methods</p>
               {/* Placeholder content */}
               <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-center text-sm text-gray-500">
                  Payment configuration would go here.
               </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-600 dark:text-slate-300">New bookings</span>
                      <div className={`w-11 h-6 rounded-full p-1 transition-colors ${notifications.newBooking ? "bg-primary" : "bg-gray-200 dark:bg-slate-600"}`} onClick={() => setNotifications({...notifications, newBooking: !notifications.newBooking})}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${notifications.newBooking ? "translate-x-5" : ""}`} />
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-600 dark:text-slate-300">Booking cancellations</span>
                      <div className={`w-11 h-6 rounded-full p-1 transition-colors ${notifications.bookingCancel ? "bg-primary" : "bg-gray-200 dark:bg-slate-600"}`} onClick={() => setNotifications({...notifications, bookingCancel: !notifications.bookingCancel})}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${notifications.bookingCancel ? "translate-x-5" : ""}`} />
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-600 dark:text-slate-300">New guest reviews</span>
                      <div className={`w-11 h-6 rounded-full p-1 transition-colors ${notifications.newReview ? "bg-primary" : "bg-gray-200 dark:bg-slate-600"}`} onClick={() => setNotifications({...notifications, newReview: !notifications.newReview})}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${notifications.newReview ? "translate-x-5" : ""}`} />
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-600 dark:text-slate-300">Weekly payout report</span>
                      <div className={`w-11 h-6 rounded-full p-1 transition-colors ${notifications.payout ? "bg-primary" : "bg-gray-200 dark:bg-slate-600"}`} onClick={() => setNotifications({...notifications, payout: !notifications.payout})}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${notifications.payout ? "translate-x-5" : ""}`} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Security Settings</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                    Update Password
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

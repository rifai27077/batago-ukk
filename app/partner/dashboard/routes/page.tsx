"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Map, Calendar, ArrowRight, Clock, MoreVertical, Plane } from "lucide-react";
import AddRouteModal from "@/components/partner/dashboard/AddRouteModal";
import RouteCard from "@/components/partner/dashboard/RouteCard";

const mockRoutes = [
  { id: 1, origin: "CGK", destination: "DPS", flightNumber: "GA-402", duration: "1h 50m", aircraft: "Boeing 737-800", schedule: ["Mon", "Wed", "Fri", "Sun"], status: "active" },
  { id: 2, origin: "CGK", destination: "SIN", flightNumber: "GA-824", duration: "1h 45m", aircraft: "Airbus A330", schedule: ["Tue", "Thu", "Sat"], status: "active" },
  { id: 3, origin: "SUB", destination: "KUL", flightNumber: "QZ-321", duration: "2h 30m", aircraft: "Airbus A320", schedule: ["Daily"], status: "paused" },
  { id: 4, origin: "DPS", destination: "SYD", flightNumber: "GA-710", duration: "6h 15m", aircraft: "Boeing 777-300", schedule: ["Mon", "Sat"], status: "active" },
];

export default function RoutesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [routes, setRoutes] = useState(mockRoutes);

  // Handle saving new route from modal
  const handleSaveRoute = (newRoute: any) => {
    const formattedRoute = {
      id: routes.length + 1,
      origin: newRoute.origin,
      destination: newRoute.destination,
      flightNumber: newRoute.flightNumber,
      duration: newRoute.duration,
      aircraft: newRoute.aircraft || "Assigned by Ops",
      schedule: newRoute.schedule,
      status: "active",
    };
    setRoutes([formattedRoute, ...routes]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flight Routes</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your active flight paths and schedules</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Route</span>
        </button>
      </div>

      <AddRouteModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveRoute} 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Active Routes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{routes.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Daily Flights</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">142</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
              <ArrowRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">On-Time Performance</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">98.2%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by origin, destination, or flight code..." 
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer">
            <option>All Regions</option>
            <option>Domestic</option>
            <option>International</option>
          </select>
        </div>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 gap-4">
        {routes.map((route) => (
           <RouteCard key={route.id} route={route} />
        ))}

        {routes.length === 0 && (
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Map className="w-10 h-10 text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Routes Found</h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-sm mt-2">
              You haven't added any flight routes yet. Start by adding your first origin and destination pair.
            </p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 text-primary font-bold text-sm hover:underline"
            >
              Create First Route
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

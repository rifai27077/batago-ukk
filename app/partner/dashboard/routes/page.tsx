"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Map, Calendar, ArrowRight, Loader2 } from "lucide-react";
import AddRouteModal from "@/components/partner/dashboard/AddRouteModal";
import RouteCard from "@/components/partner/dashboard/RouteCard";
import { getPartnerRoutes, createPartnerRoute, updatePartnerRoute, deletePartnerRoute, PartnerRoute } from "@/lib/api";

export default function RoutesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [routes, setRoutes] = useState<PartnerRoute[]>([]);
  const [stats, setStats] = useState({ active_routes: 0, daily_flights: 0, on_time_performance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [editingRoute, setEditingRoute] = useState<PartnerRoute | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPartnerRoutes(search || undefined, region || undefined);
      setRoutes(res.data || []);
      setStats(res.stats || { active_routes: 0, daily_flights: 0, on_time_performance: 0 });
    } catch (err: any) {
      setError(err.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  }, [search, region]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  const handleSaveRoute = async (newRoute: any) => {
    try {
      await createPartnerRoute({
        origin: newRoute.origin,
        destination: newRoute.destination,
        flight_number: newRoute.flightNumber,
        duration: newRoute.duration,
        aircraft: newRoute.aircraft,
        base_price: Number(newRoute.basePrice) || 0,
        classes: newRoute.classes ? newRoute.classes.filter((c:any) => c.active).map((c:any) => ({ class: c.class, price: Number(c.price), capacity: Number(c.capacity) })) : undefined,
        schedule: newRoute.schedule || [],
      });
      setIsAddModalOpen(false);
      fetchRoutes();
    } catch (err: any) {
      alert(err.message || "Failed to create route");
    }
  };

  const handleUpdateRoute = async (data: any) => {
    if (!editingRoute) return;
    try {
      await updatePartnerRoute((editingRoute as any).ID || editingRoute.id, {
        origin: data.origin,
        destination: data.destination,
        flight_number: data.flightNumber,
        duration: data.duration,
        aircraft: data.aircraft,
        base_price: Number(data.basePrice) || 0,
        classes: data.classes ? data.classes.filter((c:any) => c.active).map((c:any) => ({ class: c.class, price: Number(c.price), capacity: Number(c.capacity) })) : undefined,
        schedule: data.schedule || [],
      });
      setEditingRoute(null);
      fetchRoutes();
    } catch (err: any) {
      alert(err.message || "Failed to update route");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await deletePartnerRoute(id);
      fetchRoutes();
    } catch (err: any) {
      alert(err.message || "Failed to delete route");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <span className="ml-3 text-gray-500 dark:text-slate-400">Loading routes...</span>
      </div>
    );
  }

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

      {editingRoute && (
        <AddRouteModal 
          isOpen={true} 
          onClose={() => { setEditingRoute(null); setIsViewMode(false); }} 
          onSave={handleUpdateRoute}
          initialData={editingRoute}
          isViewOnly={isViewMode}
        />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Active Routes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active_routes}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.daily_flights}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.on_time_performance}%</h3>
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
            placeholder="Search by flight code..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
          >
            <option value="">All Regions</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 gap-4">
        {routes.map((route) => (
           <RouteCard 
             key={route.id} 
             route={route} 
             onView={() => { setEditingRoute(route); setIsViewMode(true); }}
             onEdit={() => { setEditingRoute(route); setIsViewMode(false); }}
             onDelete={() => handleDelete(route.id)} 
           />
        ))}

        {routes.length === 0 && (
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Map className="w-10 h-10 text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Routes Found</h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-sm mt-2">
              You haven&apos;t added any flight routes yet. Start by adding your first origin and destination pair.
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

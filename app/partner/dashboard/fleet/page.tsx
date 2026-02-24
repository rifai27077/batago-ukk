"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Plane, Wrench, BarChart, Users, Calendar, Trash2, Loader2 } from "lucide-react";
import AddAircraftModal from "@/components/partner/dashboard/AddAircraftModal";
import { getPartnerFleet, createAircraft, deleteAircraft, PartnerAircraft } from "@/lib/api";

export default function FleetPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fleet, setFleet] = useState<PartnerAircraft[]>([]);
  const [stats, setStats] = useState({ total: 0, maintenance: 0, utilization: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFleet = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPartnerFleet();
      setFleet(res.data || []);
      setStats(res.stats || { total: 0, maintenance: 0, utilization: 0 });
    } catch (err: any) {
      setError(err.message || "Failed to load fleet data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFleet(); }, [fetchFleet]);

  const handleSaveAircraft = async (newAircraft: any) => {
    try {
      await createAircraft({
        registration: newAircraft.registration,
        model: newAircraft.model,
        capacity: Number(newAircraft.capacity),
        yom: newAircraft.yom || "",
        status: newAircraft.status || "active",
      });
      setIsAddModalOpen(false);
      fetchFleet();
    } catch (err: any) {
      alert(err.message || "Failed to add aircraft");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this aircraft?")) return;
    try {
      await deleteAircraft(id);
      fetchFleet();
    } catch (err: any) {
      alert(err.message || "Failed to delete aircraft");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <span className="ml-3 text-gray-500 dark:text-slate-400">Loading fleet data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fleet Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Track your aircraft status and maintenance</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add Aircraft</span>
        </button>
      </div>

      <AddAircraftModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveAircraft} 
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>
      )}

       {/* Stats Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Total Aircraft</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Maintenance</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.maintenance}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
              <BarChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Utilization</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.utilization}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet List Grid */}
      {fleet.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
          <Plane className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-slate-400">No aircraft in fleet</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Add your first aircraft to get started</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {fleet.map((plane) => (
            <div key={plane.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 hover:border-sky-500/30 transition-all group relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-gray-50 to-transparent dark:from-slate-700 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 ${plane.status === 'maintenance' ? 'from-orange-50 dark:from-orange-900/10' : ''}`}></div>
               
               <div className="flex justify-between items-start relative z-10">
                  <div>
                     <span className="text-xs font-bold text-gray-400 dark:text-slate-500 tracking-wider">REGISTRATION</span>
                     <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{plane.registration}</h3>
                     <p className="text-sky-600 dark:text-sky-400 font-medium mt-1">{plane.model}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${plane.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'}`}>
                     {plane.status}
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-6 relative z-10">
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3">
                     <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-slate-400">Capacity</span>
                     </div>
                     <p className="font-bold text-gray-800 dark:text-slate-200">{plane.capacity}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-slate-400">YOM</span>
                     </div>
                     <p className="font-bold text-gray-800 dark:text-slate-200">{plane.yom || "—"}</p>
                  </div>
                   <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-slate-400">Next Check</span>
                     </div>
                     <p className="font-bold text-gray-800 dark:text-slate-200 text-xs mt-0.5">{plane.next_maintenance ? new Date(plane.next_maintenance).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
                  </div>
               </div>

               <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-2">
                  <button 
                    onClick={() => handleDelete(plane.id)}
                    className="text-sm font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                     <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 px-3 py-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors">
                     Manage
                  </button>
               </div>
            </div>
         ))}
      </div>
      )}
    </div>
  );
}

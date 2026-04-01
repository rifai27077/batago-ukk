"use client";

import { useState, useEffect } from "react";
import { MapPin, Image, FileText, Plus, Pencil, Trash2, Globe, Eye } from "lucide-react";
import AddEditDestinationModal from "@/components/admin/modals/AddEditDestinationModal";
import AddEditBannerModal from "@/components/admin/modals/AddEditBannerModal";
import AddEditArticleModal from "@/components/admin/modals/AddEditArticleModal";

interface Destination {
  id: number;
  name: string;
  country: string;
  hotels: number;
  flights: number;
  featured: boolean;
}

interface Banner {
  id: number;
  title: string;
  placement: string;
  status: "active" | "draft" | "expired";
  startDate: string;
  endDate: string;
}

interface Article {
  id: number;
  title: string;
  author: string;
  status: "published" | "draft";
  date: string;
  views: number;
}

const mockDestinations: Destination[] = [
  { id: 1, name: "Batam", country: "Indonesia", hotels: 45, flights: 12, featured: true },
  { id: 2, name: "Singapore", country: "Singapore", hotels: 120, flights: 8, featured: true },
  { id: 3, name: "Bali", country: "Indonesia", hotels: 200, flights: 15, featured: true },
  { id: 4, name: "Jakarta", country: "Indonesia", hotels: 180, flights: 20, featured: false },
  { id: 5, name: "Kuala Lumpur", country: "Malaysia", hotels: 95, flights: 6, featured: false },
];

const mockBanners: Banner[] = [
  { id: 1, title: "Chinese New Year Sale", placement: "Homepage Hero", status: "active", startDate: "25 Jan 2026", endDate: "10 Feb 2026" },
  { id: 2, title: "Valentine's Getaway", placement: "Search Page", status: "active", startDate: "1 Feb 2026", endDate: "15 Feb 2026" },
  { id: 3, title: "Summer Flash Sale", placement: "Homepage Hero", status: "draft", startDate: "1 Jun 2026", endDate: "30 Jun 2026" },
];

const mockArticles: Article[] = [
  { id: 1, title: "10 Best Beaches in Batam", author: "Tim Editorial", status: "published", date: "10 Feb 2026", views: 2340 },
  { id: 2, title: "Guide: First Time in Singapore", author: "Tim Editorial", status: "published", date: "5 Feb 2026", views: 5120 },
  { id: 3, title: "Budget Travel Tips 2026", author: "Admin", status: "draft", date: "17 Feb 2026", views: 0 },
];

const bannerStatusColors: Record<string, string> = {
  active: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  draft: "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400",
  expired: "bg-red-50 dark:bg-red-500/10 text-red-500",
};

const articleStatusColors: Record<string, string> = {
  published: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  draft: "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400",
};

export default function AdminContentPage() {

  const [tab, setTab] = useState<"destinations" | "banners" | "articles">("destinations");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Modal State
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "destinations") {
        const res = await import("@/lib/api").then(m => m.getAdminDestinations());
        if (res.data) setDestinations(res.data as unknown as Destination[]);
      } else if (tab === "banners") {
        const res = await import("@/lib/api").then(m => m.getAdminBanners());
        if (res.data) setBanners(res.data as unknown as Banner[]);
      } else {
        const res = await import("@/lib/api").then(m => m.getAdminArticles());
        if (res.data) setArticles(res.data as unknown as Article[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab]);

  const handleAdd = () => {
    if (tab === "destinations") {
      setSelectedDest(null);
      setDestModalOpen(true);
    } else if (tab === "banners") {
      setSelectedBanner(null);
      setBannerModalOpen(true);
    } else {
      setSelectedArticle(null);
      setArticleModalOpen(true);
    }
  };

  const handleEdit = (item: any) => {
    if (tab === "destinations") {
      setSelectedDest(item);
      setDestModalOpen(true);
    } else if (tab === "banners") {
      setSelectedBanner(item);
      setBannerModalOpen(true);
    } else {
      setSelectedArticle(item);
      setArticleModalOpen(true);
    }
  };

  const handleSaveDest = async (dest: any) => {
    try {
      const api = await import("@/lib/api");
      if (selectedDest) {
        await api.updateAdminDestination(selectedDest.id, dest);
      } else {
        await api.createAdminDestination(dest);
      }
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBanner = async (banner: any) => {
    try {
      const api = await import("@/lib/api");
      if (selectedBanner) {
        await api.updateAdminBanner(selectedBanner.id, banner);
      } else {
        await api.createAdminBanner(banner);
      }
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveArticle = async (article: any) => {
    try {
      const api = await import("@/lib/api");
      if (selectedArticle) {
        await api.updateAdminArticle(selectedArticle.id, article);
      } else {
        await api.createAdminArticle(article);
      }
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const api = await import("@/lib/api");
        if (type === "dest") {
          await api.deleteAdminDestination(id);
          setDestinations(prev => prev.filter(d => d.id !== id));
        } else if (type === "banner") {
          await api.deleteAdminBanner(id);
          setBanners(prev => prev.filter(b => b.id !== id));
        } else if (type === "article") {
          await api.deleteAdminArticle(id);
          setArticles(prev => prev.filter(a => a.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage destinations, banners, and articles</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add New {tab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        {[
          { key: "destinations" as const, label: "Destinations", icon: MapPin },
          { key: "banners" as const, label: "Banners", icon: Image },
          { key: "articles" as const, label: "Articles", icon: FileText },
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

      {/* Destinations */}
      {tab === "destinations" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{dest.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500">{dest.country}</p>
                  </div>
                </div>
                {dest.featured && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">Featured</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400 mb-4">
                <span>{dest.hotels} hotels</span>
                <span>{dest.flights} flights</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(dest)}
                  className="flex-1 text-center py-2 text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-100 dark:border-slate-700"
                >
                  <Pencil className="w-3.5 h-3.5 inline mr-1" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete("dest", dest.id)}
                  className="flex-1 text-center py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-100/50 dark:border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banners */}
      {tab === "banners" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Placement</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Period</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-slate-200">{b.title}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400">{b.placement}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${bannerStatusColors[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-slate-400 hidden md:table-cell">{b.startDate} — {b.endDate}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleEdit(b)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete("banner", b.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Articles */}
      {tab === "articles" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Author</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500 hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Views</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-slate-200">{a.title}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{a.author}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${articleStatusColors[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 hidden md:table-cell">{a.date}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-slate-300 font-medium">
                      <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-gray-400" />{a.views.toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleEdit(a)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete("article", a.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEditDestinationModal 
        isOpen={destModalOpen}
        onClose={() => setDestModalOpen(false)}
        onSave={handleSaveDest as any}
        destination={selectedDest as any}
      />
      <AddEditBannerModal 
        isOpen={bannerModalOpen}
        onClose={() => setBannerModalOpen(false)}
        onSave={handleSaveBanner as any}
        banner={selectedBanner as any}
      />
      <AddEditArticleModal 
        isOpen={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        onSave={handleSaveArticle as any}
        article={selectedArticle as any}
      />
    </div>
  );
}

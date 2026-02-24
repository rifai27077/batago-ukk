"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPromotions, Promotion } from "@/lib/api";
import { 
  Tag, 
  Search, 
  Calendar, 
  Percent, 
  ChevronRight, 
  Copy, 
  Check,
  Plane,
  Hotel,
  Clock,
  Zap
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchPromos();
  }, [activeCategory]);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await getPromotions({ 
        type: activeCategory === "all" ? undefined : activeCategory,
        search: search || undefined
      });
      setPromotions(res.data);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPromos();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Promo code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categories = [
    { id: "all", label: "All Offers", icon: Tag },
    { id: "flash_sale", label: "Flash Sale", icon: Zap },
    { id: "early_bird", label: "Early Bird", icon: Clock },
    { id: "seasonal", label: "Seasonal", icon: Calendar },
    { id: "last_minute", label: "Last Minute", icon: Clock },
  ];

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-[#1D1D1F]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Exceptional Deals for <span className="text-primary">Your Next Journey</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover exclusive discounts and seasonal offers curated just for you. Save more on your flights and stays with BataGo.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <input 
              type="text"
              placeholder="Search by code or destination..."
              className="w-full bg-white/10 border border-white/20 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none backdrop-blur-md transition-all placeholder:text-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap border ${
                  activeCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Promo Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[32px] p-8 border border-gray-100 animate-pulse h-64" />
            ))}
          </div>
        ) : promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <div 
                key={promo.ID}
                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-b-4 border-b-transparent hover:border-b-primary"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img 
                    src={promo.image_url || "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800"} 
                    alt={promo.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-primary font-bold flex items-center gap-2 shadow-sm">
                    <Percent className="w-4 h-4" />
                    {promo.discount}% OFF
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                    {promo.type.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                    {promo.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    {promo.description || "Limited time offer for selected destinations. Book now and save big on your next trip."}
                  </p>
                  
                  <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-gray-300 group-hover:border-primary/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Promo Code</span>
                      <span className="font-mono font-bold text-foreground uppercase tracking-widest">{promo.code}</span>
                    </div>
                    <button 
                      onClick={() => copyCode(promo.code)}
                      className="p-3 bg-white hover:bg-primary hover:text-white rounded-xl shadow-sm border border-gray-100 transition-all active:scale-90"
                    >
                      {copiedCode === promo.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      Expires {new Date(promo.end_date).toLocaleDateString()}
                    </div>
                    <Link 
                      href="/stays" 
                      className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Redeem <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No promotions found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any active promotions matching your search. Try different keywords or check back later!
            </p>
            <button 
              onClick={() => {setSearch(""); setActiveCategory("all");}}
              className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              View All Offers
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

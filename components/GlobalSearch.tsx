"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, User, Building2, CalendarCheck, MapPin, Hash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "user" | "partner" | "booking" | "location";
  href: string;
}

interface GlobalSearchProps {
  placeholder?: string;
  context?: "admin" | "partner";
}

export default function GlobalSearch({ 
  placeholder = "Search everything...", 
  context = "admin" 
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close overlay on route change
  useEffect(() => {
    setIsOpen(false);
    setQuery("");
  }, [pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length > 1) {
      setIsOpen(true);
      setIsLoading(true);
      // Simulate API search
      setTimeout(() => {
        const mockResults: SearchResult[] = [];
        
        if (context === "admin") {
          if ("ahmad".includes(val.toLowerCase())) {
            mockResults.push({ id: "u1", title: "Ahmad Rifai", subtitle: "Customer • ahmad.rifai@email.com", type: "user", href: "/admin/users/1" });
          }
          if ("santika".includes(val.toLowerCase())) {
            mockResults.push({ id: "p1", title: "Hotel Santika Batam", subtitle: "Partner • Hotel", type: "partner", href: "/admin/partners/1" });
          }
          if ("bg-240217-001".includes(val.toLowerCase())) {
            mockResults.push({ id: "b1", title: "BG-240217-001", subtitle: "Ahmad Rifai • Rp 1.7M", type: "booking", href: "/admin/bookings/BG-240217-001" });
          }
        } else {
          // Partner Context
          if ("ahmad".includes(val.toLowerCase())) {
            mockResults.push({ id: "b1", title: "BG-240217-001", subtitle: "Guest: Ahmad Rifai", type: "booking", href: "/partner/dashboard/bookings/BG-240217-001" });
          }
          if ("jakarta".includes(val.toLowerCase())) {
            mockResults.push({ id: "r1", title: "Batam → Jakarta", subtitle: "Route • Active", type: "location", href: "/partner/dashboard/routes" });
          }
        }

        setResults(mockResults);
        setIsLoading(false);
      }, 500);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "user": return <User className="w-4 h-4" />;
      case "partner": return <Building2 className="w-4 h-4" />;
      case "booking": return <Hash className="w-4 h-4" />;
      case "location": return <MapPin className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md w-full">
      <div className={`flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded-xl px-3.5 py-2 border transition-all ${isOpen ? "border-primary/50 shadow-lg shadow-primary/5 ring-4 ring-primary/5" : "border-gray-100 dark:border-slate-600"}`}>
        <Search className={`w-4 h-4 ${query ? "text-primary" : "text-gray-400 dark:text-slate-500"}`} />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          placeholder={placeholder}
          className="bg-transparent text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none w-full"
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="p-0.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
                <p className="text-xs">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Quick Results</span>
                </div>
                {results.map((res) => (
                  <Link
                    key={res.id}
                    href={res.href}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      {getIcon(res.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-primary transition-colors">{res.title}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{res.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-gray-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-medium">No results found for "{query}"</p>
                <p className="text-xs mt-1">Try a different keyword</p>
              </div>
            )}
          </div>
          {results.length > 0 && (
            <div className="bg-gray-50 dark:bg-slate-700/30 px-4 py-3 border-t border-gray-100 dark:border-slate-700">
              <p className="text-[10px] text-gray-400 dark:text-slate-500 text-center uppercase tracking-wide">
                Press <span className="font-bold">Enter</span> to see all results
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

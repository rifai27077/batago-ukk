"use client";

import { useState, useMemo } from "react";
import { Star, MessageSquare, ThumbsUp, Search, Filter, TrendingUp, BarChart3, Download, Send } from "lucide-react";
import EmptyState from "@/components/partner/dashboard/EmptyState";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Pagination from "@/components/partner/dashboard/Pagination";

interface Review {
  id: string;
  guest: string;
  avatar: string;
  rating: number;
  comment: string;
  room: string;
  date: string;
  reply?: string;
}

const mockReviews: Review[] = [
  { id: "1", guest: "Ahmad Rifai", avatar: "AR", rating: 5, comment: "Kamar bersih dan nyaman, staff sangat ramah! Sarapan juga enak. Pasti akan menginap lagi.", room: "Deluxe Room", date: "16 Feb 2026", reply: "Terima kasih atas ulasan positifnya, Pak Ahmad! Kami senang Anda menikmati menginap di sini. Ditunggu kedatangannya kembali!" },
  { id: "2", guest: "Budi Pratama", avatar: "BP", rating: 5, comment: "Suite room-nya luar biasa! View laut yang indah dan fasilitas lengkap. Worth every penny.", room: "Suite Room", date: "15 Feb 2026" },
  { id: "3", guest: "Siti Nurhaliza", avatar: "SN", rating: 4, comment: "Lokasi strategis, dekat dengan pusat kota. Kamar cukup luas untuk keluarga. WiFi agak lambat di malam hari.", room: "Family Room", date: "14 Feb 2026", reply: "Terima kasih feedbacknya, Bu Siti. Kami sudah meningkatkan bandwidth WiFi kami. Semoga pengalaman selanjutnya lebih baik!" },
  { id: "4", guest: "Reza Arap", avatar: "RA", rating: 3, comment: "Kamar standar cukup oke untuk harganya. AC agak berisik di malam hari. Breakfast biasa saja.", room: "Standard Room", date: "12 Feb 2026" },
  { id: "5", guest: "Dewi Lestari", avatar: "DL", rating: 5, comment: "Pengalaman menginap terbaik di Batam! Kolam renangnya amazing dan spa-nya relaxing banget.", room: "Deluxe Room", date: "10 Feb 2026" },
  { id: "6", guest: "Maya Sari", avatar: "MS", rating: 4, comment: "Hotel dengan pelayanan prima. Check-in cepat, kamar wangi. Satu catatan: parking agak susah saat weekend.", room: "Deluxe Room", date: "8 Feb 2026" },
];

const ratingDistribution = [
  { stars: "5★", count: 68, pct: 53 },
  { stars: "4★", count: 38, pct: 30 },
  { stars: "3★", count: 15, pct: 12 },
  { stars: "2★", count: 5, pct: 4 },
  { stars: "1★", count: 2, pct: 1 },
];

const ratingTrend = [
  { month: "Sep", avg: 4.3 },
  { month: "Oct", avg: 4.4 },
  { month: "Nov", avg: 4.2 },
  { month: "Dec", avg: 4.5 },
  { month: "Jan", avg: 4.7 },
  { month: "Feb", avg: 4.6 },
];

const tabs = ["All", "Replied", "Unreplied"] as const;

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const filtered = useMemo(() => {
    return mockReviews.filter((r) => {
      const matchSearch = r.guest.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
      if (activeTab === "Replied") return matchSearch && r.reply;
      if (activeTab === "Unreplied") return matchSearch && !r.reply;
      return matchSearch;
    });
  }, [activeTab, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{mockReviews.length} total reviews</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm border border-gray-100 dark:border-slate-700">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4.6</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Average Rating</p>
            </div>
          </div>
          <div className="flex mt-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-4 h-4 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-amber-400 fill-amber-400 opacity-50"}`} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">78%</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Response Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">83%</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Positive Sentiment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Reviews List */}
        <div className="xl:col-span-2 space-y-4 flex flex-col">
          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1 flex-shrink-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      activeTab === tab 
                      ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm" 
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl px-3 py-2.5 gap-2 flex-1 border border-gray-100 dark:border-slate-800 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={search}
                  onChange={handleSearchChange}
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-slate-200 placeholder-gray-400 w-full"
                />
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {paginatedReviews.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                <EmptyState
                  variant="review"
                  title="Belum ada ulasan"
                  description="Ulasan dari tamu akan muncul di sini setelah mereka menyelesaikan masa menginap."
                />
              </div>
            ) : (
            paginatedReviews.map((review: Review) => (
              <div key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white text-sm">{review.guest}</span>
                        <span className="text-gray-400 text-xs ml-2">· {review.room}</span>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-slate-600"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mt-2 leading-relaxed">{review.comment}</p>

                    {/* Reply */}
                    {review.reply && (
                      <div className="mt-3 bg-primary/5 dark:bg-primary/10 rounded-xl p-3 border border-primary/10 dark:border-primary/20">
                        <p className="text-xs font-bold text-primary mb-1">Your Reply</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{review.reply}</p>
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === review.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={3}
                          className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 resize-none text-gray-800 dark:text-gray-200"
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className="px-3 py-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">Cancel</button>
                          <button className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90">Reply</button>
                        </div>
                      </div>
                    ) : (
                      !review.reply && (
                        <button
                          onClick={() => setReplyingTo(review.id)}
                          className="mt-2 text-sm text-primary font-medium hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Reply
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>

        {/* Sidebar: Rating Analytics */}
        <div className="space-y-5">
          {/* Rating Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
            <div className="space-y-2.5">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-600 dark:text-slate-300 w-6">{item.stars}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-slate-400 w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Rating Trend</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[3.5, 5]} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    isAnimationActive={false}
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "8px 12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    formatter={(value: any) => [value?.toFixed(1) || "0", "Avg Rating"]}
                  />
                  <Bar isAnimationActive={false} dataKey="avg" fill="#14B8A6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Keywords */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Popular Mentions</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { word: "bersih", count: 42, positive: true },
                { word: "ramah", count: 38, positive: true },
                { word: "nyaman", count: 35, positive: true },
                { word: "strategis", count: 28, positive: true },
                { word: "sarapan", count: 24, positive: true },
                { word: "WiFi", count: 18, positive: false },
                { word: "AC", count: 12, positive: false },
                { word: "view", count: 20, positive: true },
                { word: "kolam", count: 15, positive: true },
                { word: "parking", count: 8, positive: false },
              ].map((kw) => (
                <span
                  key={kw.word}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    kw.positive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20"
                      : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20"
                  }`}
                >
                  {kw.word} ({kw.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

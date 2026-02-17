"use client";

import { useState, useEffect } from "react";
import { X, FileText, Save, Clock, User } from "lucide-react";

interface Article {
  id?: number;
  title: string;
  author: string;
  status: "published" | "draft";
  date: string;
  views: number;
}

interface AddEditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  article?: Article | null;
}

export default function AddEditArticleModal({ isOpen, onClose, onSave, article }: AddEditArticleModalProps) {
  const [formData, setFormData] = useState<Article>({
    title: "",
    author: "Tim Editorial",
    status: "draft",
    date: "",
    views: 0,
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({
        title: "",
        author: "Tim Editorial",
        status: "draft",
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        views: 0,
      });
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-700/30">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {article ? "Edit Article" : "Write New Article"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Article Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Best Hidden Gems in Batam"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-3 text-base font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Author</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Publish Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white appearance-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Article Content</label>
              <textarea
                placeholder="Write your article content here..."
                className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-xl px-4 py-3 text-sm min-h-[200px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Last saved: {formData.date}</span>
            </div>
            <div className="flex border-2 border-primary/30 rounded-xl overflow-hidden shadow-sm">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {article ? "Update Article" : "Publish Article"}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

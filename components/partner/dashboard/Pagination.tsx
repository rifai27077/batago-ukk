"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange?: (items: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5 bg-white dark:bg-slate-800 border-t border-gray-50 dark:border-slate-700">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> results
        </p>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2 border-l border-gray-100 dark:border-slate-700 pl-4 ml-1">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-500 dark:text-slate-400">Show:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 border-none rounded-lg py-1 px-2 focus:ring-1 focus:ring-primary cursor-pointer transition-all"
            >
              {[5, 10, 20, 50].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 rounded-lg transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..."}
                className={`
                  min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${
                    page === currentPage
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-primary"
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 rounded-lg transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

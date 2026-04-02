"use client";

import { useState } from "react";
import { X, DollarSign, Building2, CreditCard } from "lucide-react";

interface ProcessPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (data: any) => void;
  payout: {
    id: number;
    partner: string;
    amount: number;
    bookings?: number;
  } | null;
}

export default function ProcessPayoutModal({ isOpen, onClose, onProcess, payout }: ProcessPayoutModalProps) {
  const [refId, setRefId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !payout) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      onProcess({ ...payout, refId });
      setIsProcessing(false);
      onClose();
      setRefId("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Process Payout</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Summary Card */}
          <div className="bg-primary/10 dark:bg-primary/10 border border-primary/20 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Total Payout</p>
                    <p className="text-3xl font-bold text-primary dark:text-primary">
                        Rp {payout.amount.toLocaleString("id-ID")}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                    <Building2 className="w-5 h-5 text-primary" />
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-primary/80 dark:text-primary/80">Recipient</span>
                <span className="font-bold text-primary dark:text-primary">{payout.partner}</span>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Bank Transfer Reference ID</label>
             <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. TRX-882930001"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white font-mono"
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 ml-1">
                Please enter the bank transaction ID after completing the transfer manually.
            </p>
          </div>

          <button 
            type="submit"
            disabled={!refId || isProcessing}
            className="w-full bg-primary hover:bg-primary/80 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isProcessing ? "Processing..." : "Confirm Transfer"}
          </button>
        </form>
      </div>
    </div>
  );
}

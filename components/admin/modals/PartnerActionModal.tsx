"use client";

import { useState } from "react";
import { X, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface PartnerActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  partnerName: string;
  action: "approve" | "reject" | "suspend";
}

export default function PartnerActionModal({ isOpen, onClose, onConfirm, partnerName, action }: PartnerActionModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const config = {
    approve: {
      title: "Approve Partner",
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      btn: "bg-emerald-500 hover:bg-emerald-600",
      desc: "Are you sure you want to approve this partner? They will be able to start listing services immediately.",
      requireReason: false,
    },
    reject: {
      title: "Reject Partner",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-500/10",
      btn: "bg-red-500 hover:bg-red-600",
      desc: "This partner will be rejected. Please provide a reason for the rejection email.",
      requireReason: true,
    },
    suspend: {
      title: "Suspend Partner",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      btn: "bg-amber-500 hover:bg-amber-600",
      desc: "This action will temporarily disable all listings from this partner.",
      requireReason: true,
    },
  };

  const currentConfig = config[action];
  const Icon = currentConfig.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ action, reason, partnerName });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentConfig.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${currentConfig.bg}`}>
                <Icon className={`w-5 h-5 ${currentConfig.color}`} />
             </div>
             <div>
                <p className="font-bold text-gray-900 dark:text-white">{partnerName}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">{currentConfig.desc}</p>
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
               {action === 'approve' ? "Optional Note" : "Reason (Required)"}
             </label>
             <div className="relative">
              <FileText className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <textarea
                required={currentConfig.requireReason}
                placeholder={action === 'approve' ? "Add a welcome note..." : "Please explain why..."}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={currentConfig.requireReason && !reason}
              className={`flex-1 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-gray-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed ${currentConfig.btn}`}
            >
              Confirm {action === 'approve' ? 'Approval' : action === 'reject' ? 'Rejection' : 'Suspension'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CreditCard, Wallet, Building2, CheckCircle2, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import Image from "next/image";

type PaymentMethod = "credit_card" | "virtual_account" | "ewallet";

export default function PaymentGateway() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit_card");

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      {/* Header section */}
      <div className="bg-gray-50/50 p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground">Payment Method</h2>
          <p className="text-sm text-muted mt-1 font-medium">All transactions are secure and encrypted.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
           <ShieldCheck className="w-4 h-4" />
           256-bit Encrypted
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Payment Type Tabs */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <button 
            onClick={() => setSelectedMethod("credit_card")}
            className={`flex-1 relative p-4 rounded-xl border-2 transition-all flex items-center gap-3 desktop-hover ${
              selectedMethod === "credit_card" 
              ? "border-primary bg-primary/5 shadow-sm" 
              : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedMethod === "credit_card" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>
               <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-left">
               <p className={`font-bold text-sm ${selectedMethod === "credit_card" ? "text-primary" : "text-foreground"}`}>Credit / Debit</p>
               <div className="flex items-center gap-1 mt-1 opacity-60">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-2.5 object-contain grayscale" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-3 object-contain mx-1 grayscale" />
               </div>
            </div>
            {selectedMethod === "credit_card" && <CheckCircle2 className="w-5 h-5 text-primary absolute top-4 right-4" />}
          </button>

          <button 
            onClick={() => setSelectedMethod("virtual_account")}
            className={`flex-1 relative p-4 rounded-xl border-2 transition-all flex items-center gap-3 desktop-hover ${
              selectedMethod === "virtual_account" 
              ? "border-primary bg-primary/5 shadow-sm" 
              : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedMethod === "virtual_account" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>
               <Building2 className="w-5 h-5" />
            </div>
            <div className="text-left">
               <p className={`font-bold text-sm ${selectedMethod === "virtual_account" ? "text-primary" : "text-foreground"}`}>Virtual Account</p>
               <p className="text-xs text-muted mt-0.5 font-medium">BCA, BNI, Mandiri</p>
            </div>
            {selectedMethod === "virtual_account" && <CheckCircle2 className="w-5 h-5 text-primary absolute top-4 right-4" />}
          </button>

          <button 
            onClick={() => setSelectedMethod("ewallet")}
            className={`flex-1 relative p-4 rounded-xl border-2 transition-all flex items-center gap-3 desktop-hover ${
              selectedMethod === "ewallet" 
              ? "border-primary bg-primary/5 shadow-sm" 
              : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedMethod === "ewallet" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>
               <Wallet className="w-5 h-5" />
            </div>
            <div className="text-left">
               <p className={`font-bold text-sm ${selectedMethod === "ewallet" ? "text-primary" : "text-foreground"}`}>E-Wallet</p>
               <p className="text-xs text-muted mt-0.5 font-medium">GoPay, OVO, ShopeePay</p>
            </div>
            {selectedMethod === "ewallet" && <CheckCircle2 className="w-5 h-5 text-primary absolute top-4 right-4" />}
          </button>
        </div>

        {/* Dynamic Payment Interface */}
        <div className="bg-gray-50/50 rounded-2xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
          
          {selectedMethod === "credit_card" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex flex-col lg:flex-row gap-8 items-start">
                  
                  {/* Visual Card (Desktop Only) */}
                  <div className="hidden lg:block w-72 h-44 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-xl p-6 relative overflow-hidden shrink-0 text-white transform hover:scale-105 transition-transform duration-300">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                     <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-xl -ml-10 -mb-10"></div>
                     <div className="flex justify-between items-start relative z-10">
                        <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2"/><line x1="2" y1="10" x2="22" y2="10" strokeWidth="2"/></svg>
                        <div className="flex gap-1 opacity-50">
                            <div className="w-6 h-6 rounded-full bg-white"></div>
                            <div className="w-6 h-6 rounded-full bg-white -ml-3"></div>
                        </div>
                     </div>
                     <div className="mt-8 relative z-10">
                         <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1">Card Number</p>
                         <p className="font-mono text-lg tracking-[0.2em] text-white overflow-hidden text-ellipsis">•••• •••• •••• 1234</p>
                     </div>
                     <div className="flex justify-between mt-4 relative z-10">
                        <div>
                            <p className="text-[8px] font-bold text-white/50 tracking-widest uppercase mb-0.5">Cardholder</p>
                            <p className="text-xs font-bold font-mono uppercase truncate w-32">Full Name</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-bold text-white/50 tracking-widest uppercase mb-0.5">Expires</p>
                            <p className="text-xs font-bold font-mono">MM/YY</p>
                        </div>
                     </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 w-full space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider block">Card Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono placeholder:text-gray-300 font-bold text-foreground"
                            />
                            <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider block">Name on Card</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-foreground placeholder:text-gray-300"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider block">Expiry Date</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono font-bold text-foreground placeholder:text-gray-300 text-center"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider block flex justify-between">
                                CVC / CVV
                                <span className="text-primary cursor-help">What is this?</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="•••"
                                    maxLength={4}
                                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono font-black text-foreground placeholder:text-gray-300 tracking-[0.2em]"
                                />
                                <Lock className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {selectedMethod === "virtual_account" && (
            <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center text-center py-6 px-4">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50/50">
                  <Building2 className="w-8 h-8 text-blue-600" />
               </div>
               <h3 className="text-xl font-black text-foreground mb-2">Bank Transfer (Virtual Account)</h3>
               <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
                 After clicking "Confirm Payment", you will receive a unique Virtual Account number to complete your transaction within 24 hours.
               </p>
               <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 w-full max-w-sm flex flex-col gap-3">
                   <div className="text-left border-b border-gray-100 pb-3 flex justify-between items-center group cursor-pointer hover:opacity-70 transition-opacity">
                      <span className="font-bold text-foreground flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          BCA Virtual Account
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                   </div>
                   <div className="text-left border-b border-gray-100 pb-3 flex justify-between items-center group cursor-pointer hover:opacity-70 transition-opacity">
                      <span className="font-bold text-foreground flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          BNI Virtual Account
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                   </div>
                   <div className="text-left flex justify-between items-center group cursor-pointer hover:opacity-70 transition-opacity">
                      <span className="font-bold text-foreground flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Mandiri Virtual Account
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                   </div>
               </div>
            </div>
          )}

          {selectedMethod === "ewallet" && (
            <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center text-center py-6 px-4">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 ring-8 ring-green-50/50">
                  <Wallet className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-xl font-black text-foreground mb-2">QRIS / E-Wallet</h3>
               <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
                 Pay instantly using GoPay, OVO, ShopeePay, Dana, or LinkAja by scanning the secure QRIS code on the next screen.
               </p>
               <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" alt="GoPay" className="object-contain" />
                   </div>
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/OVO_logo.svg" alt="OVO" className="object-contain" />
                   </div>
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-2">
                       <span className="font-black text-sm text-orange-500 tracking-tighter">Shopee</span>
                   </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

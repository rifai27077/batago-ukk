"use client";

import { CreditCard, Wallet, Building2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

type PaymentMethod = "credit_card" | "bank_transfer" | "ewallet";

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit_card");

  const methods = [
    {
      id: "credit_card",
      label: "Credit Card",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or JCB",
    },
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      icon: Building2,
      description: "Transfer via BCA, Mandiri, BNI, or BRI",
    },
    {
      id: "ewallet",
      label: "E-Wallet",
      icon: Wallet,
      description: "GoPay, OVO, Dana, or LinkAja",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id as PaymentMethod)}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all relative ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-primary text-white" : "bg-gray-100 text-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-primary absolute top-4 right-4" />
                )}
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {method.label}
                </p>
                <p className="text-xs text-muted mt-1">{method.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Details Form (Conditional) */}
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
        {selectedMethod === "credit_card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Card Number
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Exp. Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="Name on Card"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
              />
            </div>
          </div>
        )}

        {selectedMethod === "bank_transfer" && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                <Building2 className="w-5 h-5" />
             </div>
             <div>
                <p className="font-bold text-blue-900 text-sm">Transfer Instructions</p>
                <p className="text-xs text-blue-700 mt-1">You will be redirected to complete your payment via Virtual Account. Please complete payment within 2 hours.</p>
             </div>
          </div>
        )}

        {selectedMethod === "ewallet" && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                <Wallet className="w-5 h-5" />
             </div>
             <div>
                <p className="font-bold text-green-900 text-sm">Scan QR Code</p>
                <p className="text-xs text-green-700 mt-1">A QR code will be generated for you to scan with your preferred e-wallet app.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

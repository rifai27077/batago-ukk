"use client";

import { useState } from "react";
import { CreditCard, Trash2, Plus } from "lucide-react";
import Image from "next/image";

interface PaymentMethod {
  id: string;
  type: "Visa" | "Mastercard";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "12/28",
      isDefault: true,
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "8888",
      expiry: "06/25",
      isDefault: false,
    },
  ]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      setMethods((prev) => prev.filter((method) => method.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`relative p-6 rounded-xl border-2 transition-all ${
              method.isDefault
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    {/* Mock Card Logos */}
                    <div className="bg-white p-1 rounded border border-gray-100 w-12 h-8 flex items-center justify-center font-bold text-xs text-blue-800 italic">
                        {method.type.toUpperCase()}
                    </div>
                </div>
                {method.isDefault && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                    Default
                    </span>
                )}
            </div>
            
            <div className="mb-4">
                <p className="text-lg font-mono text-foreground">
                    •••• •••• •••• {method.last4}
                </p>
                <p className="text-xs text-muted mt-1">Expires {method.expiry}</p>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={() => handleDelete(method.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
          </div>
        ))}

        {/* Add New Card Button */}
        <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all gap-4 min-h-[180px] group">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-500 group-hover:text-primary">Add a new card</span>
        </button>
      </div>
    </div>
  );
}

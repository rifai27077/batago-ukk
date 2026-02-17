"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Booking & Payments",
    items: [
      { q: "How do I change my flight reservation?", a: "You can change your flight reservation by going to 'My Bookings', selecting your flight, and clicking on 'Modify Booking'. Note that fees may apply depending on the airline's policy." },
      { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex), bank transfers, and various e-wallets available in your region." },
      { q: "When will I receive my e-ticket?", a: "E-tickets are usually sent to your email address within 5-10 minutes after your payment is confirmed. You can also download them from the 'My Bookings' page." },
    ]
  },
  {
    category: "Cancellations & Refunds",
    items: [
      { q: "Can I get a refund if I cancel?", a: "Refund policies vary by airline and hotel. You can check the specific cancellation policy for your booking in the booking details page before and after purchase." },
      { q: "How long does the refund process take?", a: "Refunds typically take 7-14 business days to be processed and reflected in your account, depending on your bank." },
    ]
  },
  {
    category: "Account & Security",
    items: [
      { q: "How do I reset my password?", a: "Click on 'Login', then select 'Forgot Password?'. Follow the instructions sent to your email to reset your password." },
      { q: "Is my personal data safe?", a: "Yes, we use industry-standard encryption to protect your personal and financial information. We do not sell your data to third parties." },
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pt-[72px]">
         <div className="bg-primary py-16 md:py-24 text-center px-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">How can we help?</h1>
            <div className="max-w-xl mx-auto relative">
                <input 
                    type="text" 
                    placeholder="Search for answers..." 
                    className="w-full pl-12 pr-6 py-4 rounded-full shadow-lg border-0 focus:ring-2 focus:ring-white/50 text-foreground"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            </div>
         </div>

         <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            {FAQ_DATA.map((section, sIdx) => (
                <div key={sIdx} className="mb-12">
                    <h2 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-gray-100">{section.category}</h2>
                    <div className="space-y-4">
                        {section.items.map((item, iIdx) => {
                            const id = `${sIdx}-${iIdx}`;
                            const isOpen = openIndex === id;
                            return (
                                <div key={iIdx} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                    <button 
                                        onClick={() => toggleFAQ(id)}
                                        className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-gray-100 transition-colors"
                                    >
                                        {item.q}
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    <div 
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                                    >
                                        <div className="p-5 pt-0 text-muted leading-relaxed text-sm">
                                            {item.a}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className="mt-16 p-8 bg-blue-50 rounded-2xl text-center">
                <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
                <p className="text-muted mb-6">Can't find the answer you're looking for? Please seek further assistance.</p>
                <a href="/contact" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
                    Contact Support
                </a>
            </div>
         </div>
      </main>

      <Footer />
    </div>
  );
}

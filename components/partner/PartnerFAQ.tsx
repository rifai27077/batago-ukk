"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Is there a fee to list my property or airline?",
    answer: "No, listing on BataGo is completely free. We only charge a small commission fee on successful bookings."
  },
  {
    question: "When do I get paid?",
    answer: "Payouts are processed weekly for all completed stays or flights. The money is transferred directly to your registered bank account."
  },
  {
    question: "Can I manage my own pricing and availability?",
    answer: "Absolutely. You have full control over your inventory, pricing strategies, and availability calendar through our Partner Dashboard."
  },
  {
    question: "Do I need to sign a long-term contract?",
    answer: "No, there are no lock-in contracts. You can list or delist your services at any time."
  },
];

export default function PartnerFAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 text-left transition-colors"
            >
                <span className="font-bold text-foreground text-lg">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            <div 
                className={`bg-gray-50 px-6 transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-48 py-6 opacity-100" : "max-h-0 py-0 opacity-0"
                }`}
            >
                <p className="text-muted leading-relaxed">{answer}</p>
            </div>
        </div>
    )
}

"use client";

import { Globe, TrendingUp, ShieldCheck, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with millions of travelers from around the world looking for their next stay or flight.",
  },
  {
    icon: TrendingUp,
    title: "Boost Revenue",
    description: "Maximize your occupancy rates and flight loads with our smart marketing and dynamic pricing tools.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Guaranteed payouts and fraud protection. Focus on your business while we handle the transactions.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated partner support team ready to assist you anytime, anywhere in multiple languages.",
  },
];

export default function PartnerBenefits() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Partner with Us?</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            We provide the tools and support you need to scale your business effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
                key={index} 
                className="p-8 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

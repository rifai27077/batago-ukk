"use client";

import { ClipboardCheck, UploadCloud, Banknote } from "lucide-react";

export default function PartnerSteps() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Get started in just a few simple steps. No hidden fees, no complicated setup.
          </p>
        </div>

        <div className="relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-lg mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <ClipboardCheck className="w-8 h-8" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">1. Register Free</h3>
                    <p className="text-muted leading-relaxed">
                        Create your partner account in minutes. Fill in your business details and verify your identity.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-lg mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">2. List Your Property</h3>
                    <p className="text-muted leading-relaxed">
                        Upload high-quality photos, set your pricing, and manage availability through our easy dashboard.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-lg mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Banknote className="w-8 h-8" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">3. Start Earning</h3>
                    <p className="text-muted leading-relaxed">
                        Go live instantly. Receive bookings and get paid securely with our automated payout system.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pt-[72px] pb-12">
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted mb-8">Last updated: February 2026</p>

            <div className="prose prose-blue max-w-none text-muted">
                <p>
                    Welcome to BataGo. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                    Please read them carefully before using our platform.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">1. Acceptance of Terms</h3>
                <p>
                    By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, 
                    then you may not access the Service.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">2. Booking Data & Payments</h3>
                <p>
                    When you make a booking through BataGo, you agree to provide accurate and complete information. 
                    You are responsible for all charges incurred under your account. Prices are subject to change without notice until booked.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">3. User Accounts</h3>
                <p>
                  To access certain features of the Service, you may be required to register for an account. 
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">4. Limitation of Liability</h3>
                <p>
                    In no event shall BataGo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, 
                    special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">5. Changes to Terms</h3>
                <p>
                   We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                   By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
                
                 <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">6. Contact Us</h3>
                <p>
                    If you have any questions about these Terms, please contact us at <a href="mailto:legal@batago.com" className="text-primary hover:underline">legal@batago.com</a>.
                </p>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

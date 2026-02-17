"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pt-[72px] pb-12">
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted mb-8">Last updated: February 2026</p>

            <div className="prose prose-blue max-w-none text-muted">
                <p>
                    At BataGo, we value your privacy and are committed to protecting your personal data. 
                    This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">1. Information We Collect</h3>
                <p>
                    We collect information that you provide directly to us, such as when you create an account, make a booking, or contact our support team.
                    This may include your name, email address, phone number, and payment information.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">2. How We Use Your Information</h3>
                <p>
                    We use the information we collect to:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                    <li>Process your bookings and payments.</li>
                    <li>Communicate with you about your reservations and account.</li>
                    <li>Send you promotional offers and updates (if you opted in).</li>
                    <li>Improve our website and services.</li>
                </ul>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">3. Sharing of Information</h3>
                <p>
                    We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our website,
                    conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">4. Security</h3>
                <p>
                    We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h3 className="text-foreground font-bold mt-8 mb-4 text-xl">5. Contact Us</h3>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@batago.com" className="text-primary hover:underline">privacy@batago.com</a>.
                </p>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import BecomePartnerForm from "@/components/auth/BecomePartnerForm";
import { getProfile } from "@/lib/api";
import { Clock, CheckCircle2, XCircle, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AccountPartnerPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await getProfile();
        if (res.user) {
          setStatus(res.user.partner_status || null);
          setCompanyName(res.user.partner_company_name || "");
        }
      } catch (err) {
        console.error("Failed to fetch partner status", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStatus();

    const handleUpdate = () => fetchStatus();
    window.addEventListener("profileUpdated", handleUpdate);
    return () => window.removeEventListener("profileUpdated", handleUpdate);
  }, []);

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Checking status...</div>;

  if (status === "IN_REVIEW") {
    return (
      <div className="space-y-8">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-foreground">Partner Status</h2>
          <p className="text-muted">Track your registration progress.</p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-10 h-10 animate-pulse-slow" />
          </div>
          
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Registration Under Review</h3>
            <p className="text-gray-600 leading-relaxed">
              We've received your application for <span className="font-bold text-primary">{companyName}</span>. 
              Our team is currently reviewing your details. This usually takes 1-2 business days.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
             <div className="px-6 py-2.5 bg-white border border-primary/20 rounded-xl text-sm font-semibold text-primary shadow-sm flex items-center gap-2 justify-center">
                <Building2 className="w-4 h-4" />
                {companyName}
             </div>
             <div className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 justify-center cursor-default">
                <Clock className="w-4 h-4" />
                Pending Verification
             </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
           <h4 className="font-bold text-gray-900 mb-2">What happens next?</h4>
           <ul className="text-sm text-gray-600 space-y-3">
             <li className="flex gap-3">
               <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">1</span>
               <span>Our team verifies your business documents and address.</span>
             </li>
             <li className="flex gap-3">
               <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">2</span>
               <span>You will receive an email confirmation once approved.</span>
             </li>
             <li className="flex gap-3">
               <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">3</span>
               <span>Once approved, you can start listing your services on BataGo.</span>
             </li>
           </ul>
        </div>
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div className="space-y-8">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-foreground">Partner Status</h2>
          <p className="text-muted">Welcome to the BataGo Network!</p>
        </div>

        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Account Approved!</h3>
            <p className="text-gray-600">
              Congratulations! Your business <span className="font-bold text-green-700">{companyName}</span> is now an active partner.
            </p>
          </div>

          <Link 
            href="/partner/dashboard" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all active:scale-95 mx-auto"
          >
            Go to Partner Dashboard
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="space-y-8">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-foreground">Partner Status</h2>
            <p className="text-muted">Important update regarding your registration.</p>
          </div>

          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <XCircle className="w-10 h-10" />
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Application Rejected</h3>
              <p className="text-gray-600 leading-relaxed">
                Unfortunately, your application for <span className="font-bold text-red-700">{companyName}</span> was not approved at this time.
              </p>
            </div>

            <button 
              onClick={() => setStatus(null)}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Re-apply with different details
            </button>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-foreground">Become a Partner</h2>
        <p className="text-muted">Grow your business by joining the BataGo network.</p>
      </div>
      
      <div className="bg-white rounded-xl">
        <BecomePartnerForm />
      </div>
    </div>
  );
}

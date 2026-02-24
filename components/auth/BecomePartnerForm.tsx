"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingInput from "@/components/ui/FloatingInput";
import { Building2, Briefcase } from "lucide-react";
import { becomePartner } from "@/lib/api";

export default function BecomePartnerForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        company_name: "",
        type: "",
        address: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await becomePartner(formData);
            setSuccess("Your partner application has been submitted and is under review!");
            
            // Trigger profile update for sidebar
            window.dispatchEvent(new Event("profileUpdated"));

            setTimeout(() => {
                router.push("/account/partner");
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit application");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-3">Become a Partner</h1>
            <p className="text-muted mb-8">Ready to grow your business? Join the BataGo partner network today.</p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {success}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                        <Building2 className="w-5 h-5" />
                        Business Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingInput 
                            label="Business/Company Name" 
                            id="company_name" 
                            placeholder="e.g. Grand Batago Hotel" 
                            value={formData.company_name}
                            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                            required
                        />
                        
                        <div className="relative mb-5">
                            <select
                                id="type"
                                className="block px-4 pb-3 pt-3 w-full text-base text-foreground bg-transparent rounded-[4px] border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                required
                            >
                                <option value="" disabled hidden></option>
                                <option value="hotel">Hotel / Accommodation</option>
                                <option value="flight">Airline / Flight Provider</option>
                            </select>
                            <label
                                htmlFor="type"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 start-1"
                            >
                                Service Type
                            </label>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <FloatingInput 
                        label="Full Business Address" 
                        id="address" 
                        placeholder="Street, City, Province, Country" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                    />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Submitting Application..." : "Submit Partner Application"}
                    </button>
                </div>
            </form>
        </div>
    );
}

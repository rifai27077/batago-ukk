"use client";

import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";
import { Building2, Briefcase, User } from "lucide-react";

export default function PartnerRegisterForm() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-3">Become a Partner</h1>
      <p className="text-muted mb-8">Join BataGo network and grow your travel business with us.</p>

      <form className="space-y-6">
        
        {/* Business Information Section */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Building2 className="w-5 h-5" />
                Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput 
                    label="Business Name" 
                    id="businessName" 
                    placeholder="e.g. Hotel Santika" 
                />
                
                {/* Custom styling to match FloatingInput for Select */}
                <div className="relative mb-5">
                    <select
                        id="businessType"
                        className="block px-4 pb-3 pt-3 w-full text-base text-foreground bg-transparent rounded-[4px] border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                        defaultValue=""
                    >
                        <option value="" disabled hidden></option>
                        <option value="hotel">Hotel / Accommodation</option>
                        <option value="travel">Tour & Travel Agency</option>
                        <option value="airline">Airline</option>
                        <option value="rental">Car Rental</option>
                        <option value="event">Event Organizer</option>
                    </select>
                     <label
                        htmlFor="businessType"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 start-1"
                    >
                        Business Type
                    </label>
                    {/* Select Arrow Icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <FloatingInput 
                label="Business Address" 
                id="address" 
                placeholder="Full business address" 
            />
        </div>

        {/* Contact Person Section */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <User className="w-5 h-5" />
                Contact Person
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput 
                    label="First Name" 
                    id="firstName" 
                    placeholder="John" 
                />
                <FloatingInput 
                    label="Last Name" 
                    id="lastName" 
                    placeholder="Doe" 
                />
            </div>
            <FloatingInput 
                label="Job Title" 
                id="jobTitle" 
                placeholder="e.g. General Manager" 
            />
        </div>

        {/* Credentials Section */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Briefcase className="w-5 h-5" />
                Account Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput 
                    label="Business Email" 
                    id="email" 
                    type="email" 
                    placeholder="contact@business.com" 
                />
                <FloatingInput 
                    label="Phone Number" 
                    id="phone" 
                    type="tel" 
                    placeholder="+62 812 3456 7890" 
                />
            </div>

            <FloatingInput 
                label="Password" 
                id="password" 
                type="password" 
                placeholder="********"
            />
            
            <FloatingInput 
                label="Confirm Password" 
                id="confirmPassword" 
                type="password" 
                placeholder="********"
            />
        </div>

        <div className="flex items-center gap-2 mt-2">
            <input 
                type="checkbox" 
                id="terms" 
                className="w-5 h-5 border-2 border-gray-400 rounded focus:ring-primary text-primary cursor-pointer" 
            />
            <label htmlFor="terms" className="text-sm font-medium text-foreground cursor-pointer">
                I agree to the <Link href="#" className="text-primary hover:underline">Partner Terms & Conditions</Link>
            </label>
        </div>

        <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 mb-6 text-lg"
        >
            Register as Partner
        </button>

        <p className="text-sm font-medium text-foreground text-center">
            Already a partner? <Link href="/login" className="text-primary hover:underline">Partner Login</Link>
        </p>
      </form>
    </div>
  );
}

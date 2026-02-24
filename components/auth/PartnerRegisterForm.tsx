import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingInput from "@/components/ui/FloatingInput";
import { Building2, Briefcase, User } from "lucide-react";
import { registerPartner } from "@/lib/api";

export default function PartnerRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    address: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await registerPartner({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company_name: formData.businessName,
        type: formData.businessType,
        address: formData.address
      });
      
      router.push(`/verify-code?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-3">Become a Partner</h1>
      <p className="text-muted mb-8">Join BataGo network and grow your travel business with us.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* Business Information Section */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-secondary">
                <Building2 className="w-5 h-5" />
                Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput 
                    label="Business Name" 
                    id="businessName" 
                    placeholder="e.g. Hotel Santika" 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    required
                />
                
                <div className="relative mb-5">
                    <select
                        id="businessType"
                        className="block px-4 pb-3 pt-3 w-full text-base text-foreground bg-transparent rounded-[4px] border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                        value={formData.businessType}
                        onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        required
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
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
            />
        </div>

        {/* Contact Person Section */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-secondary">
                <User className="w-5 h-5" />
                Contact Person
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput 
                    label="First Name" 
                    id="firstName" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                />
                <FloatingInput 
                    label="Last Name" 
                    id="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                />
            </div>
            <FloatingInput 
                label="Job Title" 
                id="jobTitle" 
                placeholder="e.g. General Manager" 
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
            />
        </div>

        {/* Credentials Section */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-secondary">
                <Briefcase className="w-5 h-5" />
                Account Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput 
                    label="Business Email" 
                    id="email" 
                    type="email" 
                    placeholder="contact@business.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <FloatingInput 
                    label="Phone Number" 
                    id="phone" 
                    type="tel" 
                    placeholder="+62 812 3456 7890" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                />
            </div>

            <FloatingInput 
                label="Password" 
                id="password" 
                type="password" 
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
            />
            
            <FloatingInput 
                label="Confirm Password" 
                id="confirmPassword" 
                type="password" 
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
            />
        </div>

        <div className="flex items-center gap-2 mt-2">
            <input 
                type="checkbox" 
                id="terms" 
                className="w-5 h-5 border-2 border-gray-400 rounded focus:ring-primary text-primary cursor-pointer" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm font-medium text-foreground cursor-pointer">
                I agree to the <Link href="#" className="text-secondary hover:underline">Partner Terms & Conditions</Link>
            </label>
        </div>

        <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-lg shadow-primary/20 mb-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? "Registering..." : "Register as Partner"}
        </button>

        <p className="text-sm font-medium text-foreground text-center">
            Already a partner? <Link href="/login" className="text-secondary hover:underline">Partner Login</Link>
        </p>
      </form>
    </div>
  );
}

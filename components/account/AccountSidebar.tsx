"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, CreditCard, LogOut, Rocket, Clock } from "lucide-react";
import { getProfile, logout } from "@/lib/api";

export default function AccountSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [partnerStatus, setPartnerStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
        try {
            const res = await getProfile();
            if (res.user) {
                setUserRole(res.user.role);
                setPartnerStatus(res.user.partner_status || null);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    }
    fetchProfile();
  }, []);

  const navItems = [
    {
      name: "Account",
      href: "/account/preferences",
      icon: User,
      description: "Personal information",
    },
    {
      name: "Security",
      href: "/account/security",
      icon: Shield,
      description: "Password and security",
    },
  ];

  // Add "Become a Partner" or "Partner Status" if user is a regular USER or has a pending app
  if (userRole === "USER") {
    const isPending = partnerStatus === "IN_REVIEW";
    navItems.push({
      name: isPending ? "Partner Status" : "Become a Partner",
      href: "/account/partner",
      icon: isPending ? Clock : Rocket,
      description: isPending ? "Registration Pending" : "Join our network",
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-fit sticky top-24">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isPartnerStatus = item.name === "Partner Status";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-transparent text-foreground hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 group-hover:text-primary group-hover:bg-primary/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                {isPartnerStatus && !isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div>
                <h3 className={`font-bold text-sm ${isActive ? "text-white" : "text-foreground"}`}>
                  {item.name}
                </h3>
                <p className={`text-xs ${isActive ? "text-white/80" : "text-muted"}`}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
        
        <hr className="my-4 border-gray-100" />
        
        <button 
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-red-50 text-red-500 w-full text-left group"
        >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 group-hover:bg-red-200 transition-colors">
                <LogOut className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-sm">Logout</h3>
                <p className="text-xs text-red-400">Sign out of your account</p>
            </div>
        </button>
      </div>
    </div>
  );
}

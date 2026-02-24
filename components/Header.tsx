"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plane, Bed, Menu, X, Heart, User, Settings, LogOut, ChevronDown, FileText, Check, LayoutDashboard, Tag } from "lucide-react";

import NotificationCenter from "@/components/notifications/NotificationCenter";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar_url?: string; is_verified?: boolean; partner_status?: string } | null>(null);
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfileData = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("batago_token") : null;
        setIsLoggedIn(!!token);

        if (token) {
            import("@/lib/api").then(mod => {
                mod.getProfile().then(res => {
                    if (res.user) {
                        setUser({
                            name: res.user.name,
                            email: res.user.email,
                            avatar_url: res.user.avatar_url,
                            is_verified: res.user.is_verified,
                            partner_status: res.user.partner_status
                        });
                    }
                }).catch(() => {
                    // Token might be invalid
                });
            });
        }
    };

    fetchProfileData();

    // Listen for custom event for real-time updates
    window.addEventListener("profileUpdated", fetchProfileData);
    return () => window.removeEventListener("profileUpdated", fetchProfileData);
  }, [pathname]);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Find Flights", href: "/flights", icon: Plane },
    { name: "Find Stays", href: "/stays", icon: Bed },
    { name: "Promotions", href: "/promotions", icon: Tag },
  ];

  // Force dark styling on specific pages (like listing) or when scrolled/mobile menu open
  const forceDark = isScrolled || isMobileMenuOpen || 
    pathname?.startsWith("/flights/list") || /^\/flights\/list\/[^/]+$/.test(pathname || "") || 
    pathname?.startsWith("/flights/book") || /^\/flights\/book\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/stays/list") || /^\/stays\/list\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/stays/book") || /^\/stays\/book\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/favourites") || /^\/favourites\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/my-bookings") || /^\/my-bookings\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/account") || /^\/account\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/booking/success") || /^\/booking\/success\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/booking/flight-success") || /^\/booking\/flight-success\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/terms") || /^\/terms\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/privacy") || /^\/privacy\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/contact") || /^\/contact\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/about") || /^\/about\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/profile") || /^\/profile\/[^/]+$/.test(pathname || "") ||
    pathname?.startsWith("/promotions") || /^\/promotions\/[^/]+$/.test(pathname || "")

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-2000 transition-all duration-300 px-6 py-4 ${
        forceDark
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3 border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.href === "#" ? false : pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-semibold transition-all relative group h-10 ${
                  forceDark 
                    ? isActive ? "text-primary border-b-4 border-primary mt-1" : "text-foreground hover:text-primary" 
                    : isActive ? "text-primary border-b-4 border-primary mt-1" : "text-white hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <button
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 transition-colors ${forceDark ? "text-foreground" : "text-white"}`} />
          ) : (
             <Menu className={`w-6 h-6 transition-colors ${forceDark ? "text-foreground" : "text-white"}`} />
          )}
        </button>

        {/* Center: Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-50">
          <div className={`relative h-10 w-32 transition-all duration-300 ${!forceDark ? "brightness-0 invert" : ""}`}>
            <Image
              src="/batago.svg"
              alt="BataGo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right: User Profile & Favourites (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
               {/* Favourites */}
               <Link 
                  href="/favourites" 
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                    forceDark ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
                  }`}
               >
                  <div className={`p-1.5 rounded-full ${forceDark ? "bg-gray-100/50" : "bg-white/20"} `}>
                     <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <span>Favourites</span>
               </Link>

               {/* Notifications */}
               <NotificationCenter />

               {/* Separator */}
               <div className={`h-6 w-px ${forceDark ? "bg-gray-200" : "bg-white/30"}`}></div>

               {/* User Profile */}
               <div className="relative" ref={profileMenuRef}>
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 shadow-sm">
                            <Image 
                                src={user?.avatar_url || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration_514344-14757.jpg?semt=ais_user_personalization&w=740&q=80"}
                                alt="Profile" 
                                fill 
                                className="object-cover" 
                                unoptimized
                            />
                        </div>
                        <div className="flex items-center gap-2">
                             <span className={`text-sm font-bold transition-colors ${
                                forceDark ? "text-foreground group-hover:text-primary" : "text-white group-hover:text-white/80"
                            }`}>
                                {user?.name?.split(" ")[0] || "Account"}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""} ${forceDark ? "text-foreground" : "text-white"}`} />
                        </div>
                  </div>

                  {/* Dropdown Menu */}
                  <div className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200 origin-top-right ${
                      isProfileMenuOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                  }`}>
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                          <div className="flex items-center gap-2">
                              <p className="font-bold text-foreground">{user?.name || "User"}</p>
                              {user?.is_verified && (
                                  <div className="bg-blue-500 rounded-full p-0.5" title="Verified Account">
                                      <Check className="w-3 h-3 text-white" />
                                  </div>
                              )}
                          </div>
                          <p className="text-xs text-muted truncate">{user?.email || "user@example.com"}</p>
                      </div>
                      <div className="p-2">
                          {user?.partner_status === "APPROVED" && (
                              <Link href="/partner/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border-b border-gray-50 mb-1" onClick={() => setIsProfileMenuOpen(false)}>
                                  <LayoutDashboard className="w-4 h-4" />
                                  Partner Dashboard
                              </Link>
                          )}
                          <Link href="/account/preferences" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg hover:text-primary transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                              <User className="w-4 h-4" />
                              Account Settings
                          </Link>
                          <Link href="/my-bookings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg hover:text-primary transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                              <FileText className="w-4 h-4" />
                              My Bookings
                          </Link>
                           <Link href="/account/security" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg hover:text-primary transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                              <Settings className="w-4 h-4" />
                              Security & Password
                          </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                            <button 
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={() => { 
                                    import("@/lib/api").then(mod => mod.removeToken());
                                    setIsLoggedIn(false); 
                                    setIsProfileMenuOpen(false); 
                                    window.location.reload(); // Force refresh to clear state
                                }}
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                          </button>
                      </div>
                  </div>
               </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  forceDark ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                  forceDark
                    ? "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20"
                    : "bg-white text-foreground hover:bg-gray-100"
                }`}
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Right: Placeholder for mobile balance */}
        <div className="md:hidden w-6" />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white z-2000 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative h-10 w-32">
                <Image
                  src="/batago.svg"
                  alt="BataGo Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <button
              className="p-2 -mr-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col p-6 gap-6 overflow-y-auto">
          <div className="space-y-6">
            {navLinks.map((link) => {
               const Icon = link.icon;
               return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-4 text-lg font-semibold text-foreground p-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  {link.name}
                </Link>
               );
            })}
          </div>

          <hr className="border-gray-100" />

          <div className="flex flex-col gap-4 mt-auto pb-8">
            {isLoggedIn ? (
              <>
                {user?.partner_status === "APPROVED" && (
                    <Link
                      href="/partner"
                      className="flex items-center gap-4 text-lg font-bold text-primary p-2 hover:bg-primary/5 rounded-lg border border-primary/10 mb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      Partner Dashboard
                    </Link>
                )}
                <Link
                  href="/my-bookings"
                  className="flex items-center gap-4 text-lg font-semibold text-foreground p-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                     <Plane className="w-5 h-5" />
                   </div>
                   My Bookings
                </Link>
                <Link
                  href="/favourites"
                  className="w-full bg-primary/5 text-primary font-bold py-3.5 rounded-xl text-center border border-primary/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>My Favourites</span>
                  </div>
                </Link>
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => { window.location.href = '/account/preferences'; setIsMobileMenuOpen(false); }}>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <Image 
                            src={user?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"}
                            alt={user?.name || "User"}
                            fill 
                            className="object-cover" 
                            unoptimized
                        />
                    </div>
                    <div>
                        <p className="font-bold text-foreground">{user?.name || "User"}</p>
                        <p className="text-xs text-muted">{user?.email || "user@example.com"}</p>
                    </div>
                </div>
                <button
                    className="w-full text-red-500 font-bold py-3.5 rounded-xl text-center hover:bg-red-50 transition-colors"
                    onClick={() => {
                        import("@/lib/api").then(mod => mod.removeToken());
                        setIsLoggedIn(false);
                        window.location.reload();
                    }}
                >
                    Logout
                </button>
              </>
            ) : (
                <>
                    <Link
                    href="/register"
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-center shadow-lg shadow-primary/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                    >
                    Sign up
                    </Link>
                    <Link
                    href="/login"
                    className="w-full bg-gray-100 text-foreground font-bold py-3.5 rounded-xl text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                    >
                    Login
                    </Link>
                </>
            )}
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}

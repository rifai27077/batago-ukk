"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plane, Bed, Menu, X, Heart, User, Settings, LogOut, ChevronDown, FileText } from "lucide-react";

import NotificationCenter from "@/components/notifications/NotificationCenter";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mocked login state
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
    pathname?.startsWith("/booking/flight-success") || /^\/booking\/flight-success\/[^/]+$/.test(pathname || "")

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
                                src="data:image/jpeg;base64,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" 
                                alt="Rifai" 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                             <span className={`text-sm font-bold transition-colors ${
                                forceDark ? "text-foreground group-hover:text-primary" : "text-white group-hover:text-white/80"
                            }`}>
                                Rifai
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""} ${forceDark ? "text-foreground" : "text-white"}`} />
                        </div>
                  </div>

                  {/* Dropdown Menu */}
                  <div className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200 origin-top-right ${
                      isProfileMenuOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                  }`}>
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                          <p className="font-bold text-foreground">Ahmad Rifai</p>
                          <p className="text-xs text-muted truncate">rifai@batago.com</p>
                      </div>
                      <div className="p-2">
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
                                onClick={() => { setIsLoggedIn(false); setIsProfileMenuOpen(false); }}
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
                href="#"
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  forceDark ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
                }`}
              >
                Login
              </Link>
              <Link
                href="#"
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
                            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" 
                            alt="A Rifai" 
                            fill 
                            className="object-cover" 
                        />
                    </div>
                    <div>
                        <p className="font-bold text-foreground">A Rifai</p>
                        <p className="text-xs text-muted">rifai@batago.com</p>
                    </div>
                </div>
                <button
                    className="w-full text-red-500 font-bold py-3.5 rounded-xl text-center hover:bg-red-50 transition-colors"
                    onClick={() => setIsLoggedIn(false)}
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plane, Bed, Menu, X, Heart } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mocked login state
  const pathname = usePathname();

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
    pathname?.startsWith("/favourites") || /^\/favourites\/[^/]+$/.test(pathname || "");

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

               {/* Separator */}
               <div className={`h-6 w-px ${forceDark ? "bg-gray-200" : "bg-white/30"}`}></div>

               {/* User Profile */}
               <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 shadow-sm">
                     <Image 
                        src="data:image/jpeg;base64,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" 
                        alt="Rifai" 
                        fill 
                        className="object-cover" 
                     />
                  </div>
                  <span className={`text-sm font-bold transition-colors ${
                    forceDark ? "text-foreground group-hover:text-primary" : "text-white group-hover:text-white/80"
                  }`}>
                    Rifai
                  </span>
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
                  href="/favourites"
                  className="w-full bg-primary/5 text-primary font-bold py-3.5 rounded-xl text-center border border-primary/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>My Favourites</span>
                  </div>
                </Link>
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
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

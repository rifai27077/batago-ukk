"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plane, Bed, Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { name: "Find Stays", href: "#", icon: Bed },
  ];

  // Force dark styling on specific pages (like listing) or when scrolled/mobile menu open
  const forceDark = isScrolled || isMobileMenuOpen || pathname?.startsWith("/flights/list") || /^\/flights\/list\/[^/]+$/.test(pathname || "") || pathname?.startsWith("/flights/book") || /^\/flights\/book\/[^/]+$/.test(pathname || "");

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
            <Link
              href="#"
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-center shadow-lg shadow-primary/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign up
            </Link>
            <Link
              href="#"
              className="w-full bg-gray-100 text-foreground font-bold py-3.5 rounded-xl text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}

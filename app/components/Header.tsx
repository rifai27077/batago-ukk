"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 px-6 py-4 ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-3 border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span>Find Flights</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>Find Stays</span>
          </Link>
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <button
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Center: Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-50">
          <div className={`relative h-10 w-32 transition-all duration-300 ${!isScrolled && !isMobileMenuOpen ? "brightness-0 invert" : ""}`}>
            <Image
              src="/batago.svg"
              alt="BataGo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right: Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#"
            className={`text-sm font-semibold transition-colors ${
              isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
            }`}
          >
            Login
          </Link>
          <Link
            href="#"
            className={`text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
              isScrolled
                ? "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20"
                : "bg-white text-foreground hover:bg-gray-100"
            }`}
          >
            Sign up
          </Link>
        </div>

        {/* Right: Placeholder for mobile balance (keeps logo centered) */}
        <div className="md:hidden w-6" />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white z-[2000] transition-all duration-300 ease-in-out ${
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col p-6 gap-6 overflow-y-auto">
          <div className="space-y-6">
            <Link
              href="#"
              className="flex items-center gap-4 text-lg font-semibold text-foreground p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              Find Flights
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 text-lg font-semibold text-foreground p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Find Stays
            </Link>
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

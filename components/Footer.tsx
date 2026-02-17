import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  "Our Destinations": ["Canada", "Alaska", "France", "Iceland"],
  "Our Activities": ["Northern Lights", "Cruising & Sailing", "Multi-activities", "Kayaking"],
  "Travel Blogs": ["Bali Travel Guide", "Sri Lanka Travel Guide", "Peru Travel Guide", "Bali Travel Guide"],
  "About Us": [{ label: "Our Story", href: "/about" }, { label: "Work with us", href: "/partner" }, { label: "FAQ", href: "/faq" }],
  "Contact Us": [{ label: "Get in Touch", href: "/contact" }, { label: "Partner Support", href: "/partner" }],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-20" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <Link href="/" className="inline-block mb-6 group">
              <div className="relative h-10 w-32 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity">
                <Image
                  src="/batago.svg"
                  alt="BataGo Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-white/80 mb-8 text-sm leading-relaxed max-w-sm">
              Your trusted companion for unforgettable journeys. Book flights, hotels, and experiences with confidence.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary hover:-translate-y-1 transition-all duration-300 text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary hover:-translate-y-1 transition-all duration-300 text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary hover:-translate-y-1 transition-all duration-300 text-white"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary hover:-translate-y-1 transition-all duration-300 text-white"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-8 lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
             {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-bold text-base mb-6 text-white tracking-wide">{title}</h4>
                <ul className="space-y-4">
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={typeof link === 'string' ? '#' : link.href}
                        className="text-white/80 text-sm hover:text-white hover:pl-1 transition-all duration-300 inline-block"
                      >
                        {typeof link === 'string' ? link : link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-sm">
            &copy; {new Date().getFullYear()} BataGo. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-white/70 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/70 text-sm hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

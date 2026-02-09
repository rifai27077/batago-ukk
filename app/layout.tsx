import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BataGo - Helps You Live & Travel",
    template: "%s | BataGo",
  },
  description: "Find and book flights, hotels, and travel experiences at the best prices with BataGo. Your trusted travel companion for unforgettable journeys throughout Indonesia and the world.",
  keywords: ["travel", "flights", "hotels", "booking", "vacation", "Indonesia travel", "cheap flights", "hotel booking"],
  authors: [{ name: "BataGo Team" }],
  creator: "BataGo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://batago.com",
    title: "BataGo - Helps You Live & Travel",
    description: "Book flights, hotels, and experiences worldwide at the best price.",
    siteName: "BataGo",
    images: [
      {
        url: "/og-image.jpg", // We need to ensure this exists or use a generic one
        width: 1200,
        height: 630,
        alt: "BataGo Travel Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BataGo - Helps You Live & Travel",
    description: "Book flights, hotels, and experiences worldwide at the best price.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}

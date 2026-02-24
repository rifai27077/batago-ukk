"use client";

import Script from "next/script";

export default function MidtransScript() {
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production";
  
  const scriptUrl = isProduction 
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <Script
      src={scriptUrl}
      data-client-key={midtransClientKey}
      strategy="lazyOnload"
    />
  );
}

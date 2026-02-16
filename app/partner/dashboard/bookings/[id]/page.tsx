"use client";

import { use } from "react";
import BookingDetail from "@/components/partner/dashboard/BookingDetail";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: BookingPageProps) {
  const { id } = use(params);

  return <BookingDetail bookingId={id} />;
}

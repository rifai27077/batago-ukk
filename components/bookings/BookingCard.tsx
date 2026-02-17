"use client";

import { Plane, Bed, Calendar, Clock, MapPin, ChevronRight, FileText, Download, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReviewModal from "@/components/reviews/ReviewModal";

interface BookingProps {
  id: string;
  type: "flight" | "hotel";
  status: "upcoming" | "completed" | "cancelled";
  date: string;
  price: string;
  details: {
    title: string;
    subtitle: string;
    image: string;
    description: string;
    // Flight specific
    airline?: string;
    flightNumber?: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    // Hotel specific
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    rooms?: string;
  };
}

export default function BookingCard({ booking }: { booking: BookingProps }) {
  const isFlight = booking.type === "flight";
  
  const statusColors = {
    upcoming: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
            <Image
              src={booking.details.image}
              alt={booking.details.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              {isFlight ? <Plane className="w-3 h-3" /> : <Bed className="w-3 h-3" />}
              {isFlight ? "Flight" : "Hotel"}
            </div>
          </div>

          {/* Content Section */}
          <div className="grow p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{booking.details.title}</h3>
                  <p className="text-muted text-sm">{booking.details.subtitle}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {isFlight ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <Calendar className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                          <p className="text-xs text-muted">Date</p>
                          <p className="font-semibold text-sm">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <Clock className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                          <p className="text-xs text-muted">Flight Time</p>
                          <p className="font-semibold text-sm">{booking.details.departureTime} - {booking.details.arrivalTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <Plane className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                          <p className="text-xs text-muted">Flight No.</p>
                          <p className="font-semibold text-sm">{booking.details.airline} • {booking.details.flightNumber}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <Calendar className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                          <p className="text-xs text-muted">Check-in</p>
                          <p className="font-semibold text-sm">{booking.details.checkIn}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <Calendar className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                          <p className="text-xs text-muted">Check-out</p>
                          <p className="font-semibold text-sm">{booking.details.checkOut}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                          <MapPin className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                          <p className="text-xs text-muted">Guests & Rooms</p>
                          <p className="font-semibold text-sm">{booking.details.guests} • {booking.details.rooms}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                  <span className="text-xs text-muted">Total Price</span>
                  <span className="font-bold text-lg text-primary">{booking.price}</span>
              </div>
              <div className="flex gap-3">
                   {booking.status === "completed" && (
                      <button 
                        onClick={() => setIsReviewModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors"
                      >
                          <Star className="w-4 h-4" />
                          <span className="hidden sm:inline">Write Review</span>
                      </button>
                   )}
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">E-Ticket</span>
                  </button>
                  <Link href={`/my-bookings/${booking.id}`} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
                      View Details
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        bookingDetails={{
            id: booking.id,
            title: booking.details.title,
            image: booking.details.image
        }}
      />
    </>
  );
}

"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Share2, Heart, Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getHotelDetail, createReview, getToken, HotelResult, RoomTypeResult, ReviewResult } from "@/lib/api";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function parseFeatures(featuresJson: string): string[] {
  try {
    const parsed = JSON.parse(featuresJson);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HotelDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [hotel, setHotel] = useState<HotelResult | null>(null);
  const [rooms, setRooms] = useState<RoomTypeResult[]>([]);
  const [reviews, setReviews] = useState<ReviewResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewBookingId, setReviewBookingId] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      try {
        const res = await getHotelDetail(Number(id));
        setHotel(res.data.hotel);
        setRooms(res.data.rooms || []);
        setReviews(res.data.reviews || []);
      } catch {
        setError("Failed to load hotel details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-64 bg-gray-200 rounded" />
              <div className="h-[400px] bg-gray-200 rounded-3xl" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="h-32 bg-gray-100 rounded-xl" />
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl" />)}
                  </div>
                </div>
                <div className="h-64 bg-gray-100 rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-lg font-bold text-foreground mb-2">{error || "Hotel not found"}</p>
            <Link href="/stays" className="text-primary font-bold hover:underline">Back to Search</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hotelImages = hotel.images?.length > 0
    ? hotel.images.map(img => img.url)
    : [FALLBACK_IMAGE];

  const lowestPrice = rooms.length > 0
    ? Math.min(...rooms.map(r => r.base_price))
    : 0;

  const facilities = hotel.facilities || [];
  const avgRating = hotel.rating || 0;
  const totalReviews = hotel.total_reviews || 0;

  const ratingLabel = avgRating >= 4.5 ? "Exceptional" : avgRating >= 4 ? "Very Good" : avgRating >= 3 ? "Good" : "Fair";

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-6">
            <Breadcrumbs items={[
              { label: "Home", href: "/" },
              { label: "Stays", href: "/stays" },
              { label: hotel.name },
            ]} />
          </div>

          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                  {avgRating >= 4.5 ? "5 Stars" : avgRating >= 3.5 ? "4 Stars" : "3 Stars"}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-gray-900">{avgRating.toFixed(1)}</span> ({totalReviews} reviews)
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{hotel.address || `${hotel.city?.name}, ${hotel.city?.country || "Indonesia"}`}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              {rooms.length > 0 && (
                <Link href={`/stays/book/${id}?room=${rooms[0].ID}`} className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-primary/20">
                  Book Now
                </Link>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px] mb-12 rounded-3xl overflow-hidden">
            <div className="md:col-span-2 md:row-span-2 relative h-[300px] md:h-auto group cursor-pointer">
              <Image 
                src={hotelImages[0]} 
                alt={hotel.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                priority
              />
            </div>
            <div className="hidden md:grid grid-cols-2 col-span-2 row-span-2 gap-4">
               {hotelImages.slice(1, 5).map((img, idx) => (
                 <div key={idx} className="relative h-full group cursor-pointer overflow-hidden rounded-xl">
                    <Image 
                      src={img} 
                      alt={`${hotel.name} Gallery ${idx + 1}`} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Overview */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {hotel.description || "A wonderful place to stay with excellent amenities and service."}
                </p>
              </section>

              {/* Facilities / Amenities */}
              {facilities.length > 0 && (
                <section className="py-8 border-y border-gray-100">
                  <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {facilities.map((facility, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-lg">
                          {facility.icon || "✓"}
                        </div>
                        <span className="font-medium text-gray-700">{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Available Rooms */}
              {rooms.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
                  <div className="space-y-6">
                    {rooms.map((room) => {
                      const features = parseFeatures(room.features);
                      const roomImage = room.images?.[0]?.url || FALLBACK_IMAGE;
                      
                      return (
                        <div key={room.ID} className="border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all duration-300">
                          <div className="w-full md:w-64 h-48 relative rounded-xl overflow-hidden shrink-0">
                            <Image src={roomImage} alt={room.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                             <div>
                               <div className="flex justify-between items-start mb-2">
                                 <h3 className="text-xl font-bold">{room.name}</h3>
                               </div>
                               {features.length > 0 && (
                                 <div className="flex flex-wrap gap-2 mb-4">
                                   {features.map((feat, i) => (
                                     <span key={i} className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                                       {feat}
                                     </span>
                                   ))}
                                 </div>
                               )}
                               <div className="space-y-1 text-sm text-gray-500">
                                 <p>• {room.size_m2} m²</p>
                                 <p>• Sleeps {room.max_guests} guests</p>
                                 {room.description && <p>• {room.description}</p>}
                               </div>
                             </div>
                             
                             <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-100">
                               <div>
                                 <p className="text-sm text-gray-500 line-through mb-1">{formatPrice(room.base_price * 1.2)}</p>
                                 <p className="text-2xl font-bold text-primary">{formatPrice(room.base_price)}</p>
                                 <p className="text-xs text-gray-500">/ night includes taxes</p>
                               </div>
                               <Link href={`/stays/book/${id}?room=${room.ID}`} className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-primary/20">
                                 Select Room
                               </Link>
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Reviews */}
              <section className="py-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-2xl font-bold">Reviews</h2>
                   <button 
                     onClick={() => setShowReviewForm(!showReviewForm)}
                     className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                   >
                      {showReviewForm ? "Cancel" : "Give a Review"}
                   </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                    {!getToken() ? (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">Please login to submit a review.</p>
                        <Link href="/login" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                          Login
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg">Write a Review</h3>
                        {reviewError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{reviewError}</p>}
                        {reviewSuccess && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{reviewSuccess}</p>}
                        
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Booking ID *</label>
                          <input 
                            type="number" 
                            value={reviewBookingId} 
                            onChange={(e) => setReviewBookingId(e.target.value)}
                            placeholder="Enter your booking ID" 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button 
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className="p-1"
                              >
                                <Star className={`w-7 h-7 transition-colors ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Comment</label>
                          <textarea 
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience..." 
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                          />
                        </div>

                        <button 
                          onClick={async () => {
                            if (!reviewBookingId) { setReviewError("Booking ID is required."); return; }
                            if (!reviewComment.trim()) { setReviewError("Please write a comment."); return; }
                            setIsSubmittingReview(true);
                            setReviewError("");
                            setReviewSuccess("");
                            try {
                              await createReview(Number(reviewBookingId), reviewRating, reviewComment);
                              setReviewSuccess("Review submitted successfully! Thank you.");
                              setReviewComment("");
                              setReviewBookingId("");
                              setReviewRating(5);
                              // Refresh reviews
                              const res = await getHotelDetail(Number(id));
                              setReviews(res.data.reviews || []);
                            } catch (err: unknown) {
                              setReviewError(err instanceof Error ? err.message : "Failed to submit review.");
                            } finally {
                              setIsSubmittingReview(false);
                            }
                          }}
                          disabled={isSubmittingReview}
                          className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmittingReview ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Review"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{ratingLabel}</div>
                        <div className="text-sm text-gray-500">Based on {totalReviews} reviews</div>
                      </div>
                   </div>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => {
                      const initials = review.user?.name
                        ? review.user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
                        : "??";
                      const reviewDate = new Date(review.CreatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" });
                      
                      return (
                        <div key={review.ID} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">{initials}</div>
                            <div>
                              <p className="font-bold text-sm">{review.user?.name || "Anonymous"}</p>
                              <p className="text-xs text-gray-500">Reviewed in {reviewDate}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                              <Star className="w-3 h-3 fill-current" /> {review.rating.toFixed(1)}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            &quot;{review.comment}&quot;
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this hotel!</p>
                )}
              </section>

            </div>

             {/* Sticky Sidebar */}
             <div className="block lg:col-span-1">
                <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-200/50">
                   <div className="flex items-center justify-between mb-6">
                      <p className="text-sm font-bold text-gray-500">Starting from</p>
                      <div className="text-right">
                         <p className="text-2xl font-bold text-primary">{lowestPrice > 0 ? formatPrice(lowestPrice) : "N/A"}</p>
                         <p className="text-xs text-gray-400">/ night</p>
                      </div>
                   </div>

                   {rooms.length > 0 && (
                     <Link 
                       href={`/stays/book/${id}?room=${rooms[0].ID}`} 
                       className="w-full block bg-primary hover:bg-primary/90 text-white font-bold text-center py-4 rounded-xl mb-4 transition-all shadow-lg shadow-primary/20"
                     >
                       Book Now
                     </Link>
                   )}
                   
                   <p className="text-center text-xs text-gray-500 mb-6 font-medium">You won&apos;t be charged yet</p>

                   <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                         <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                         <div>
                            <p className="text-sm font-bold text-gray-900">Free Cancellation</p>
                            <p className="text-xs text-gray-500">Cancel up to 24 hours before check-in</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                         <div>
                            <p className="text-sm font-bold text-gray-900">Best Price Guarantee</p>
                            <p className="text-xs text-gray-500">Find a lower price? We&apos;ll match it.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { createReview } from "@/lib/api";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    title: string;
    image: string;
    id: string;
  };
}

export default function ReviewModal({ isOpen, onClose, bookingDetails }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        await createReview(Number(bookingDetails.id), rating, comment);
        alert("Review submitted successfully! Thank you for your feedback.");
        setRating(0);
        setComment("");
        onClose();
    } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="font-bold text-lg">Write a Review</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Booking Summary */}
            <div className="p-4 flex items-center gap-4 bg-gray-50 border-b border-gray-100">
                 <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image 
                        src={bookingDetails.image} 
                        alt={bookingDetails.title} 
                        fill 
                        className="object-cover" 
                    />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-foreground line-clamp-1">{bookingDetails.title}</h3>
                    <p className="text-xs text-muted">Booking ID: {bookingDetails.id}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">Completed</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating Stars */}
                <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">How was your experience?</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star 
                                    className={`w-8 h-8 ${
                                        (hoveredRating || rating) >= star 
                                            ? "fill-yellow-400 text-yellow-400" 
                                            : "fill-gray-100 text-gray-300"
                                    } transition-colors`} 
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-muted font-medium h-4">
                        {rating === 1 && "Terrible"}
                        {rating === 2 && "Poor"}
                        {rating === 3 && "Average"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent!"}
                    </p>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label htmlFor="comment" className="text-sm font-semibold text-gray-700">
                        Tell us more (optional)
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none"
                        placeholder="What did you like or dislike?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Submit Review"
                    )}
                </button>
            </form>
        </div>
    </div>
  );
}

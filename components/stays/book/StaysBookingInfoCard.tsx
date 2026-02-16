import Image from "next/image";
import { Star, ShieldCheck, MapPin } from "lucide-react";

export default function StaysBookingInfoCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 h-fit sticky top-24 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Your Stay</h3>
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
            Luxury Room
        </span>
      </div>

      {/* Hotel Info */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-20 h-20 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
           <Image 
             src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
             alt="The Ritz-Carlton Bali" 
             fill 
             className="object-cover" 
           />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-lg leading-tight mb-1">The Ritz-Carlton Bali</h4>
          <div className="flex items-center gap-1 text-sm text-muted mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Nusa Dua, Bali</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-foreground">4.8</span>
            <span className="text-xs text-muted">(1240 reviews)</span>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="space-y-4 mb-6">
         <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <div>
                <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Check-in</p>
                <p className="font-bold text-foreground">Thu, 15 May 2026</p>
                <p className="text-xs text-muted">From 14:00</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-right">
                <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Check-out</p>
                <p className="font-bold text-foreground">Tue, 20 May 2026</p>
                <p className="text-xs text-muted">Before 12:00</p>
            </div>
         </div>
         <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <div>
                <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Total Stay</p>
                <p className="font-bold text-foreground">5 Nights</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Guests</p>
                <p className="font-bold text-foreground">2 Guests, 1 Room</p>
            </div>
         </div>
      </div>

      {/* Promo Code selection (simplified) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-foreground tracking-wider">Promo Code</label>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter code" 
            className="w-full px-3 py-2.5 text-sm border border-dashed border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-gray-50/50 font-medium uppercase"
          />
          <button className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10">
            Apply
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Base Fare (5 nights)</span>
          <span className="font-semibold text-foreground">Rp 22.500.000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Discount</span>
          <span className="font-semibold text-green-600">-Rp 1.000.000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Taxes & Fees</span>
          <span className="font-semibold text-foreground">Rp 2.500.000</span>
        </div>
        <div className="h-px bg-gray-200/50 my-2"></div>
        <div className="flex justify-between items-end">
          <span className="text-foreground font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">Rp 24.000.000</span>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg mb-6">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
            <p className="text-xs font-bold text-green-800">Free Cancellation</p>
            <p className="text-[10px] text-green-700 leading-tight mt-0.5">Cancel up to 24 hours before check-in for a full refund.</p>
        </div>
      </div>

      <button className="w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-95 transition-all">
        Complete Booking
      </button>

    </div>
  );
}

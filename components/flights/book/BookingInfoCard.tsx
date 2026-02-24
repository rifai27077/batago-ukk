import Image from "next/image";
import { Star, Clock, ShieldCheck, Loader2, Check, Tag } from "lucide-react";
import { useState } from "react";
import { validatePromoCode, FlightResult } from "@/lib/api";
import toast from "react-hot-toast";

interface BookingInfoCardProps {
  flight: FlightResult;
  selectedClass: string;
  onBooking: () => void;
  isSubmitting: boolean;
  onDiscountApplied?: (discount: number, code: string) => void;
}

export default function BookingInfoCard({ 
  flight, 
  selectedClass, 
  onBooking, 
  isSubmitting,
  onDiscountApplied
}: BookingInfoCardProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{name: string, discount: number} | null>(null);

  const selectedSeat = flight?.seats?.find(
    (s) => s.class.toLowerCase() === selectedClass.toLowerCase()
  ) || flight?.seats?.[0];

  const basePrice = selectedSeat?.price || 0;
  const discountAmount = appliedPromo ? Math.round(basePrice * (appliedPromo.discount / 100)) : 0;
  const tax = Math.round((basePrice - discountAmount) * 0.11);
  const total = basePrice - discountAmount + tax;

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsValidating(true);
    try {
      const res = await validatePromoCode(promoCode);
      setAppliedPromo({ name: res.name, discount: res.discount });
      if (onDiscountApplied) onDiscountApplied(res.discount, promoCode);
      toast.success(`Promo applied: ${res.discount}% off!`);
    } catch (err: any) {
      toast.error(err.message || "Invalid promo code");
    } finally {
      setIsValidating(false);
    }
  };

  const formatPrice = (amount: number) => `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 h-fit sticky top-24 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Your Flight</h3>
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full capitalize">
            {selectedClass}
        </span>
      </div>

      {/* Airline Info */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
           <Image 
             src="https://www.vectorlogo.zone/logos/emirates/emirates-icon.svg" 
             alt={flight?.airline || "Airline"} 
             fill 
             className="object-contain p-2" 
           />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-lg">{flight?.partner?.company_name || flight?.airline}</h4>
          <p className="text-sm text-muted">{flight?.flight_number}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-foreground">4.8</span>
            <span className="text-xs text-muted">(54 reviews)</span>
          </div>
        </div>
      </div>

      {/* Flight Timeline */}
      <div className="space-y-0 mb-6 relative">
         {/* Departure */}
        <div className="relative pl-8 pb-8">
            <div className="absolute left-[3px] top-2 bottom-0 w-[2px] bg-gray-100"></div>
            <div className="absolute left-[-2px] top-2 w-3 h-3 rounded-full border-2 border-foreground bg-white z-10 box-border"></div>
            
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-foreground leading-none">{formatTime(flight?.departure_time)}</p>
                    <p className="text-xs text-muted mt-1">{formatDate(flight?.departure_time)}</p>
                </div>
                 <div className="text-right">
                    <p className="font-bold text-foreground">{flight?.departure_airport?.city} ({flight?.departure_airport?.code})</p>
                    <p className="text-xs text-muted">{flight?.departure_airport?.name}</p>
                </div>
             </div>
        </div>

        {/* Duration */}
         <div className="absolute top-[35%] left-6 z-10">
             <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted tracking-wider bg-white py-1 pr-2">
                <Clock className="w-3 h-3" />
                <span>{formatDuration(flight?.duration)}</span>
             </div>
         </div>

         {/* Arrival */}
        <div className="relative pl-8">
            <div className="absolute left-[3px] top-0 h-2 w-[2px] bg-gray-100"></div>
            <div className="absolute left-[-2px] top-2 w-3 h-3 rounded-full bg-foreground z-10 border-2 border-transparent"></div>
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-foreground leading-none">{formatTime(flight?.arrival_time)}</p>
                    <p className="text-xs text-muted mt-1">{formatDate(flight?.arrival_time)}</p>
                </div>
                 <div className="text-right">
                    <p className="font-bold text-foreground">{flight?.arrival_airport?.city} ({flight?.arrival_airport?.code})</p>
                    <p className="text-xs text-muted">{flight?.arrival_airport?.name}</p>
                </div>
             </div>
        </div>
      </div>

      {/* Promo Code selection */}
      <div className="mb-6">
        <label className="text-xs font-bold text-foreground tracking-wider uppercase block mb-2">Promo Code</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter code" 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            disabled={!!appliedPromo}
            className={`w-full px-3 py-2.5 text-sm border border-dashed rounded-xl focus:ring-2 focus:ring-primary/10 outline-none bg-gray-50/50 font-bold uppercase transition-all ${
              appliedPromo ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 focus:border-primary'
            }`}
          />
          {appliedPromo ? (
            <button 
              onClick={() => {setAppliedPromo(null); setPromoCode("");}}
              className="px-4 py-2.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Clear
            </button>
          ) : (
            <button 
              onClick={handleApplyPromo}
              disabled={isValidating || !promoCode}
              className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
            </button>
          )}
        </div>
        {appliedPromo && (
          <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1 uppercase tracking-wider">
            <Check className="w-3 h-3" /> {appliedPromo.name} applied
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Base Fare</span>
          <span className="font-semibold text-foreground">{formatPrice(basePrice)}</span>
        </div>
        {appliedPromo && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1"><Tag className="w-3 h-3" /> Discount ({appliedPromo.discount}%)</span>
            <span className="font-semibold text-green-600">-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted">Taxes & Fees (11%)</span>
          <span className="font-semibold text-foreground">{formatPrice(tax)}</span>
        </div>
        <div className="h-px bg-gray-200/50 my-2"></div>
        <div className="flex justify-between items-end">
          <span className="text-foreground font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg mb-6">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
            <p className="text-xs font-bold text-green-800">Free Cancellation</p>
            <p className="text-[10px] text-green-700 leading-tight mt-0.5">Cancel up to 24 hours before departure for a full refund.</p>
        </div>
      </div>

      <button 
        onClick={onBooking}
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
        ) : (
          "Complete Booking"
        )}
      </button>

    </div>
  );
}

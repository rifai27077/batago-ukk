import Image from "next/image";
import { Star, Clock, ShieldCheck } from "lucide-react";

export default function BookingInfoCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 h-fit sticky top-24 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Your Flight</h3>
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
            Economy
        </span>
      </div>

      {/* Airline Info */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
           <Image 
             src="https://www.vectorlogo.zone/logos/emirates/emirates-icon.svg" 
             alt="Emirates" 
             fill 
             className="object-contain p-2" 
           />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-lg">Emirates</h4>
          <p className="text-sm text-muted">Airbus A380 • EK-202</p>
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
            {/* Connecting Line */}
            <div className="absolute left-[3px] top-2 bottom-0 w-[2px] bg-gray-100"></div>
            {/* Dot */}
            <div className="absolute left-[-2px] top-2 w-3 h-3 rounded-full border-2 border-foreground bg-white z-10 box-border"></div>
            
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-foreground leading-none">12:00 pm</p>
                    <p className="text-xs text-muted mt-1">Fri, 24 May</p>
                </div>
                 <div className="text-right">
                    <p className="font-bold text-foreground">Newark (EWR)</p>
                    <p className="text-xs text-muted">Terminal A</p>
                </div>
             </div>
        </div>

        {/* Duration Label in between */}
         <div className="absolute top-[35%] left-6 z-10">
             <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted tracking-wider bg-white py-1 pr-2">
                <Clock className="w-3 h-3" />
                <span>2h 28m</span>
             </div>
         </div>

         {/* Arrival */}
        <div className="relative pl-8">
            <div className="absolute left-[3px] top-0 h-2 w-[2px] bg-gray-100"></div>
            <div className="absolute left-[-2px] top-2 w-3 h-3 rounded-full bg-foreground z-10 border-2 border-transparent"></div>
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-foreground leading-none">01:28 pm</p>
                    <p className="text-xs text-muted mt-1">Fri, 24 May</p>
                </div>
                 <div className="text-right">
                    <p className="font-bold text-foreground">New York (JFK)</p>
                    <p className="text-xs text-muted">Terminal 4</p>
                </div>
             </div>
        </div>
      </div>

      {/* Promo Code & Voucher Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-foreground tracking-wider">Promo Code</label>
          <button className="text-xs font-medium text-primary hover:underline tracking-tighter">
            View Available Vouchers
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Enter code" 
              className="w-full px-3 py-2.5 text-sm border border-dashed border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none bg-gray-50/50 font-medium uppercase placeholder:normal-case placeholder:font-normal"
            />
          </div>
          <button className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10">
            Apply
          </button>
        </div>

        {/* Quick Voucher Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 cursor-pointer border border-primary/20 bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
            <p className="text-xs font-bold text-primary uppercase">BATA40OFF</p>
            <p className="text-xs text-muted">40% Discount</p>
          </div>
          <div className="flex-shrink-0 cursor-pointer border border-gray-100 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <p className="text-xs font-bold text-foreground uppercase">NEWUSER</p>
            <p className="text-xs text-muted">Rp 50k Off</p>
          </div>
          <div className="flex-shrink-0 cursor-pointer border border-gray-100 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <p className="text-xs font-bold text-foreground uppercase">TRAVEL2026</p>
            <p className="text-xs text-muted">10% Off</p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Base Fare</span>
          <span className="font-semibold text-foreground">Rp 1.100.000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Discount</span>
          <span className="font-semibold text-green-600">-Rp 50.000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Taxes & Fees</span>
          <span className="font-semibold text-foreground">Rp 150.000</span>
        </div>
        <div className="h-px bg-gray-200/50 my-2"></div>
        <div className="flex justify-between items-end">
          <span className="text-foreground font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">Rp 1.200.000</span>
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

      <button className="w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-95 transition-all">
        Complete Booking
      </button>

    </div>
  );
}

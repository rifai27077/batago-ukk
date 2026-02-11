import Image from "next/image";

export default function BookingInfoCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
      <h3 className="text-xl font-bold text-foreground mb-4">Flight Summary</h3>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 relative rounded-full overflow-hidden border border-gray-100">
           <Image 
             src="https://www.vectorlogo.zone/logos/emirates/emirates-icon.svg" 
             alt="Emirates" 
             fill 
             className="object-contain p-1" 
           />
        </div>
        <div>
          <p className="font-bold text-foreground">Emirates</p>
          <p className="text-sm text-muted">Airbus A380</p>
        </div>
      </div>

      <div className="relative pl-4 border-l-2 border-dashed border-gray-200 space-y-6 mb-6">
        <div className="relative">
          <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-foreground" />
          <p className="text-sm font-bold text-foreground">12:00 pm</p>
          <p className="text-xs text-muted">Newark (EWR)</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-foreground border-2 border-white ring-1 ring-foreground" />
          <p className="text-sm font-bold text-foreground">01:28 pm</p>
          <p className="text-xs text-muted">New York (JFK)</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Base Fare</span>
          <span className="font-semibold text-foreground">Rp 1.100.000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Taxes & Fees</span>
          <span className="font-semibold text-foreground">Rp 150.000</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2 mt-2">
          <span className="text-foreground">Total</span>
          <span className="text-primary">Rp 1.250.000</span>
        </div>
      </div>
    </div>
  );
}

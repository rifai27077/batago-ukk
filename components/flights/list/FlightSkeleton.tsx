export default function FlightSkeleton() {
  return (
    <div className="bg-white rounded-[12px] shadow-[0_4px_16px_rgba(17,34,17,0.05)] p-0 flex flex-col lg:flex-row overflow-hidden border border-foreground/5 animate-pulse">
      {/* Airline Logo Section Skeleton */}
      <div className="p-6 lg:p-8 flex items-center justify-center lg:w-48 shrink-0 border-b lg:border-b-0 lg:border-r border-foreground/5 bg-gray-50/50">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
        <div className="flex items-start justify-between mb-8">
           <div className="flex items-center gap-3">
                <div className="w-8 h-6 bg-gray-200 rounded"></div>
                <div className="w-20 h-5 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-100 rounded"></div>
           </div>
           <div className="hidden lg:block text-right">
                <div className="w-16 h-3 bg-gray-100 rounded mb-2 ml-auto"></div>
                <div className="w-24 h-7 bg-gray-200 rounded"></div>
           </div>
        </div>

        <div className="space-y-6">
             {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div>
                            <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="w-20 h-3 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    <div className="text-right">
                        <div className="w-16 h-4 bg-gray-200 rounded mb-1 ml-auto"></div>
                        <div className="w-12 h-3 bg-gray-100 rounded ml-auto"></div>
                    </div>
                </div>
             ))}
        </div>

        <div className="mt-8 pt-8 border-t border-foreground/5 flex items-center gap-4">
             <div className="w-12 h-12 bg-gray-200 rounded-[4px]"></div>
             <div className="flex-1 h-12 bg-gray-200 rounded-[4px]"></div>
        </div>
      </div>
    </div>
  );
}

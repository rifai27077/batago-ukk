export default function StaysSkeleton() {
  return (
    <div className="bg-white rounded-[12px] shadow-[0_4px_16px_rgba(17,34,17,0.05)] p-0 flex flex-col lg:flex-row overflow-hidden border border-foreground/5 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full lg:w-[300px] h-48 lg:h-auto bg-gray-200 shrink-0"></div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 lg:p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="w-full">
                <div className="w-3/4 h-7 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <div className="w-1/2 h-4 bg-gray-100 rounded"></div>
                </div>
                <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    ))}
                    <div className="w-16 h-3 bg-gray-100 rounded ml-2"></div>
                </div>
                
                <div className="flex gap-2">
                    <div className="w-16 h-5 bg-gray-100 rounded"></div>
                    <div className="w-16 h-5 bg-gray-100 rounded"></div>
                    <div className="w-16 h-5 bg-gray-100 rounded"></div>
                </div>
            </div>

            <div className="hidden lg:block text-right">
                <div className="w-16 h-3 bg-gray-100 rounded mb-2 ml-auto"></div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
            </div>
        </div>

        <div className="mt-6 pt-6 border-t border-foreground/5 flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-200 rounded-[4px]"></div>
             <div className="flex-1 h-10 bg-gray-200 rounded-[4px]"></div>
        </div>
      </div>
    </div>
  );
}

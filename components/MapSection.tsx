import Link from "next/link";
import { MapPin as MapPinIcon } from "lucide-react";

const MapPin = ({ top, left, cityName, country }: { top: string; left: string; cityName: string; country: string }) => (
  <div 
    className="absolute flex items-center gap-2 animate-bounce-slow hover:z-20 group cursor-pointer"
    style={{ top, left }}
  >
    {/* Dot */}
    <div className="w-3 h-3 bg-white rounded-full shadow-lg ring-4 ring-white/30 z-10" />
    
    {/* Card */}
    <div className="bg-white p-2 rounded-xl shadow-xl flex items-center gap-3 absolute bottom-6 left-1/2 -translate-x-1/2 min-w-[120px] opacity-100 transition-all duration-300 scale-100 origin-bottom group-hover:scale-110">
        <div className="w-8 h-8 rounded-full bg-[#14b8a6]/10 flex items-center justify-center shrink-0">
           <MapPinIcon className="w-4 h-4 text-[#14b8a6]" />
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 leading-tight">{cityName}</span>
            <span className="text-[10px] text-gray-500 leading-tight">{country}</span>
        </div>
    </div>
  </div>
);

async function getPopularCities() {
  try {
    // Next.js fetch with revalidation
    const res = await fetch('http://localhost:8080/v1/cities?popular=true', { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch cities for MapSection:", error);
    return [];
  }
}

export default async function MapSection() {
  const cities = await getPopularCities();
  
  // Distribute cities across sensible world map coordinates
  const pinCoordinates = [
    { top: "60%", left: "80%" }, // Asia/Oceania
    { top: "50%", left: "35%" }, // Europe/Middle East
    { top: "35%", left: "20%" }, // North America
    { top: "25%", left: "70%" }, // Far East / Japan
    { top: "48%", left: "45%" }, // Middle East / India
  ];
  return (
    <section className="bg-[#14b8a6] py-20 relative overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end mb-16 relative z-10">
            <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let&apos;s go places together</h2>
                 <p className="text-white text-sm md:text-base">
                    Discover the latest offers and news and start planning your next trip with us.
                </p>
            </div>
            <Link href="#" className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition-colors text-sm font-semibold mt-4 md:mt-0">
                See All
            </Link>
        </div>

        {/* Map Background */}
        <div className="relative w-full h-[500px] mt-8">
            <div className="absolute inset-0 opacity-20" 
                style={{
                    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain', 
                    filter: 'invert(1) brightness(2)'
                }}
            />
            {/* Dots Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-size-[20px_20px]" />

            {/* Pins */}
            <div className="relative max-w-7xl mx-auto h-full hidden md:block">
                {cities.slice(0, 5).map((city: any, idx: number) => {
                    const coords = pinCoordinates[idx % pinCoordinates.length];
                    return (
                        <MapPin 
                            key={city.ID}
                            top={coords.top} 
                            left={coords.left} 
                            cityName={city.name} 
                            country={city.country}
                        />
                    );
                })}
                {/* Fallback if no database seeded */}
                {cities.length === 0 && (
                   <MapPin 
                      top="60%" left="80%" 
                      cityName="Bali" country="Indonesia"
                   />
                )}
            </div>
        </div>
    </section>
  );
}

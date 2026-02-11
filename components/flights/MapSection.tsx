import Image from "next/image";
import Link from "next/link";

const MapPin = ({ top, left, user, avatar }: { top: string; left: string; user: string; avatar: string }) => (
  <div 
    className="absolute flex items-center gap-2 animate-bounce-slow hover:z-20 group"
    style={{ top, left }}
  >
    {/* Dot */}
    <div className="w-3 h-3 bg-white rounded-full shadow-lg ring-4 ring-white/30 z-10" />
    
    {/* Card */}
    <div className="bg-white p-2 rounded-xl shadow-xl flex items-center gap-3 absolute bottom-6 left-1/2 -translate-x-1/2 min-w-[140px] opacity-100 transition-all duration-300 scale-100 origin-bottom">
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image src={avatar} alt={user} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-900 leading-tight">{user}</span>
            <span className="text-[8px] text-gray-500 leading-tight">Boarding Pass N&apos;123</span>
        </div>
    </div>
  </div>
);

export default function MapSection() {
  return (
    <section className="bg-[#14b8a6] py-20 relative overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end mb-16 relative z-10">
            <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Let&apos;s go places together</h2>
                 <p className="text-gray-800 text-sm md:text-base">
                    Discover the latest offers and news and start planning your next trip with us.
                </p>
            </div>
            <Link href="#" className="border border-gray-900 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-900 hover:text-white transition-colors text-sm font-semibold mt-4 md:mt-0">
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
                 <MapPin 
                    top="30%" 
                    left="20%" 
                    user="James Doe" 
                    avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" 
                />
                <MapPin 
                    top="50%" 
                    left="35%" 
                    user="James Doe" 
                    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
                />
                <MapPin 
                    top="25%" 
                    left="70%" 
                    user="James Doe" 
                    avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" 
                />
                 <MapPin 
                    top="60%" 
                    left="80%" 
                    user="James Doe" 
                    avatar="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop" 
                />
            </div>
        </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

const destinations = [
  {
    city: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800",
    priceFrom: 1200000,
  },
  {
    city: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800",
    priceFrom: 4500000,
  },
  {
    city: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800",
    priceFrom: 1800000,
  },
  {
    city: "Bangkok",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800",
    priceFrom: 950000,
  },
  {
    city: "Sydney",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800",
    priceFrom: 5200000,
  },
  {
    city: "Seoul",
    country: "South Korea",
    image: "https://images.unsplash.com/photo-1630229446420-991180f9b69f?q=80&w=800",
    priceFrom: 3800000,
  },
  {
    city: "Kuala Lumpur",
    country: "Malaysia",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800",
    priceFrom: 850000,
  },
  {
    city: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    priceFrom: 6500000,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

interface DestinationItem {
  city: string;
  country: string;
  image: string;
  priceFrom: number;
}

interface DestinationsProps {
  title?: string;
  description?: string;
  items?: DestinationItem[];
}

export default function Destinations({ 
  title = "Popular Destinations", 
  description = "Explore top destinations with the best deals for your dream vacation",
  items = destinations 
}: DestinationsProps) {
  return (
    <section className="pt-32 pb-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {title}
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Grid - Featured Large Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {items.slice(0, 4).map((dest) => (
            <Link
              key={dest.city}
              href="#"
              className="group relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg block"
            >
              <Image
                src={dest.image}
                alt={`${dest.city}, ${dest.country}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient Overlay - Darkens on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content Container - Slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white/80 text-sm mb-1">{dest.country}</p>
                <h3 className="font-bold text-white text-2xl mb-2">
                  {dest.city}
                </h3>
                
                {/* Price & Action - Reveals/Fades in on hover */}
                <div className="flex items-center justify-between border-t border-white/20 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <div>
                    <span className="text-xs text-white/60 block">From</span>
                    <span className="text-primary font-bold text-base">
                      {formatPrice(dest.priceFrom)}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center">
                    <svg className="w-4 h-4 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Grid - Smaller Cards - Only show if there are more than 4 items */}
        {items.length > 4 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.slice(4).map((dest) => (
              <Link
                key={dest.city}
                href="#"
                className="group relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg block"
              >
                <Image
                  src={dest.image}
                  alt={`${dest.city}, ${dest.country}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content Container */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-white text-lg">
                    {dest.city}
                  </h3>
                  <p className="text-white/80 text-xs mb-2">{dest.country}</p>
                  
                  {/* Price - Reveals on hover */}
                  <div className="flex items-center gap-2 border-t border-white/20 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className="text-xs text-white/60">From</span>
                     <span className="text-primary font-bold text-sm">
                      {formatPrice(dest.priceFrom)}
                     </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* See All Button */}
        <div className="text-center mt-12">
          <Link
            href="#"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            View All Destinations
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

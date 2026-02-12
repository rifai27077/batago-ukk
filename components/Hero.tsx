import Image from "next/image";
import Header from "./Header";

interface HeroProps {
  backgroundImage?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode; // For the search form
}

export default function Hero({
  backgroundImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
  title,
  subtitle,
  children
}: HeroProps) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/40" />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-48 px-6">
        {title || (
            <>
                <p className="text-white/90 text-lg md:text-xl font-light mb-2 tracking-wide animate-fade-in-up">
                Helping Others
                </p>
                <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in-up delay-200">
                LIVE & TRAVEL
                </h1>
            </>
        )}
        {subtitle || (
             <p className="text-white/80 text-sm md:text-base max-w-md animate-fade-in-up delay-400">
                Book flights, hotels, and experiences worldwide at the best price.
            </p>
        )}
      </div>

      {/* Search Form - Controlled Overlap */}
      <div className="relative z-20 px-6 -mt-32 mb-12">
        {children}
      </div>
    </section>
  );
}

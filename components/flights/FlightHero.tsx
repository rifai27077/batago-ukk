import Image from "next/image";
import Header from "../Header";
import FlightSearchForm from "./FlightSearchForm";

export default function FlightHero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-full">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"
          alt="Airplane at sunset"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Helper gradient for text readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent" />
      </div>

      <Header />

      {/* Hero Content */}
      <div className="relative z-10 grow flex flex-col justify-center px-6 max-w-7xl mx-auto w-full pt-32 pb-48">
        <div className="max-w-2xl">
          <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
            Make your travel whishlist, we&apos;ll do the rest
          </h1>
          <p className="text-white text-lg font-medium drop-shadow-md">
            Special offers to suit your plan
          </p>
        </div>
      </div>

      {/* Search Form - Overlapping Section */}
      <div className="relative z-20 px-6 -mt-32 mb-12 w-full max-w-7xl mx-auto">
        <FlightSearchForm />
      </div>
    </section>
  );
}

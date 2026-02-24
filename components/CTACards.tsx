import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    title: "Flights",
    description: "Search Flights & Places Hire to our most popular destinations",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800",
    buttonText: "Show Flights",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    title: "Hotels",
    description: "Search Hotels & Places Hire to our most popular destinations",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
    buttonText: "Show Hotels",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function CTACards() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-y border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.title === "Flights" ? "/flights" : "/stays"}
            className="relative h-[400px] md:h-[450px] rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 block"
          >
            {/* Background Image - Scale on hover */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay - Darkens on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Content Container - Slides up on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
              {/* Title - Always visible */}
              <h3 className="text-white text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                {card.title}
              </h3>
              
              {/* Description - Fades in on hover */}
              <p className="text-white/80 text-base md:text-lg max-w-sm mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 transform translate-y-4 group-hover:translate-y-0">
                {card.description}
              </p>
              
              {/* Button - Revealed on hover with glow */}
              <div className="flex items-center justify-between border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <span className="inline-flex items-center gap-3 text-primary font-bold text-lg">
                  {card.icon}
                  {card.buttonText}
                </span>
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-shadow duration-300">
                  <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

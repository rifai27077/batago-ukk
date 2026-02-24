import Image from "next/image";
import Link from "next/link";

const reviews = [
  {
    quote: "A real sense of community, nurtured",
    description:
      "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for helping me!",
    author: "Olga",
    role: "Weaver Studios - Kai Tak",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
  },
  {
    quote: "The facilities are superb. Clean, slick, bright.",
    description:
      "A real sense of community. I commend those who really appreciate the help from Katie for helping them reach it.",
    author: "Thomas",
    role: "Weaver Studios - Tsumami",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
  },
  {
    quote: "A real sense of community, nurtured",
    description:
      "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for helping me!",
    author: "Eliot",
    role: "Weaver Studios - Kai Tak",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-y border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Reviews
          </h2>
          <p className="text-muted text-sm">
            What people says about BataGo
          </p>
        </div>
        {/* <Link
          href="#"
          className="border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          See All
        </Link> */}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-foreground text-lg mb-2">
                &ldquo;{review.quote}&rdquo;
              </h3>
              <p className="text-muted text-sm mb-4">{review.description}</p>
              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} />
              </div>
              <div className="mt-4">
                <p className="font-semibold text-foreground">{review.author}</p>
                <p className="text-muted text-sm">{review.role}</p>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-48">
              <Image
                src={review.image}
                alt={review.author}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

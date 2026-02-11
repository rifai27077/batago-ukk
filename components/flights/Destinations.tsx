import Image from "next/image";
import Link from "next/link";

const DestinationCard = ({ city, title, price, image }: { city: string, title: string, price: string, image: string }) => (
  <div className="group relative rounded-3xl overflow-hidden aspect-3/4 cursor-pointer">
    <Image
      src={image}
      alt={city}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90" />
    
    <div className="absolute bottom-0 w-full p-6 text-white transform transition-transform duration-500 ease-in-out group-hover:-translate-y-2">
      <h3 className="text-2xl font-bold mb-1">{city}</h3>
      <p className="text-sm font-light mb-4 opacity-90 uppercase tracking-wider">{title}</p>
      <div className="font-bold text-xl mb-6">Rp. {price}</div>
      
      <button className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white font-semibold py-3 rounded-xl transition-all opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300">
        Book Flight
      </button>
    </div>
  </div>
);

export default function Destinations() {
  const destinations = [
    {
      city: "Melbourne",
      title: "An amazing journey",
      price: "3,200,000",
      image: "https://images.unsplash.com/photo-1514395465013-2dc0ad8b955f?q=80&w=2070"
    },
    {
      city: "Paris",
      title: "A Paris Adventure",
      price: "3,200,000",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073"
    },
    {
      city: "London",
      title: "London eye adventure",
      price: "3,200,000",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070"
    },
    {
      city: "Columbia",
      title: "Amazing streets",
      price: "3,200,000",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1887"
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fall into travel</h2>
          <p className="text-gray-600">
            Going somewhere to celebrate this season? Whether you&apos;re going home or somewhere to roam, we&apos;ve got the travel tools to get you to your destination.
          </p>
        </div>
        <Link href="#" className="hidden md:inline-block border border-[#14b8a6] text-[#14b8a6] px-6 py-2 rounded-md hover:bg-[#14b8a6] hover:text-white transition-colors text-sm font-semibold">
          See All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest, index) => (
          <DestinationCard key={index} {...dest} />
        ))}
      </div>
       <div className="mt-8 text-center md:hidden">
        <Link href="#" className="inline-block border border-[#14b8a6] text-[#14b8a6] px-6 py-2 rounded-md hover:bg-[#14b8a6] hover:text-white transition-colors text-sm font-semibold">
            See All
        </Link>
      </div>
    </section>
  );
}

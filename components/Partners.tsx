import Image from "next/image";

const partners = [
  { name: "Garuda Indonesia", logo: "https://upload.wikimedia.org/wikipedia/id/f/fe/Garuda_Indonesia_Logo.svg" },
  { name: "Lion Air", logo: "https://upload.wikimedia.org/wikipedia/en/4/42/Lion_Air_Group_logo.svg" },
  { name: "AirAsia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/200px-AirAsia_New_Logo.svg.png" },
  { name: "Singapore Airlines", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/200px-Singapore_Airlines_Logo_2.svg.png" },
  { name: "Qatar Airways", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/200px-Qatar_Airways_Logo.svg.png" },
  { name: "Emirates", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png" },
];

export default function Partners() {
  return (
    <section className="py-12 px-6 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <p className="text-center text-muted text-sm font-medium mb-8 uppercase tracking-wider">
          Trusted by the World's Leading Airlines
        </p>

        {/* Logo Grid - Horizontal Scroll on Mobile */}
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="relative h-10 w-28 md:w-36 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 shrink-0"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

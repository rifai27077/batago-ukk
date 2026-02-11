"use client";

interface FlightSortTabsProps {
  activeSort: string;
  onSortChange: (id: string) => void;
}

export default function FlightSortTabs({ activeSort, onSortChange }: FlightSortTabsProps) {
  const tabs = [
    { id: "cheapest", label: "Cheapest", price: "Rp. 1.100.000", duration: "2h 18m" },
    { id: "best", label: "Best", price: "Rp. 1.100.000", duration: "2h 18m" },
    { id: "quickest", label: "Quickest", price: "Rp. 1.100.000", duration: "2h 18m" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(17,34,17,0.05)] overflow-hidden mb-6 flex divide-x divide-foreground/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSortChange(tab.id)}
          className={`flex-1 p-4 pb-5 text-left transition-all relative ${
            activeSort === tab.id ? "bg-primary/10" : "hover:bg-black/5"
          }`}
        >
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${activeSort === tab.id ? "text-black" : "text-black/60"}`}>
                {tab.label}
            </span>
            <span className="text-xs text-black/60 mt-1 font-medium">
                {tab.price} . {tab.duration}
            </span>
          </div>
          {activeSort === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary" />
          )}
        </button>
      ))}

      <button className="px-4 flex items-center gap-2 hover:bg-black/5 transition-colors">
        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        <span className="text-sm font-bold text-black">Other sort</span>
      </button>
    </div>
  );
}

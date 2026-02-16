import { Info, ShieldCheck, Clock, Ban, Dog } from "lucide-react";

export default function StaysPolicies() {
  const policies = [
    {
      title: "Check-in / Check-out",
      icon: Clock,
      details: ["Check-in from 14:00", "Check-out before 12:00"]
    },
    {
      title: "Cancellation Policy",
      icon: ShieldCheck,
      details: ["Free cancellation up to 48 hours before check-in.", "Non-refundable if cancelled within 48 hours."]
    },
    {
        title: "Children & Beds",
        icon: Info,
        details: ["Children of any age are welcome.", "Cots and extra beds are subject to availability."]
    },
    {
        title: "Age Restriction",
        icon: Ban,
        details: ["The minimum age for check-in is 18."]
    },
    {
        title: "Pets",
        icon: Dog,
        details: ["Pets are not allowed."]
    }
  ];

  return (
    <section className="py-12 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary/5 rounded-[12px] p-6 lg:p-10 border border-primary/10">
          <h2 className="text-2xl font-bold text-foreground mb-8">House Rules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy, idx) => {
                const Icon = policy.icon;
                return (
                    <div key={idx} className="bg-white rounded-[12px] p-5 shadow-sm border border-primary/5 hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-foreground">{policy.title}</h3>
                        </div>
                        <ul className="space-y-2 pl-12">
                            {policy.details.map((detail, i) => (
                                <li key={i} className="text-sm text-foreground/70 list-disc">{detail}</li>
                            ))}
                        </ul>
                    </div>
                );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

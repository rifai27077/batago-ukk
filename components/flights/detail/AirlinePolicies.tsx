import { Info, ShieldCheck } from "lucide-react";

interface AirlinePoliciesProps {
  airlineName: string;
  policies: string[];
}

export default function AirlinePolicies({
  airlineName,
  policies,
}: AirlinePoliciesProps) {
  return (
    <section className="py-8 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary/5 rounded-[12px] p-6 lg:p-10 border border-primary/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-[4px] text-primary">
                 <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
                {airlineName} Policies
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-[12px] shadow-sm border border-primary/5">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                  {policy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

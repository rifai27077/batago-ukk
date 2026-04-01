"use client";

import { useState } from "react";
import { Check, ChevronRight, User, Building, CreditCard, Camera } from "lucide-react";
import Link from "next/link";

interface OnboardingStep {
  id: number;
  title: string;
  description?: string;
  icon?: any;
  status: "completed" | "current" | "pending" | "in_review";
  link?: string;
}

interface OnboardingProgressProps {
  steps?: OnboardingStep[];
}

export default function OnboardingProgress({ steps: initialSteps }: OnboardingProgressProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const defaultSteps = [
    {
      id: 1,
      title: "Complete Profile",
      description: "Add your contact details and business information",
      icon: User,
      status: "current" as const,
      link: "/partner/dashboard/settings",
    },
    {
      id: 2,
      title: "Verify Identity",
      description: "Upload necessary documents for verification",
      icon: Camera,
      status: "pending" as const,
      link: "/partner/dashboard/settings",
    },
    {
      id: 3,
      title: "Add Bank Account",
      description: "Set up your payout method to receive earnings",
      icon: CreditCard,
      status: "pending" as const,
      link: "/partner/dashboard/finance/settings",
    },
    {
      id: 4,
      title: "List First Property",
      description: "Create your first listing and start hosting",
      icon: Building,
      status: "pending" as const,
      link: "/partner/dashboard/listings",
    },
  ];

  // Map icons to backend step data if needed, or just use IDs
  const steps = initialSteps ? initialSteps.map(s => {
    const defaultStep = defaultSteps.find(ds => ds.id === s.id);
    return {
      ...defaultStep,
      ...s,
      icon: defaultStep?.icon || User // Fallback icon
    };
  }) : defaultSteps;

  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progress = (completedSteps / steps.length) * 100;

  if (isDismissed || completedSteps === steps.length) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Left: Progress Summary */}
        <div className="lg:w-1/3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Welcome, Partner!</h3>
            <span className="text-sm font-semibold text-primary">{Math.round(progress)}% Complete</span>
          </div>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">
            Complete these steps to start earning with Batago. You are almost there!
          </p>
          
          <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button 
            onClick={() => setIsDismissed(true)}
            className="text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 underline decoration-gray-300 dark:decoration-slate-600 underline-offset-4 transition-colors"
          >
            Dismiss for now
          </button>
        </div>

        {/* Right: Steps List */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isInReview = step.status === "in_review";
            const isPending = step.status === "pending";

            return (
              <Link 
                href={step.link || "#"}
                key={step.id}
                onClick={(e) => {
                  if (isPending || isCompleted) {
                    e.preventDefault(); // Don't allow clicking completed or pending
                  }
                }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? "bg-gray-50/50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 opacity-60 cursor-default" 
                    : isCurrent
                      ? "bg-white dark:bg-slate-800 border-primary shadow-lg shadow-primary/5 cursor-pointer hover:border-primary/50"
                      : isInReview
                        ? "bg-amber-50/30 dark:bg-amber-500/5 border-amber-200 dark:border-amber-900/50 cursor-default"
                        : "bg-gray-50/50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 opacity-40 cursor-default"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isCompleted 
                    ? "bg-primary text-white" 
                    : isCurrent
                      ? "bg-primary/10 text-primary"
                      : isInReview
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                        : "bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500"
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isCompleted ? "text-gray-500 dark:text-slate-400" : "text-gray-900 dark:text-white"}`}>
                      {step.title}
                    </h4>
                    {isInReview && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        In Review
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 line-clamp-1 ${isCompleted ? "text-gray-400 dark:text-slate-500" : "text-gray-500 dark:text-slate-400"}`}>
                    {isInReview ? "Our team is reviewing your information..." : step.description}
                  </p>
                </div>

                {!isCompleted && !isPending && !isInReview && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

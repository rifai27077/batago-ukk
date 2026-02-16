"use client";

import { useState } from "react";
import { Check, ChevronRight, User, Building, CreditCard, Camera } from "lucide-react";
import Link from "next/link";

export default function OnboardingProgress() {
  const [isDismissed, setIsDismissed] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Complete Profile",
      description: "Add your contact details and business information",
      icon: User,
      status: "completed",
      link: "/partner/dashboard/settings",
    },
    {
      id: 2,
      title: "Verify Identity",
      description: "Upload necessary documents for verification",
      icon: Camera,
      status: "completed",
      link: "/partner/dashboard/settings",
    },
    {
      id: 3,
      title: "Add Bank Account",
      description: "Set up your payout method to receive earnings",
      icon: CreditCard,
      status: "current",
      link: "/partner/dashboard/finance",
    },
    {
      id: 4,
      title: "List First Property",
      description: "Create your first listing and start hosting",
      icon: Building,
      status: "pending",
      link: "/partner/dashboard/listings",
    },
  ];

  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progress = (completedSteps / steps.length) * 100;

  if (isDismissed || progress === 100) return null;

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
            const Icon = step.icon;

            return (
              <Link 
                href={step.link}
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? "bg-gray-50 dark:bg-slate-700/50 border-gray-100 dark:border-slate-700 opacity-70" 
                    : isCurrent
                    ? "bg-white dark:bg-slate-800 border-primary/30 ring-1 ring-primary/10 shadow-sm"
                    : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 opacity-60"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted 
                    ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500" 
                    : isCurrent
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold ${isCompleted ? "text-gray-600 dark:text-slate-400 line-through" : "text-gray-900 dark:text-white"}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {step.description}
                  </p>
                </div>
                {isCurrent && <ChevronRight className="w-4 h-4 text-primary mt-1" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

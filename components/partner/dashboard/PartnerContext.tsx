"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type PartnerType = "hotel" | "airline";

interface PartnerContextType {
  partnerType: PartnerType;
  setPartnerType: (type: PartnerType) => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [partnerType, setPartnerType] = useState<PartnerType>("hotel");

  return (
    <PartnerContext.Provider value={{ partnerType, setPartnerType }}>
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error("usePartner must be used within a PartnerProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "AED";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rateFromUsd: number;
  format: (amountUsd: number) => string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    label: "INR (₹)",
    flag: "🇮🇳",
    rateFromUsd: 84.5,
    format: (amountUsd) => `₹${Math.round(amountUsd * 84.5).toLocaleString("en-IN")}`,
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    flag: "🇺🇸",
    rateFromUsd: 1.0,
    format: (amountUsd) => `$${amountUsd.toFixed(2)}`,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    flag: "🇪🇺",
    rateFromUsd: 0.92,
    format: (amountUsd) => `€${(amountUsd * 0.92).toFixed(2)}`,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    label: "GBP (£)",
    flag: "🇬🇧",
    rateFromUsd: 0.79,
    format: (amountUsd) => `£${(amountUsd * 0.79).toFixed(2)}`,
  },
  AED: {
    code: "AED",
    symbol: "AED",
    label: "AED (AED)",
    flag: "🇦🇪",
    rateFromUsd: 3.67,
    format: (amountUsd) => `AED ${(amountUsd * 3.67).toFixed(2)}`,
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountUsd: number) => string;
  convertPrice: (amountUsd: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

function detectUserCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "INR";

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "";

    // India detection
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta" || locale.includes("en-IN") || locale.includes("hi-IN")) {
      return "INR";
    }

    // UK detection
    if (tz.includes("London") || locale.includes("en-GB")) {
      return "GBP";
    }

    // UAE / Gulf detection
    if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || locale.includes("ar-AE")) {
      return "AED";
    }

    // Europe detection
    if (
      tz.includes("Europe") ||
      locale.includes("fr-") ||
      locale.includes("de-") ||
      locale.includes("it-") ||
      locale.includes("es-")
    ) {
      return "EUR";
    }

    // Default to USD for USA & international
    return "USD";
  } catch {
    return "INR";
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sandline_currency") as CurrencyCode | null;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    } else {
      const auto = detectUserCurrency();
      setCurrencyState(auto);
      localStorage.setItem("sandline_currency", auto);
    }
    setIsLoaded(true);
  }, []);

  function setCurrency(code: CurrencyCode) {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem("sandline_currency", code);
    }
  }

  const currentConfig = CURRENCIES[currency] || CURRENCIES.INR;

  function formatPrice(amountUsd: number): string {
    if (typeof amountUsd !== "number" || isNaN(amountUsd)) return currentConfig.format(0);
    return currentConfig.format(amountUsd);
  }

  function convertPrice(amountUsd: number): number {
    if (typeof amountUsd !== "number" || isNaN(amountUsd)) return 0;
    return Number((amountUsd * currentConfig.rateFromUsd).toFixed(2));
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyConfig: currentConfig,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Fallback safe context if used outside provider
    return {
      currency: "INR" as CurrencyCode,
      currencyConfig: CURRENCIES.INR,
      setCurrency: () => {},
      formatPrice: (amount: number) => `₹${Math.round(amount * 84.5).toLocaleString("en-IN")}`,
      convertPrice: (amount: number) => Math.round(amount * 84.5),
    };
  }
  return ctx;
}

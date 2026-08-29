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

export function mapCountryToCurrency(countryCode: string): CurrencyCode {
  const code = countryCode.trim().toUpperCase();
  if (code === "IN") return "INR";
  if (code === "GB" || code === "UK") return "GBP";
  if (["AE", "SA", "QA", "KW", "OM", "BH"].includes(code)) return "AED";
  if ([
    "FR", "DE", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO",
    "DK", "FI", "PT", "GR", "IE", "PL", "CZ", "HU", "RO", "BG"
  ].includes(code)) {
    return "EUR";
  }
  return "USD";
}

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountUsd: number) => string;
  convertPrice: (amountUsd: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

function detectClientTzCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "INR";

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "";

    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta" || locale.includes("en-IN") || locale.includes("hi-IN")) {
      return "INR";
    }
    if (tz.includes("London") || locale.includes("en-GB")) {
      return "GBP";
    }
    if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || locale.includes("ar-AE")) {
      return "AED";
    }
    if (
      tz.includes("Europe") ||
      locale.includes("fr-") ||
      locale.includes("de-") ||
      locale.includes("it-") ||
      locale.includes("es-")
    ) {
      return "EUR";
    }
    return "USD";
  } catch {
    return "INR";
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");

  useEffect(() => {
    // 1. Check if user already manually selected currency
    const manualCurrency = localStorage.getItem("sandline_currency_manual") as CurrencyCode | null;
    if (manualCurrency && CURRENCIES[manualCurrency]) {
      setCurrencyState(manualCurrency);
      return;
    }

    // 2. Instant fast local detection (<1ms)
    const fastDetected = detectClientTzCurrency();
    setCurrencyState(fastDetected);

    // 3. Real-time Live IP Geo-Detection in background
    async function fetchLiveLocation() {
      try {
        const res = await fetch("/api/geo");
        if (res.ok) {
          const data = await res.json();
          if (data?.country) {
            const detected = mapCountryToCurrency(data.country);
            setCurrencyState(detected);
            localStorage.setItem("sandline_currency", detected);
            return;
          }
        }

        // Fallback to public client IP lookup
        const publicRes = await fetch("https://api.country.is/", { signal: AbortSignal.timeout(2500) });
        if (publicRes.ok) {
          const pData = await publicRes.json();
          if (pData?.country) {
            const detected = mapCountryToCurrency(pData.country);
            setCurrencyState(detected);
            localStorage.setItem("sandline_currency", detected);
          }
        }
      } catch (err) {
        console.warn("Auto geo-tag fallback:", err);
      }
    }

    fetchLiveLocation();
  }, []);

  function setCurrency(code: CurrencyCode) {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      // Mark as manually selected so it remembers user's explicit preference
      localStorage.setItem("sandline_currency_manual", code);
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

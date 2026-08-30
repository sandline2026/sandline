"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/pixel";

interface MetaPurchaseTrackerProps {
  orderNumber: string;
  total: number;
  currency?: string;
  items?: Array<{ name: string; price?: number; quantity?: number }>;
}

export default function MetaPurchaseTracker({
  orderNumber,
  total,
  currency = "USD",
  items = [],
}: MetaPurchaseTrackerProps) {
  useEffect(() => {
    if (orderNumber && total > 0) {
      try {
        trackPurchase({
          orderNumber,
          total,
          currency,
          items,
        });
      } catch (err) {
        console.warn("Meta Purchase tracking failed:", err);
      }
    }
  }, [orderNumber, total, currency, items]);

  return null;
}

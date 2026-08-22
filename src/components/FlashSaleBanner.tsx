"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sandline-flash-sale-end";
const DURATION_MS = 24 * 60 * 60 * 1000;

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState<{ h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    let endTime = Number(localStorage.getItem(STORAGE_KEY));
    const now = Date.now();

    if (!endTime || endTime < now) {
      endTime = now + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, String(endTime));
    }

    function tick() {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        const newEnd = Date.now() + DURATION_MS;
        localStorage.setItem(STORAGE_KEY, String(newEnd));
        endTime = newEnd;
      }
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  const content = (
    <span className="flash-banner-item">
      <strong>✦ Flash Sale</strong> — 10% off sitewide, ends in
      <span className="flash-timer">
        <span>{timeLeft.h}</span>:<span>{timeLeft.m}</span>:<span>{timeLeft.s}</span>
      </span>
      <a href="/shop">Shop the sale →</a>
    </span>
  );

  return (
    <div className="flash-banner">
      <div className="flash-banner-track">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}

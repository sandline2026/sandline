"use client";

import { useEffect, useState } from "react";

export default function IntroSplash() {
  const [stage, setStage] = useState<"enter" | "active" | "fly" | "hidden">("enter");

  useEffect(() => {
    // If already seen in this session, skip entirely
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("sandline_splash_seen")) {
          setStage("hidden");
          return;
        }
        sessionStorage.setItem("sandline_splash_seen", "1");
      } catch {
        // Fallback if sessionStorage is disabled
      }
    }

    // Stage 1: Fast reveal
    const t1 = setTimeout(() => setStage("active"), 50);
    // Stage 2: Lift upward curtain in blink of an eye (400ms)
    const t2 = setTimeout(() => setStage("fly"), 400);
    // Stage 3: Remove completely from DOM (700ms)
    const t3 = setTimeout(() => setStage("hidden"), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (stage === "hidden") return null;

  return (
    <div
      className={`sandline-intro-curtain ${stage === "fly" ? "fly-away" : ""}`}
      aria-hidden="true"
    >
      <div className="intro-content">
        <div className="intro-logo-box">
          <img
            src="/images/logo-splash-master.png"
            alt="SANDLINE Resort Wear"
            className="intro-master-logo"
          />
        </div>
      </div>

      <button
        type="button"
        className="intro-skip-btn"
        onClick={() => setStage("hidden")}
      >
        Skip ✕
      </button>
    </div>
  );
}

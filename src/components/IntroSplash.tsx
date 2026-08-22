"use client";

import { useEffect, useState } from "react";

export default function IntroSplash() {
  const [stage, setStage] = useState<"enter" | "active" | "fly" | "hidden">("enter");

  useEffect(() => {
    // Stage 1: Reveal logo animation
    const t1 = setTimeout(() => setStage("active"), 100);
    // Stage 2: Fly / Lift upward curtain
    const t2 = setTimeout(() => setStage("fly"), 2400);
    // Stage 3: Remove completely from DOM
    const t3 = setTimeout(() => setStage("hidden"), 3300);

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
      <div className="intro-bg-glow"></div>

      <div className="intro-content">
        <div className="intro-sparkle">✦</div>
        <h1 className="intro-brand">
          SAND<span>LINE</span>
        </h1>
        <div className="intro-line"></div>
        <p className="intro-tagline">RESORTWEAR • JAIPUR &amp; THE WORLD</p>
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

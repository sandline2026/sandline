"use client";

import Link from "next/link";
import { useState } from "react";

const DESTINATIONS = [
  { name: "Bali", slug: "beach_party" },
  { name: "Tulum", slug: "resort_evening" },
  { name: "Goa", slug: "beach_party" },
  { name: "Santorini", slug: "honeymoon" },
  { name: "Riviera", slug: "resort_evening" },
  { name: "Maldives", slug: "honeymoon" },
  { name: "Amalfi", slug: "resort_evening" },
];

export default function MobileDestinationBar() {
  const [activeTab, setActiveTab] = useState<"new" | "bestsellers">("new");

  return (
    <div className="mobile-destination-section">
      {/* 1. Destination Editorial Ribbon (Scrollable / Marquee style) */}
      <div className="destination-ribbon">
        <div className="destination-ribbon-track">
          {DESTINATIONS.concat(DESTINATIONS).map((dest, i) => (
            <span key={i} className="destination-item">
              <Link href={`/collections/${dest.slug}`}>
                <em>{dest.name}</em>
              </Link>
              <span className="destination-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Sub-Category Tabs: NEW ARRIVALS | BEST SELLERS */}
      <div className="mobile-tab-switch-row">
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          NEW ARRIVALS
        </button>
        <div className="mobile-tab-divider">|</div>
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === "bestsellers" ? "active" : ""}`}
          onClick={() => setActiveTab("bestsellers")}
        >
          BEST SELLERS
        </button>
      </div>
    </div>
  );
}

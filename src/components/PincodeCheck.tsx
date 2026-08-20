"use client";

import { useState } from "react";

export default function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState("");

  function checkDelivery(e: React.FormEvent) {
    e.preventDefault();
    if (pincode.trim().length < 3) {
      setResult("Please enter a valid postal/zip code.");
      return;
    }
    setResult("Delivers to your area in 7–12 days via tracked international courier.");
  }

  return (
    <div className="option-group">
      <span className="option-label">Check Delivery</span>
      <form onSubmit={checkDelivery} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Postal / ZIP code"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          style={{
            fontFamily: "Work Sans, sans-serif",
            fontSize: "14px",
            padding: "9px 14px",
            border: "1px solid var(--line)",
            borderRadius: "999px",
            outline: "none",
            background: "var(--foam)",
            flex: 1,
          }}
        />
        <button className="wishlist-btn" type="submit" style={{ marginTop: 0 }}>Check</button>
      </form>
      {result && <p style={{ fontSize: "13px", marginTop: "10px", color: "rgba(27,36,32,0.7)" }}>{result}</p>}
    </div>
  );
}

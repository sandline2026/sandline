"use client";

import { useState } from "react";
import "../../admin.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, secretAnswer }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Access Denied: Incorrect password or secret answer.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card" style={{ maxWidth: "440px" }}>
        <div className="brand" style={{ letterSpacing: "2px" }}>SANDLINE ATELIER</div>
        <h1 style={{ fontSize: "24px", marginBottom: "6px" }}>Admin Portal Login</h1>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>
          Protected executive access. Dual-factor secret verification required.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Admin Password */}
          <div style={{ marginBottom: "16px", textAlign: "left" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#333", display: "block", marginBottom: "6px" }}>
              Admin Master Password
            </label>
            <input
              type="password"
              placeholder="Enter master password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {/* Step 2: Secret Atelier Security Question */}
          <div style={{ marginBottom: "22px", textAlign: "left" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#333", display: "block", marginBottom: "6px" }}>
              🔒 Security Question: <span style={{ color: "#D97706" }}>Fashion Villa kaunsi city mein hai?</span>
            </label>
            <input
              type="text"
              placeholder="City name enter karein..."
              value={secretAnswer}
              onChange={(e) => setSecretAnswer(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#DC2626",
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button className="admin-btn" type="submit" disabled={loading} style={{ width: "100%", padding: "14px" }}>
            {loading ? "Verifying Credentials..." : "Unlock Admin Portal →"}
          </button>
        </form>
      </div>
    </div>
  );
}
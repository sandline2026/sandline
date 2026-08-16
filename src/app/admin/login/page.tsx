"use client";

import { useState } from "react";
import "../../sandline.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <div className="sandline-page">
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
      </nav>
      <div className="admin-login-wrap">
        <h1 style={{ fontSize: "28px", marginBottom: "24px" }}>Admin login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: "#c0392b", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Checking..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

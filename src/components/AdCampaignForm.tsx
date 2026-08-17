"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdCampaignForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    await fetch("/api/admin/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: formData.get("platform"),
        campaign_name: formData.get("campaign_name"),
        spend_usd: formData.get("spend_usd"),
        reach: formData.get("reach"),
        clicks: formData.get("clicks"),
        conversions: formData.get("conversions"),
        date_recorded: formData.get("date_recorded"),
      }),
    });

    form.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form className="admin-inline-form" onSubmit={handleSubmit}>
      <label>
        Platform
        <select name="platform">
          <option value="meta">Meta</option>
          <option value="google">Google</option>
        </select>
      </label>
      <label>Campaign name<input type="text" name="campaign_name" placeholder="Beach Party Launch" required /></label>
      <label>Spend ($)<input type="number" step="0.01" name="spend_usd" required /></label>
      <label>Reach<input type="number" name="reach" /></label>
      <label>Clicks<input type="number" name="clicks" /></label>
      <label>Conversions<input type="number" name="conversions" /></label>
      <label>Date<input type="date" name="date_recorded" required /></label>
      <button className="admin-btn" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add campaign"}
      </button>
    </form>
  );
}

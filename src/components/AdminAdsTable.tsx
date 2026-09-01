"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Edit2, Trash2, X, Check } from "lucide-react";

interface Campaign {
  id: string;
  platform: string;
  campaign_name: string;
  spend_usd: number;
  reach: number;
  clicks: number;
  conversions: number;
  date_recorded: string;
}

export default function AdminAdsTable({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingCampaign) return;
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/ads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCampaign.id,
          platform: formData.get("platform"),
          campaign_name: formData.get("campaign_name"),
          spend_usd: formData.get("spend_usd"),
          reach: formData.get("reach"),
          clicks: formData.get("clicks"),
          conversions: formData.get("conversions"),
          date_recorded: formData.get("date_recorded"),
        }),
      });

      if (res.ok) {
        setEditingCampaign(null);
        router.refresh();
      } else {
        alert("Failed to update campaign");
      }
    } catch {
      alert("Error updating campaign");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/ads?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete campaign");
      }
    } catch {
      alert("Error deleting campaign");
    } finally {
      setDeletingId(null);
    }
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="admin-empty">
        <Megaphone size={32} />
        <p>No ad campaigns logged yet.</p>
      </div>
    );
  }

  return (
    <>
      <table className="admin-data-table">
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Platform</th>
            <th>Spend ($)</th>
            <th>Reach</th>
            <th>Clicks</th>
            <th>CTR</th>
            <th>Conversions</th>
            <th>Date</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => {
            const ctr = c.clicks > 0 && c.reach > 0 ? ((c.clicks / c.reach) * 100).toFixed(1) : "0.0";
            return (
              <tr key={c.id}>
                <td>
                  <strong style={{ color: "var(--ink)" }}>{c.campaign_name}</strong>
                </td>
                <td>
                  <span
                    style={{
                      background: c.platform.toLowerCase() === "meta" ? "#EFF6FF" : "#F3F4F6",
                      color: c.platform.toLowerCase() === "meta" ? "#1D4ED8" : "#374151",
                      border: c.platform.toLowerCase() === "meta" ? "1px solid #BFDBFE" : "1px solid #E5E7EB",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {c.platform}
                  </span>
                </td>
                <td>
                  <strong>${Number(c.spend_usd).toFixed(2)}</strong>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    ≈ ₹{Math.round(Number(c.spend_usd) * 84.5).toLocaleString("en-IN")}
                  </div>
                </td>
                <td>
                  <strong>{Number(c.reach || 0).toLocaleString()}</strong>
                </td>
                <td>
                  <strong>{c.clicks}</strong>
                </td>
                <td>
                  <span style={{ fontSize: "12px", color: Number(ctr) >= 1.0 ? "var(--green)" : "var(--text-muted)" }}>
                    {ctr}%
                  </span>
                </td>
                <td>
                  <strong style={{ color: c.conversions > 0 ? "var(--green)" : "var(--text-muted)" }}>
                    {c.conversions}
                  </strong>
                </td>
                <td suppressHydrationWarning>{new Date(c.date_recorded).toLocaleDateString()}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setEditingCampaign(c)}
                      title="Edit Campaign Stats"
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "5px 8px",
                        cursor: "pointer",
                        color: "var(--ink)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      title="Delete Campaign"
                      style={{
                        background: "none",
                        border: "1px solid #FEE2E2",
                        borderRadius: "6px",
                        padding: "5px 8px",
                        cursor: "pointer",
                        color: "#DC2626",
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Quick Edit Modal */}
      {editingCampaign && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setEditingCampaign(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              padding: "28px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>Update Campaign Stats</h3>
              <button
                type="button"
                onClick={() => setEditingCampaign(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Platform
                  </label>
                  <select
                    name="platform"
                    defaultValue={editingCampaign.platform}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  >
                    <option value="meta">Meta (Instagram / FB)</option>
                    <option value="google">Google</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Date
                  </label>
                  <input
                    type="date"
                    name="date_recorded"
                    defaultValue={editingCampaign.date_recorded}
                    required
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  Campaign Name
                </label>
                <input
                  type="text"
                  name="campaign_name"
                  defaultValue={editingCampaign.campaign_name}
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Spend ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="spend_usd"
                    defaultValue={editingCampaign.spend_usd}
                    required
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Reach
                  </label>
                  <input
                    type="number"
                    name="reach"
                    defaultValue={editingCampaign.reach}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Clicks
                  </label>
                  <input
                    type="number"
                    name="clicks"
                    defaultValue={editingCampaign.clicks}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Conversions (Purchases)
                  </label>
                  <input
                    type="number"
                    name="conversions"
                    defaultValue={editingCampaign.conversions}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  style={{
                    background: "#F3F4F6",
                    border: "none",
                    padding: "9px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "var(--ink)",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function CouponCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.get("code"),
          discount_type: formData.get("discount_type"),
          discount_value: Number(formData.get("discount_value")),
          max_uses: formData.get("max_uses") ? Number(formData.get("max_uses")) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create coupon");
      }

      form.reset();
      setStatusMsg({ type: "success", text: "Coupon created successfully!" });
      router.refresh();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to create coupon" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-inline-form" onSubmit={handleSubmit} style={{ alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
      <label>
        Code
        <input type="text" name="code" placeholder="BEACH20" required />
      </label>
      <label>
        Type
        <select name="discount_type">
          <option value="percentage">Percentage (%)</option>
          <option value="flat">Flat ($)</option>
        </select>
      </label>
      <label>
        Value
        <input type="number" name="discount_value" placeholder="20" required />
      </label>
      <label>
        Max uses
        <input type="number" name="max_uses" placeholder="Unlimited (optional)" />
      </label>
      <button className="admin-btn" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add coupon"}
      </button>
      {statusMsg && (
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: statusMsg.type === "success" ? "var(--green, #16a34a)" : "#dc2626",
            padding: "6px 12px",
            borderRadius: "6px",
            background: statusMsg.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
          }}
        >
          {statusMsg.text}
        </span>
      )}
    </form>
  );
}

export function ToggleCouponButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      await fetch(`/api/admin/coupons/${id}/toggle`, { method: "POST" });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`pill pill-${isActive ? "active" : "inactive"}`}
      onClick={toggle}
      disabled={loading}
      style={{ border: "none", cursor: "pointer" }}
    >
      {loading ? "..." : isActive ? "Active" : "Inactive"}
    </button>
  );
}

export function DeleteCouponButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: "transparent",
        border: "none",
        color: "var(--text-muted, #888)",
        cursor: "pointer",
        padding: "6px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
      }}
      title="Delete Coupon"
    >
      <Trash2 size={16} />
    </button>
  );
}

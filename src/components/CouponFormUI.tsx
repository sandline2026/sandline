"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CouponCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: formData.get("code"),
        discount_type: formData.get("discount_type"),
        discount_value: Number(formData.get("discount_value")),
        max_uses: formData.get("max_uses") ? Number(formData.get("max_uses")) : null,
      }),
    });

    form.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form className="admin-inline-form" onSubmit={handleSubmit}>
      <label>Code<input type="text" name="code" placeholder="BEACH20" required /></label>
      <label>
        Type
        <select name="discount_type">
          <option value="percentage">Percentage</option>
          <option value="flat">Flat ($)</option>
        </select>
      </label>
      <label>Value<input type="number" name="discount_value" placeholder="20" required /></label>
      <label>Max uses<input type="number" name="max_uses" placeholder="Unlimited" /></label>
      <button className="admin-btn" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add coupon"}
      </button>
    </form>
  );
}

export function ToggleCouponButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/coupons/${id}/toggle`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      className={`pill pill-${isActive ? "active" : "inactive"}`}
      onClick={toggle}
      disabled={loading}
      style={{ border: "none", cursor: "pointer" }}
    >
      {isActive ? "Active" : "Inactive"}
    </button>
  );
}

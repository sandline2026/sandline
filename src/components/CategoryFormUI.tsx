"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CategoryCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.get("name") }),
    });

    form.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form className="admin-inline-form" onSubmit={handleSubmit}>
      <label>Category name<input type="text" name="name" placeholder="e.g. Jumpsuits" required /></label>
      <button className="admin-btn" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add category"}
      </button>
    </form>
  );
}

export function ToggleCategoryButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/categories/${id}/toggle`, { method: "POST" });
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

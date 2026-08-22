"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotifyToggleButton({ id, notified }: { id: string; notified: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/notify-requests/${id}/toggle`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      className={`pill pill-${notified ? "active" : "pending"}`}
      onClick={toggle}
      disabled={loading}
      style={{ border: "none", cursor: "pointer" }}
    >
      {notified ? "Notified" : "Pending"}
    </button>
  );
}

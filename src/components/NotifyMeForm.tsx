"use client";

import { useState } from "react";
import { createClient } from "@/../utils/supabase/client";

export default function NotifyMeForm({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.from("notify_me_requests").insert({ product_id: productId, email });

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return <p style={{ fontSize: "14px", color: "#059669" }}>We'll email you when it's back.</p>;
  }

  return (
    <form className="notify-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "..." : "Notify me"}
      </button>
    </form>
  );
}

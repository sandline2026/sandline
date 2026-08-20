"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/../utils/supabase/client";

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    const supabase = createClient();

    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!customer) {
      alert("We couldn't find an order under this email. Reviews are limited to verified buyers.");
      setLoading(false);
      return;
    }

    await supabase.from("reviews").insert({
      product_id: productId,
      customer_id: customer.id,
      rating: Number(formData.get("rating")),
      review_text: formData.get("review_text"),
      is_approved: false,
    });

    setSubmitted(true);
    setLoading(false);
    router.refresh();
  }

  if (submitted) {
    return <p style={{ fontSize: "14px", color: "#059669" }}>Thanks! Your review will appear once approved.</p>;
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label>Your email (must match your order)<input type="email" name="email" required style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "8px", marginBottom: "14px", boxSizing: "border-box" }} /></label>
      <label>Rating
        <select name="rating" required>
          <option value="5">5 — Loved it</option>
          <option value="4">4 — Great</option>
          <option value="3">3 — Good</option>
          <option value="2">2 — Okay</option>
          <option value="1">1 — Not for me</option>
        </select>
      </label>
      <label>Your review
        <textarea name="review_text" rows={3} placeholder="How was the fit, fabric, and fabric feel?" required />
      </label>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}

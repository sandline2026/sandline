"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export function ProductCreateForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        category_id: formData.get("category_id"),
        collection: formData.get("collection"),
        fabric: formData.get("fabric"),
        sizes: formData.get("sizes"),
        colors: formData.get("colors"),
        image_url: formData.get("image_url"),
        cost_price: formData.get("cost_price"),
        selling_price_usd: formData.get("selling_price_usd"),
        stock_quantity: formData.get("stock_quantity"),
      }),
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    form.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label>Name<input type="text" name="name" required /></label>
        <label>
          Category
          <select name="category_id">
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Mood collection
          <select name="collection">
            <option value="">— None —</option>
            <option value="honeymoon">Honeymoon</option>
            <option value="beach_party">Beach Party</option>
            <option value="resort_evening">Resort Evening</option>
          </select>
        </label>
        <label>Fabric<input type="text" name="fabric" placeholder="e.g. Silk" /></label>

        <label>Sizes (comma separated)<input type="text" name="sizes" placeholder="XS, S, M, L, XL" /></label>
        <label>Colors (comma separated)<input type="text" name="colors" placeholder="Red, Gold, Green" /></label>

        <label>Cost price (INR)<input type="number" name="cost_price" step="0.01" /></label>
        <label>Selling price (USD)<input type="number" name="selling_price_usd" step="0.01" required /></label>

        <label>Stock quantity<input type="number" name="stock_quantity" defaultValue={0} /></label>
        <label>Image URL<input type="text" name="image_url" placeholder="/images/products/..." /></label>

        <label className="admin-form-full">
          Description
          <textarea name="description" placeholder="Short product description shown on the detail page" />
        </label>

        {error && <p style={{ color: "#DC2626", fontSize: "13px", gridColumn: "1 / -1" }}>{error}</p>}

        <div className="admin-form-actions">
          <button className="admin-btn" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add product"}
          </button>
        </div>
      </div>
    </form>
  );
}

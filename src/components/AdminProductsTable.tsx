"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shirt, Search, Edit2, Trash2, Check, X, AlertCircle, Sparkles } from "lucide-react";

export interface ProductItem {
  id: string;
  name: string;
  slug?: string;
  collection?: string | null;
  fabric?: string | null;
  selling_price_usd: number;
  cost_price?: number | null;
  stock_quantity: number;
  stock_status: "in_stock" | "out_of_stock";
  images?: string[] | null;
  is_active?: boolean;
  categories?: { name: string } | null;
  category_id?: string | null;
}

export default function AdminProductsTable({
  products: initialProducts,
  categories,
}: {
  products: ProductItem[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "in_stock" | "out_of_stock">("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter products by tab and search
  const filteredProducts = products.filter((p) => {
    const matchesTab = filterTab === "all" ? true : p.stock_status === filterTab;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesTab;

    const matchesName = p.name.toLowerCase().includes(query);
    const matchesCollection = p.collection?.toLowerCase().includes(query);
    const matchesFabric = p.fabric?.toLowerCase().includes(query);
    return matchesTab && (matchesName || matchesCollection || matchesFabric);
  });

  const inStockCount = products.filter((p) => p.stock_status === "in_stock").length;
  const outOfStockCount = products.filter((p) => p.stock_status === "out_of_stock").length;

  // 1-Click Toggle In Stock / Out of Stock
  async function handleToggleStock(product: ProductItem) {
    const newStatus = product.stock_status === "in_stock" ? "out_of_stock" : "in_stock";
    const newQuantity = newStatus === "in_stock" ? (product.stock_quantity > 0 ? product.stock_quantity : 12) : 0;

    setTogglingId(product.id);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock_status: newStatus, stock_quantity: newQuantity } : p
      )
    );

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock_status: newStatus,
          stock_quantity: newQuantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update stock status");
      }
      router.refresh();
    } catch (err) {
      alert("Could not update status. Reverting changes.");
      // Revert
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } finally {
      setTogglingId(null);
    }
  }

  // Handle Edit Save
  async function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingEdit(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || editingProduct.name);
    const price = Number(formData.get("selling_price_usd")) || editingProduct.selling_price_usd;
    const costPrice = Number(formData.get("cost_price")) || 0;
    const stockQty = Number(formData.get("stock_quantity")) || 0;
    const collection = String(formData.get("collection") || "");
    const fabric = String(formData.get("fabric") || "");
    const stockStatus = stockQty > 0 ? "in_stock" : "out_of_stock";

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          selling_price_usd: price,
          cost_price: costPrice,
          stock_quantity: stockQty,
          collection: collection || null,
          fabric: fabric || null,
          stock_status: stockStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name,
                selling_price_usd: price,
                cost_price: costPrice,
                stock_quantity: stockQty,
                collection: collection || null,
                fabric: fabric || null,
                stock_status: stockStatus,
              }
            : p
        )
      );
      setEditingProduct(null);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      alert("Error: " + msg);
    } finally {
      setSavingEdit(false);
    }
  }

  // Handle Delete
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting";
      alert("Error: " + msg);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Toolbar: Tabs & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className={`admin-tab ${filterTab === "all" ? "active" : ""}`}
            onClick={() => setFilterTab("all")}
          >
            All Products <span className="admin-tab-count">{products.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${filterTab === "in_stock" ? "active" : ""}`}
            onClick={() => setFilterTab("in_stock")}
          >
            In Stock <span className="admin-tab-count" style={{ background: "#D1FAE5", color: "#065F46" }}>{inStockCount}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${filterTab === "out_of_stock" ? "active" : ""}`}
            onClick={() => setFilterTab("out_of_stock")}
          >
            Out of Stock <span className="admin-tab-count" style={{ background: "#FEE2E2", color: "#991B1B" }}>{outOfStockCount}</span>
          </button>
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search silhouettes or collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 36px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "#FFFFFF",
              fontSize: "13px",
              color: "var(--ink)",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <div className="admin-empty" style={{ padding: "60px 20px" }}>
          <Shirt size={32} />
          <p>No silhouettes match your current filter.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Silhouette</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>Stock Units</th>
                <th>Stock Status (1-Tap Toggle)</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isInStock = p.stock_status === "in_stock";
                const isToggling = togglingId === p.id;
                const photo = p.images?.[0];

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "56px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#F3F4F6",
                            flexShrink: 0,
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          {photo ? (
                            <img src={photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#9CA3AF" }}>
                              SL
                            </div>
                          )}
                        </div>

                        <div>
                          <strong style={{ color: "var(--ink)", display: "block", fontSize: "14px" }}>
                            {p.name}
                          </strong>
                          <div style={{ display: "flex", gap: "6px", marginTop: "3px" }}>
                            {p.collection && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "var(--text-muted)",
                                  background: "#F9FAFB",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  border: "1px solid #F3F4F6",
                                }}
                              >
                                {p.collection}
                              </span>
                            )}
                            {p.fabric && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#4B5563",
                                  background: "#EFF6FF",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                }}
                              >
                                {p.fabric}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          background: "var(--bg)",
                          padding: "4px 9px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "var(--ink)",
                        }}
                      >
                        {p.categories?.name || "Resort"}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", fontWeight: 700 }}>
                        ${Number(p.selling_price_usd).toFixed(2)}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: "13px", color: isInStock ? "#111827" : "#9CA3AF" }}>
                        <strong>{p.stock_quantity ?? 0}</strong> pcs
                      </span>
                    </td>

                    {/* 1-Click Toggle Switch Button */}
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p)}
                        disabled={isToggling}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: isInStock ? "#ECFDF5" : "#FEF2F2",
                          color: isInStock ? "#047857" : "#B91C1C",
                          border: `1px solid ${isInStock ? "#A7F3D0" : "#FECACA"}`,
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: isToggling ? "wait" : "pointer",
                          transition: "all 0.2s ease",
                        }}
                        title="Click to toggle In-Stock / Out-of-Stock"
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: isInStock ? "#10B981" : "#EF4444",
                          }}
                        />
                        <span>{isToggling ? "Updating..." : isInStock ? "In Stock (Click to Disable)" : "Out of Stock (Click to Enable)"}</span>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          style={{
                            background: "#F3F4F6",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            cursor: "pointer",
                            color: "#374151",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title="Edit Details"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          style={{
                            background: "#FEE2E2",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 8px",
                            fontSize: "12px",
                            cursor: "pointer",
                            color: "#DC2626",
                          }}
                          title="Delete Product"
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
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 24px",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", color: "var(--ink)" }}>
                Edit Silhouette: {editingProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6B7280" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct.name}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                    Selling Price ($USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="selling_price_usd"
                    defaultValue={editingProduct.selling_price_usd}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                    Stock Units Available
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    defaultValue={editingProduct.stock_quantity}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                    Collection
                  </label>
                  <input
                    type="text"
                    name="collection"
                    defaultValue={editingProduct.collection || ""}
                    placeholder="e.g. honeymoon, beach_party"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    name="fabric"
                    defaultValue={editingProduct.fabric || ""}
                    placeholder="e.g. Organic Crinkle Linen"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    background: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--ink)",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
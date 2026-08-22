import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import { ProductCreateForm } from "@/components/ProductFormUI";
import { Shirt, PlusCircle, PackageCheck, AlertTriangle, Layers } from "lucide-react";
import "../../admin.css";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  const totalProducts = products?.length || 0;
  const inStockCount = products?.filter((p: any) => p.stock_status === "in_stock").length || 0;
  const outOfStockCount = totalProducts - inStockCount;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Products Catalog"
          subtitle="Add new silhouettes, manage inventory levels, and update garment pricing"
        />

        {/* Stats Grid */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Silhouettes</span>
              <div className="admin-stat-icon-wrapper blue">
                <Shirt size={20} />
              </div>
            </div>
            <div className="value">{totalProducts}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">{categories?.length || 0} categories</span>
              <span>Catalog size</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">In Stock</span>
              <div className="admin-stat-icon-wrapper green">
                <PackageCheck size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--green)" }}>{inStockCount}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Available</span>
              <span>Live on shop</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Out of Stock</span>
              <div className="admin-stat-icon-wrapper red">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--red)" }}>{outOfStockCount}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">Notify enabled</span>
              <span>Needs restocking</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <PlusCircle size={18} />
              <span>Add New Product</span>
            </h2>
          </div>
          <ProductCreateForm categories={categories || []} />
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <Layers size={18} />
              <span>All Products ({totalProducts})</span>
            </h2>
          </div>
          {products && products.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Selling Price</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: "var(--ink)" }}>{p.name}</strong>
                      {p.collection && (
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Collection: {p.collection}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          background: "var(--bg)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {p.categories?.name || "—"}
                      </span>
                    </td>
                    <td>
                      <strong>${Number(p.selling_price_usd).toFixed(2)}</strong>
                    </td>
                    <td>{p.stock_quantity ?? 0} units</td>
                    <td>
                      <span
                        className={`pill pill-${
                          p.stock_status === "in_stock" ? "active" : "inactive"
                        }`}
                      >
                        {p.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <Shirt size={32} />
              <p>No products created yet. Add your first dress using the form above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

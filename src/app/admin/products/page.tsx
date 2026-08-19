import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import { ProductCreateForm } from "@/components/ProductFormUI";
import "../../admin.css";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Products</h1>
          <p>Add new products and manage stock</p>
        </div>

        <div className="admin-section">
          <div className="admin-section-header"><h2>Add a product</h2></div>
          <ProductCreateForm categories={categories || []} />
        </div>

        <div className="admin-section">
          <div className="admin-section-header"><h2>All products</h2></div>
          {products && products.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.categories?.name || "—"}</td>
                    <td>${p.selling_price_usd}</td>
                    <td>{p.stock_quantity ?? 0}</td>
                    <td><span className={`pill pill-${p.stock_status === "in_stock" ? "active" : "inactive"}`}>{p.stock_status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="admin-empty">No products yet.</div>}
        </div>
      </main>
    </div>
  );
}

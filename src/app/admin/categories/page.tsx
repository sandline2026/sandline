import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import { CategoryCreateForm, ToggleCategoryButton } from "@/components/CategoryFormUI";
import "../../admin.css";

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: categories } = await supabase.from("categories").select("*").order("created_at");
  const { data: products } = await supabase.from("products").select("category_id");

  const countByCategory: Record<string, number> = {};
  products?.forEach((p: any) => {
    if (p.category_id) countByCategory[p.category_id] = (countByCategory[p.category_id] || 0) + 1;
  });

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Categories</h1>
          <p>Manage product categories shown on the site</p>
        </div>

        <div className="admin-section">
          <CategoryCreateForm />
          {categories && categories.length > 0 ? (
            <table className="admin-data-table">
              <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th>Status</th></tr></thead>
              <tbody>
                {categories.map((c: any) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.slug}</td>
                    <td>{countByCategory[c.id] || 0}</td>
                    <td><ToggleCategoryButton id={c.id} isActive={c.is_active} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="admin-empty">No categories yet.</div>}
        </div>
      </main>
    </div>
  );
}

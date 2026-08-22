import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import { CategoryCreateForm, ToggleCategoryButton } from "@/components/CategoryFormUI";
import { FolderTree, PlusCircle, Layers } from "lucide-react";
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
        <AdminHeader
          title="Categories Management"
          subtitle="Organize garments into collections and shop filters"
        />

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <PlusCircle size={18} />
              <span>Create New Category</span>
            </h2>
          </div>
          <CategoryCreateForm />
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <FolderTree size={18} />
              <span>All Categories ({categories?.length || 0})</span>
            </h2>
          </div>
          {categories && categories.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>URL Slug</th>
                  <th>Total Garments</th>
                  <th>Visibility Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c: any) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ color: "var(--ink)" }}>{c.name}</strong>
                    </td>
                    <td>
                      <code
                        style={{
                          background: "var(--bg)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        /{c.slug}
                      </code>
                    </td>
                    <td>{countByCategory[c.id] || 0} items</td>
                    <td>
                      <ToggleCategoryButton id={c.id} isActive={c.is_active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <FolderTree size={32} />
              <p>No categories created yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

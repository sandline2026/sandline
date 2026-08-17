import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import { CouponCreateForm, ToggleCouponButton } from "@/components/CouponFormUI";
import "../../admin.css";

export default async function CouponsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Coupons</h1>
          <p>Create discount codes and toggle them on or off</p>
        </div>

        <div className="admin-section">
          <CouponCreateForm />
          {coupons && coupons.length > 0 ? (
            <table className="admin-data-table">
              <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Used</th><th>Max Uses</th><th>Status</th></tr></thead>
              <tbody>
                {coupons.map((c: any) => (
                  <tr key={c.id}>
                    <td>{c.code}</td>
                    <td>{c.discount_type}</td>
                    <td>{c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
                    <td>{c.used_count}</td>
                    <td>{c.max_uses ?? "Unlimited"}</td>
                    <td><ToggleCouponButton id={c.id} isActive={c.is_active} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="admin-empty">No coupons yet.</div>}
        </div>
      </main>
    </div>
  );
}

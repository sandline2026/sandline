import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import "../../admin.css";

export default async function CustomersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
  const { data: orders } = await supabase.from("orders").select("customer_id, total_usd");

  const spendByCustomer: Record<string, { count: number; total: number }> = {};
  orders?.forEach((o: any) => {
    if (!spendByCustomer[o.customer_id]) spendByCustomer[o.customer_id] = { count: 0, total: 0 };
    spendByCustomer[o.customer_id].count += 1;
    spendByCustomer[o.customer_id].total += Number(o.total_usd || 0);
  });

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Customers</h1>
          <p>Everyone who has placed an order or signed up</p>
        </div>

        <div className="admin-section">
          {customers && customers.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Country</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {customers.map((c: any) => {
                  const stats = spendByCustomer[c.id] || { count: 0, total: 0 };
                  return (
                    <tr key={c.id}>
                      <td>{c.full_name}</td>
                      <td>{c.email}</td>
                      <td>{c.country || "—"}</td>
                      <td>{stats.count}</td>
                      <td>${stats.total.toFixed(2)}</td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : <div className="admin-empty">No customers yet.</div>}
        </div>
      </main>
    </div>
  );
}

import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import { Users, ShoppingBag, DollarSign } from "lucide-react";
import "../../admin.css";

export default async function CustomersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: orders } = await supabase.from("orders").select("customer_id, total_usd");

  const spendByCustomer: Record<string, { count: number; total: number }> = {};
  orders?.forEach((o: any) => {
    if (!spendByCustomer[o.customer_id]) spendByCustomer[o.customer_id] = { count: 0, total: 0 };
    spendByCustomer[o.customer_id].count += 1;
    spendByCustomer[o.customer_id].total += Number(o.total_usd || 0);
  });

  const totalCustomers = customers?.length || 0;
  const totalOrdersCount = orders?.length || 0;
  const totalCustomerSpend = Object.values(spendByCustomer).reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Customer Directory"
          subtitle="Shopper profiles, shipping destinations, and lifetime order histories"
        />

        {/* Stats Grid */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Shoppers</span>
              <div className="admin-stat-icon-wrapper purple">
                <Users size={20} />
              </div>
            </div>
            <div className="value">{totalCustomers}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Verified</span>
              <span>Unique registered profiles</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Orders Placed</span>
              <div className="admin-stat-icon-wrapper blue">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="value">{totalOrdersCount}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">Lifetime</span>
              <span>Total checkout orders</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Customer Spend</span>
              <div className="admin-stat-icon-wrapper green">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--green)" }}>
              ${totalCustomerSpend.toFixed(2)}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Gross LTV</span>
              <span>Average ${(totalCustomers > 0 ? totalCustomerSpend / totalCustomers : 0).toFixed(2)} / customer</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <Users size={18} />
              <span>All Customers ({totalCustomers})</span>
            </h2>
          </div>
          {customers && customers.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => {
                  const stats = spendByCustomer[c.id] || { count: 0, total: 0 };
                  const initial = (c.full_name || "G").charAt(0).toUpperCase();

                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className="admin-user-avatar">{initial}</div>
                          <div>
                            <strong style={{ color: "var(--ink)" }}>{c.full_name || "Guest Shopper"}</strong>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span>{c.country || c.city || "—"}</span>
                      </td>
                      <td>
                        <strong>{stats.count}</strong> {stats.count === 1 ? "order" : "orders"}
                      </td>
                      <td>
                        <strong style={{ color: "var(--green)" }}>${stats.total.toFixed(2)}</strong>
                      </td>
                      <td suppressHydrationWarning>{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <Users size={32} />
              <p>No customer profiles registered yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

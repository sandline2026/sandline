import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import "../admin.css";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: orders } = await supabase
    .from("orders")
    .select("*, customers(full_name, email)")
    .order("created_at", { ascending: false });

  const { data: customers } = await supabase.from("customers").select("id");

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_usd || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const totalCustomers = customers?.length || 0;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Overview of your store's performance</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="value">${totalRevenue.toFixed(2)}</div>
            <div className="label">Total Revenue</div>
          </div>
          <div className="admin-stat-card">
            <div className="value">{totalOrders}</div>
            <div className="label">Total Orders</div>
          </div>
          <div className="admin-stat-card">
            <div className="value">{pendingOrders}</div>
            <div className="label">Pending Orders</div>
          </div>
          <div className="admin-stat-card">
            <div className="value">{totalCustomers}</div>
            <div className="label">Total Customers</div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Recent Orders</h2>
          </div>
          {orders && orders.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.customers?.full_name || "—"}</td>
                    <td>{order.customers?.email || "—"}</td>
                    <td>${Number(order.total_usd).toFixed(2)}</td>
                    <td><span className={`pill pill-${order.status}`}>{order.status}</span></td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">No orders yet.</div>
          )}
        </div>
      </main>
    </div>
  );
}

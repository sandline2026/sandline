import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import "../sandline.css";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: orders } = await supabase
    .from("orders")
    .select("*, customers(full_name, email)")
    .order("created_at", { ascending: false });

  const { data: customers } = await supabase.from("customers").select("id");

  const totalRevenue =
    orders?.reduce((sum, o) => sum + Number(o.total_usd || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const totalCustomers = customers?.length || 0;

  return (
    <div className="sandline-page">
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
        <div className="nav-links">
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: "11px", textTransform: "uppercase" }}>
            Admin
          </span>
        </div>
      </nav>

      <div className="shop-header">
        <h1>Dashboard.</h1>
      </div>

      <div className="admin-wrap">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="num">${totalRevenue.toFixed(2)}</div>
            <div className="lbl">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="num">{totalOrders}</div>
            <div className="lbl">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="num">{pendingOrders}</div>
            <div className="lbl">Pending Orders</div>
          </div>
          <div className="stat-card">
            <div className="num">{totalCustomers}</div>
            <div className="lbl">Total Customers</div>
          </div>
        </div>

        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Recent Orders</h2>

        {orders && orders.length > 0 ? (
          <table className="admin-table">
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
                  <td>
                    <span className={`status-pill status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">No orders yet.</p>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import AdminOrdersTable, { Order } from "@/components/AdminOrdersTable";
import { ShoppingBag, Clock, Truck, DollarSign } from "lucide-react";
import "../../admin.css";

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: rawOrders } = await supabase
    .from("orders")
    .select(`
      *,
      customers (id, full_name, email, address_line, city, country, postal_code),
      order_items (id, quantity, unit_price_usd, unit_cost_inr, size, color, products (name, slug)),
      payments (id, gateway, gateway_transaction_id, amount_usd, gateway_fee_usd, status)
    `)
    .order("created_at", { ascending: false });

  const orders: Order[] = (rawOrders as unknown as Order[]) || [];

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "processing"
  ).length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const grossRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_usd || 0), 0);

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Orders Management"
          subtitle="Track customer orders, inspect shipping destinations, and update fulfillment states"
        />

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Orders</span>
              <div className="admin-stat-icon-wrapper blue">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="value">{totalOrders}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">Lifetime</span>
              <span>All recorded orders</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Action Needed</span>
              <div className="admin-stat-icon-wrapper amber">
                <Clock size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--amber)" }}>
              {pendingOrders}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge amber">Unfulfilled</span>
              <span>Ready for dispatch</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">In Transit / Shipped</span>
              <div className="admin-stat-icon-wrapper purple">
                <Truck size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--purple)" }}>
              {shippedOrders}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">{deliveredOrders} delivered</span>
              <span>En route to customer</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Gross Sales</span>
              <div className="admin-stat-icon-wrapper green">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--green)" }}>
              ${grossRevenue.toFixed(2)}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Processed</span>
              <span>Completed transactions</span>
            </div>
          </div>
        </div>

        {/* Interactive Orders Table with Search, Tabs, and Details Drawer */}
        <AdminOrdersTable initialOrders={orders} />
      </main>
    </div>
  );
}

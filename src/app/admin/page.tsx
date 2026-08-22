import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  PlusCircle,
  Tag,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
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
  const pendingOrders = orders?.filter((o) => o.status === "pending" || o.status === "confirmed").length || 0;
  const totalCustomers = customers?.length || 0;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Dashboard Overview"
          subtitle="Real-time performance metrics and store activity for Sandline"
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Link href="/admin/products" className="admin-btn admin-btn-ghost admin-btn-sm">
                <PlusCircle size={15} />
                <span>Add Product</span>
              </Link>
              <Link href="/admin/orders" className="admin-btn admin-btn-sm">
                <span>View All Orders</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          }
        />

        {/* Luxury Stat Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Revenue</span>
              <div className="admin-stat-icon-wrapper gold">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="value">${totalRevenue.toFixed(2)}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Live Sync</span>
              <span>All-time gross volume</span>
            </div>
          </div>

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
              <span>Processed checkout orders</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Pending Action</span>
              <div className="admin-stat-icon-wrapper amber">
                <Clock size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--amber)" }}>
              {pendingOrders}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge amber">Fulfillment</span>
              <span>Needs packing & shipping</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Customers</span>
              <div className="admin-stat-icon-wrapper purple">
                <Users size={20} />
              </div>
            </div>
            <div className="value">{totalCustomers}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Verified</span>
              <span>Registered customer profiles</span>
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="admin-quick-actions-grid">
          <Link href="/admin/orders" className="admin-action-card">
            <div className="admin-action-card-icon">
              <ShoppingBag size={20} />
            </div>
            <div className="admin-action-card-info">
              <h4>Manage Orders</h4>
              <p>Filter by status and update courier tracking</p>
            </div>
          </Link>

          <Link href="/admin/analytics" className="admin-action-card">
            <div className="admin-action-card-icon">
              <TrendingUp size={20} />
            </div>
            <div className="admin-action-card-info">
              <h4>Profit & Margins</h4>
              <p>Analyze COGS, gateway fees & net revenue</p>
            </div>
          </Link>

          <Link href="/admin/coupons" className="admin-action-card">
            <div className="admin-action-card-icon">
              <Tag size={20} />
            </div>
            <div className="admin-action-card-info">
              <h4>Promo Coupons</h4>
              <p>Create discount codes & campaign promos</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <ShoppingBag size={18} />
              <span>Recent Orders</span>
            </h2>
            <Link href="/admin/orders" className="admin-btn admin-btn-ghost admin-btn-sm">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order: any) => {
                  const customerName = order.customers?.full_name || "Guest Customer";
                  const initial = customerName.charAt(0).toUpperCase();

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong style={{ color: "var(--ink)" }}>{order.order_number}</strong>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className="admin-user-avatar">{initial}</div>
                          <div>
                            <strong>{customerName}</strong>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {order.customers?.email || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>${Number(order.total_usd).toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`pill pill-${order.status}`}>{order.status}</span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <Link
                          href="/admin/orders"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ textDecoration: "none" }}
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <ShoppingBag size={32} />
              <p>No orders recorded yet. Orders placed on the storefront will appear here live.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

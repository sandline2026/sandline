import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import AdminOrdersTable, { Order } from "@/components/AdminOrdersTable";
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

  const [{ data: rawOrders }, { data: allProducts }, { data: customers }] = await Promise.all([
    supabase
      .from("orders")
      .select(`
        *,
        customers (id, full_name, email, phone, address_line, city, country, postal_code),
        order_items (id, product_id, quantity, unit_price_usd, unit_cost_inr, size, color),
        payments (id, gateway, gateway_transaction_id, amount_usd, gateway_fee_usd, status)
      `)
      .order("created_at", { ascending: false }),
    supabase.from("products").select("id, name, slug"),
    supabase.from("customers").select("id"),
  ]);

  const productMap = new Map((allProducts || []).map((p: any) => [p.id, p]));

  const orders: Order[] = ((rawOrders as any[]) || []).map((order) => ({
    ...order,
    order_items: (order.order_items || []).map((item: any) => ({
      ...item,
      products: productMap.get(item.product_id) || {
        name: item.product_id || "Handcrafted Resortwear",
        slug: "",
      },
    })),
  }));

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_usd || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
  const totalCustomers = customers?.length || 0;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Dashboard Overview"
          subtitle="Real-time performance metrics and store activity for Sandline"
          actions={
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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

        {/* Top Metric Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Gross Revenue</span>
              <div className="admin-stat-icon-wrapper green">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="value">${totalRevenue.toFixed(2)}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Live</span>
              <span>All sales recorded</span>
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
              <span>All customer orders</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Active / In-Process</span>
              <div className="admin-stat-icon-wrapper amber">
                <Clock size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--amber)" }}>
              {pendingOrders}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge amber">Fulfillment</span>
              <span>Needs dispatch / tailoring</span>
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
              <span className="admin-stat-badge neutral">Unique</span>
              <span>Registered buyers</span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="admin-quick-actions">
          <Link href="/admin/orders" className="admin-action-card">
            <div className="admin-action-card-icon blue">
              <ShoppingBag size={20} />
            </div>
            <div className="admin-action-card-info">
              <h4>Manage Orders &amp; WhatsApp</h4>
              <p>Inspect garments, update status, and send WhatsApp receipts</p>
            </div>
          </Link>

          <Link href="/admin/analytics" className="admin-action-card">
            <div className="admin-action-card-icon green">
              <TrendingUp size={20} />
            </div>
            <div className="admin-action-card-info">
              <h4>Profit &amp; Unit Economics</h4>
              <p>Net margins, COGS, dropshipping and Stripe fees</p>
            </div>
          </Link>

          <Link href="/admin/coupons" className="admin-action-card">
            <div className="admin-action-card-icon amber">
              <Tag size={20} />
            </div>
            <div className="admin-action-card-info">
              <h4>Promo Coupons</h4>
              <p>Create discount codes &amp; campaign promos</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders Section with interactive Drawer */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <ShoppingBag size={18} />
              <span>Recent Orders ({orders.length})</span>
            </h2>
            <Link href="/admin/orders" className="admin-btn admin-btn-ghost admin-btn-sm">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <AdminOrdersTable orders={orders.slice(0, 6)} />
        </div>
      </main>
    </div>
  );
}

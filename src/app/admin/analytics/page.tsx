import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import SalesChart from "@/components/SalesChart";
import AdminNav from "@/components/AdminNav";
import "../../admin.css";

const INR_TO_USD = 83;

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: weeklySales } = await supabase.from("weekly_sales").select("*").order("week_start", { ascending: true });
  const { data: trafficRows } = await supabase.from("traffic_summary").select("*");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total_usd, status, created_at")
    .order("created_at", { ascending: false });

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("order_id, quantity, unit_cost_inr");

  const { data: payments } = await supabase
    .from("payments")
    .select("order_id, gateway_fee_usd, status");

  const { data: returns } = await supabase
    .from("returns")
    .select("order_id, status");

  const cogsByOrder: Record<string, number> = {};
  orderItems?.forEach((oi: any) => {
    cogsByOrder[oi.order_id] = (cogsByOrder[oi.order_id] || 0) + (Number(oi.unit_cost_inr) * oi.quantity) / INR_TO_USD;
  });

  const feeByOrder: Record<string, number> = {};
  const paidOrderIds = new Set<string>();
  payments?.forEach((p: any) => {
    feeByOrder[p.order_id] = (feeByOrder[p.order_id] || 0) + Number(p.gateway_fee_usd || 0);
    if (p.status === "paid") paidOrderIds.add(p.order_id);
  });

  const refundedOrderIds = new Set<string>();
  returns?.forEach((r: any) => {
    if (r.status === "refunded") refundedOrderIds.add(r.order_id);
  });

  const rows = (orders || []).map((o: any) => {
    const isCancelled = o.status === "cancelled" || o.status === "returned" || refundedOrderIds.has(o.id);
    const revenue = isCancelled ? 0 : Number(o.total_usd);
    const cogs = isCancelled ? 0 : cogsByOrder[o.id] || 0;
    const fee = isCancelled ? 0 : feeByOrder[o.id] || 0;
    const netProfit = revenue - cogs - fee;
    return { ...o, revenue, cogs, fee, netProfit, isCancelled, isPaid: paidOrderIds.has(o.id) };
  });

  const validOrders = rows.filter((r) => !r.isCancelled);
  const totalRevenue = validOrders.reduce((sum, r) => sum + r.revenue, 0);
  const totalCogs = validOrders.reduce((sum, r) => sum + r.cogs, 0);
  const totalFees = validOrders.reduce((sum, r) => sum + r.fee, 0);
  const totalProfit = totalRevenue - totalCogs - totalFees;
  const aov = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;
  const cancelledCount = rows.length - validOrders.length;

  const chartData = weeklySales?.map((w: any) => ({
    week: new Date(w.week_start).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Number(w.total_revenue_usd || 0),
    orders: w.total_orders,
  })) || [];

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Analytics</h1>
          <p>Real profit after cost of goods, payment fees, and refunds</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="value">${totalRevenue.toFixed(2)}</div>
            <div className="label">Net Revenue</div>
          </div>
          <div className="admin-stat-card">
            <div className="value">${totalProfit.toFixed(2)}</div>
            <div className="label">Net Profit</div>
          </div>
          <div className="admin-stat-card">
            <div className="value">${aov.toFixed(2)}</div>
            <div className="label">Avg. Order Value</div>
          </div>
          <div className="admin-stat-card">
            <div className="value">{cancelledCount}</div>
            <div className="label">Cancelled / Refunded</div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header"><h2>Weekly Revenue</h2></div>
          <div className="admin-section-body">
            {chartData.length > 0 ? <SalesChart data={chartData} /> : <div className="admin-empty">No sales data yet.</div>}
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header"><h2>Profit Breakdown Per Order</h2></div>
          {rows.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Revenue</th>
                  <th>COGS</th>
                  <th>Gateway Fee</th>
                  <th>Net Profit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.order_number}</td>
                    <td>{r.isCancelled ? "—" : `$${r.revenue.toFixed(2)}`}</td>
                    <td>{r.isCancelled ? "—" : `$${r.cogs.toFixed(2)}`}</td>
                    <td>{r.isCancelled ? "—" : `$${r.fee.toFixed(2)}`}</td>
                    <td style={{ color: r.isCancelled ? "#9CA3AF" : r.netProfit >= 0 ? "#059669" : "#DC2626", fontWeight: 600 }}>
                      {r.isCancelled ? "$0.00" : `$${r.netProfit.toFixed(2)}`}
                    </td>
                    <td>
                      <span className={`pill pill-${r.isCancelled ? "cancelled" : r.status}`}>
                        {r.isCancelled ? "refunded/cancelled" : r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="admin-empty">No orders yet.</div>}
        </div>

        <div className="admin-section">
          <div className="admin-section-header"><h2>Traffic Source Breakdown</h2></div>
          {trafficRows && trafficRows.length > 0 ? (
            <table className="admin-data-table">
              <thead><tr><th>Source</th><th>Orders</th><th>Revenue</th></tr></thead>
              <tbody>
                {trafficRows.map((t: any) => (
                  <tr key={t.traffic_source}>
                    <td>{t.traffic_source || "Unknown"}</td>
                    <td>{t.total_orders}</td>
                    <td>${Number(t.total_revenue_usd).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="admin-empty">No traffic data yet.</div>}
        </div>
      </main>
    </div>
  );
}

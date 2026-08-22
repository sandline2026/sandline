import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import NotifyToggleButton from "@/components/NotifyToggleButton";
import "../../admin.css";

export default async function NotifyRequestsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: requests } = await supabase
    .from("notify_me_requests")
    .select("*, products(name, slug, stock_status)")
    .order("created_at", { ascending: false });

  const pendingCount = requests?.filter((r: any) => !r.notified).length || 0;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Notify Me Requests</h1>
          <p>Customers waiting on out-of-stock products</p>
        </div>

        <div className="admin-stats-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="admin-stat-card">
            <div className="value">{requests?.length || 0}</div>
            <div className="label">Total Requests</div>
          </div>
          <div className="admin-stat-card">
            <div className="value">{pendingCount}</div>
            <div className="label">Pending</div>
          </div>
        </div>

        <div className="admin-section">
          {requests && requests.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Customer Email</th>
                  <th>Requested</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id}>
                    <td>{r.products?.name || "—"}</td>
                    <td>
                      <span className={`pill pill-${r.products?.stock_status === "in_stock" ? "active" : "inactive"}`}>
                        {r.products?.stock_status || "unknown"}
                      </span>
                    </td>
                    <td>{r.email}</td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td><NotifyToggleButton id={r.id} notified={r.notified} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">No notify-me requests yet.</div>
          )}
        </div>
      </main>
    </div>
  );
}

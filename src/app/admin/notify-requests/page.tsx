import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import NotifyToggleButton from "@/components/NotifyToggleButton";
import { buildWhatsAppLink, getWhatsAppRestockAlertMessage } from "@/lib/whatsapp";
import { BellRing, Clock, CheckCircle2 } from "lucide-react";
import "../../admin.css";

export default async function NotifyRequestsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: requests } = await supabase
    .from("notify_me_requests")
    .select("*, products(name, slug, stock_status)")
    .order("created_at", { ascending: false });

  const totalRequests = requests?.length || 0;
  const pendingCount = requests?.filter((r: any) => !r.notified).length || 0;
  const notifiedCount = totalRequests - pendingCount;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Restock Notifications & Waitlist"
          subtitle="Shoppers waiting for out-of-stock garments to be replenished with 1-click outreach"
        />

        {/* Stats Grid */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Inquiries</span>
              <div className="admin-stat-icon-wrapper blue">
                <BellRing size={20} />
              </div>
            </div>
            <div className="value">{totalRequests}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">All time</span>
              <span>Waitlist size</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Pending Outreach</span>
              <div className="admin-stat-icon-wrapper amber">
                <Clock size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--amber)" }}>
              {pendingCount}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge amber">Awaiting restock</span>
              <span>Ready for alert</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Notified Shoppers</span>
              <div className="admin-stat-icon-wrapper green">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--green)" }}>
              {notifiedCount}
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Completed</span>
              <span>Restock alerts sent</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <BellRing size={18} />
              <span>Waitlist Requests ({totalRequests})</span>
            </h2>
          </div>
          {requests && requests.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Requested Silhouette</th>
                  <th>Current Stock</th>
                  <th>Customer Email</th>
                  <th>Date Requested</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ color: "var(--ink)" }}>{r.products?.name || "—"}</strong>
                    </td>
                    <td>
                      <span
                        className={`pill pill-${
                          r.products?.stock_status === "in_stock" ? "active" : "inactive"
                        }`}
                      >
                        {r.products?.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{r.email}</span>
                    </td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <NotifyToggleButton id={r.id} notified={r.notified} />
                        <a
                          href={buildWhatsAppLink(
                            "",
                            getWhatsAppRestockAlertMessage({
                              productName: r.products?.name || "Sandline Garment",
                              productSlug: r.products?.slug,
                            })
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{
                            color: "#065F46",
                            borderColor: "#A7F3D0",
                            background: "#ECFDF5",
                            textDecoration: "none",
                            fontSize: "11.5px",
                          }}
                          title="Launch WhatsApp with pre-filled Restock message"
                        >
                          📲 WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <BellRing size={32} />
              <p>No restock requests logged yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

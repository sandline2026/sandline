import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import "../../admin.css";

export default async function ChatsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: chats } = await supabase
    .from("chats")
    .select("*")
    .order("created_at", { ascending: false });

  const totalChats = chats?.length || 0;
  const activeChats = chats?.filter((c: any) => c.status === "active" || c.status === "open").length || 0;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Customer Support Chats"
          subtitle="Real-time shopper conversations, dress fit consultations, and customer care"
        />

        {/* Stats Grid */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Conversations</span>
              <div className="admin-stat-icon-wrapper blue">
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="value">{totalChats}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">All sessions</span>
              <span>Inbound customer inquiries</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Open / Active Inquiries</span>
              <div className="admin-stat-icon-wrapper amber">
                <Clock size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--amber)" }}>{activeChats}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge amber">Awaiting reply</span>
              <span>Real-time queue</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <MessageSquare size={18} />
              <span>Customer Conversations ({totalChats})</span>
            </h2>
          </div>
          {chats && chats.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Customer Email</th>
                  <th>Status</th>
                  <th>Started Date</th>
                </tr>
              </thead>
              <tbody>
                {chats.map((c: any) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ color: "var(--ink)" }}>{c.customer_email || "Anonymous Shopper"}</strong>
                    </td>
                    <td>
                      <span className={`pill pill-${c.status === "resolved" ? "confirmed" : "pending"}`}>
                        {c.status || "open"}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <MessageSquare size={32} />
              <p>No customer chats initiated yet. Customer chat messages from the storefront will appear here live.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

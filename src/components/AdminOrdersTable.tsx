"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price_usd: number;
  unit_cost_inr?: number;
  size?: string | null;
  color?: string | null;
  products?: {
    name: string;
    slug?: string;
  } | null;
}

export interface PaymentInfo {
  id: string;
  gateway: string;
  gateway_transaction_id?: string | null;
  amount_usd: number;
  gateway_fee_usd?: number | null;
  status: string;
}

export interface CustomerInfo {
  id?: string;
  full_name: string;
  email: string;
  phone?: string | null;
  address_line?: string | null;
  city?: string | null;
  country?: string | null;
  postal_code?: string | null;
}

function formatOrderDate(dateString?: string | null): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return "—";
  }
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal_usd: number;
  discount_usd: number;
  shipping_usd: number;
  total_usd: number;
  traffic_source?: string | null;
  created_at: string;
  customers?: CustomerInfo | null;
  order_items?: OrderItem[] | null;
  payments?: PaymentInfo[] | null;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersTable({
  initialOrders,
  orders: incomingOrders,
}: {
  initialOrders?: Order[];
  orders?: Order[];
}) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders || incomingOrders || []);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Filter orders by status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" ? true : order.status?.toLowerCase() === selectedStatus.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesNumber = order.order_number?.toLowerCase().includes(query);
    const matchesName = order.customers?.full_name?.toLowerCase().includes(query);
    const matchesEmail = order.customers?.email?.toLowerCase().includes(query);
    const matchesCountry = order.customers?.country?.toLowerCase().includes(query);
    const matchesItems = order.order_items?.some((item) =>
      item.products?.name?.toLowerCase().includes(query)
    );

    return matchesStatus && (matchesNumber || matchesName || matchesEmail || matchesCountry || matchesItems);
  });

  // Calculate status counts
  const counts: Record<string, number> = {
    all: orders.length,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((o) => {
    const st = o.status?.toLowerCase();
    if (counts[st] !== undefined) {
      counts[st] += 1;
    }
  });

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(true);
    setUpdateMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update order status");
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      setUpdateMessage("Status updated successfully!");
      setTimeout(() => setUpdateMessage(null), 3000);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      alert("Error: " + message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      {/* Toolbar: Filter Tabs & Search */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${selectedStatus === "all" ? "active" : ""}`}
            onClick={() => setSelectedStatus("all")}
          >
            All <span className="admin-tab-count">{counts.all}</span>
          </button>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`admin-tab ${selectedStatus === opt.value ? "active" : ""}`}
              onClick={() => setSelectedStatus(opt.value)}
            >
              {opt.label}{" "}
              <span className="admin-tab-count">{counts[opt.value] || 0}</span>
            </button>
          ))}
        </div>

        <div className="admin-search-box">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search order #, customer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-section">
        {filteredOrders.length > 0 ? (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const totalItemQty =
                  order.order_items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
                return (
                  <tr
                    key={order.id}
                    className="order-clickable-row"
                    onClick={() => setActiveOrder(order)}
                  >
                    <td>
                      <strong style={{ color: "var(--ink)", fontFamily: "'Space Mono', monospace" }}>
                        {order.order_number}
                      </strong>
                    </td>
                    <td suppressHydrationWarning>{formatOrderDate(order.created_at)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="admin-user-avatar">
                          {(order.customers?.full_name || "G").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{order.customers?.full_name || "Guest Customer"}</strong>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            {order.customers?.email || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{order.customers?.country || order.customers?.city || "—"}</td>
                    <td>
                      {totalItemQty > 0 ? (
                        <span>
                          {totalItemQty} {totalItemQty === 1 ? "item" : "items"}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <strong>${Number(order.total_usd || 0).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`pill pill-${order.status}`}>{order.status}</span>
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOrder(order);
                        }}
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">
            {orders.length === 0
              ? "No orders found in the database."
              : "No orders match your filter/search criteria."}
          </div>
        )}
      </div>

      {/* Order Detail Modal / Drawer */}
      {activeOrder && (
        <div className="admin-modal-overlay" onClick={() => setActiveOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h2>Order {activeOrder.order_number}</h2>
                <span suppressHydrationWarning style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Placed on {formatOrderDate(activeOrder.created_at)}
                </span>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setActiveOrder(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Status Update Bar */}
              <div className="order-status-bar">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Current Status:</span>
                  <span className={`pill pill-${activeOrder.status}`}>{activeOrder.status}</span>
                  {updateMessage && (
                    <span style={{ fontSize: "12.5px", color: "var(--green)", fontWeight: 600 }}>
                      ✓ {updateMessage}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label htmlFor="status-select" style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                    Change to:
                  </label>
                  <select
                    id="status-select"
                    className="order-status-selector"
                    value={activeOrder.status}
                    disabled={updating}
                    onChange={(e) => handleStatusChange(activeOrder.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeOrder.id, activeOrder.status)}
                    disabled={updating}
                    style={{
                      background: "#111827",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "7px 12px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Space Mono', monospace",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {updating ? "Sending..." : "✉️ Send Email"}
                  </button>
                </div>
              </div>

              {/* Automated Customer Email Notification Status */}
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px", padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "16px" }}>✉️</span>
                  <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#166534", margin: 0, letterSpacing: "0.04em" }}>
                    Automated Email Notifications (Active)
                  </h3>
                </div>
                <p style={{ fontSize: "12.5px", color: "#14532D", margin: 0, lineHeight: 1.5 }}>
                  When you update status to <strong>Dispatched</strong>, <strong>Shipped</strong>, or <strong>Delivered</strong>, an official branded update email is automatically sent to <strong>{activeOrder.customers?.email || "customer"}</strong>.
                </p>
              </div>

              {/* Customer & Shipping Information */}
              <div className="order-info-grid">
                <div className="order-card-box">
                  <h3>Customer & Shipping Address</h3>
                  <p>
                    <strong>{activeOrder.customers?.full_name || "—"}</strong>
                  </p>
                  <p style={{ color: "var(--text-muted)" }}>{activeOrder.customers?.email || "—"}</p>
                  {activeOrder.customers?.phone && (
                    <p style={{ color: "#059669", fontWeight: 600, fontSize: "13px" }}>
                      📞 {activeOrder.customers.phone}
                    </p>
                  )}
                  <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "10px 0" }} />
                  <p>{activeOrder.customers?.address_line || "No street address provided"}</p>
                  <p>
                    {[
                      activeOrder.customers?.city,
                      activeOrder.customers?.postal_code,
                      activeOrder.customers?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>

                <div className="order-card-box">
                  <h3>Payment & Order Summary</h3>
                  {activeOrder.payments && activeOrder.payments.length > 0 ? (
                    activeOrder.payments.map((p) => (
                      <div key={p.id} style={{ marginBottom: "8px" }}>
                        <p>
                          <strong>Payment Method:</strong> {p.gateway?.toUpperCase() || "STRIPE"}
                        </p>
                        <p>
                          <strong>Payment Status:</strong>{" "}
                          <span className={`pill pill-${p.status === "paid" ? "confirmed" : "pending"}`}>
                            {p.status}
                          </span>
                        </p>
                        {p.gateway_transaction_id && (
                          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            <strong>Txn ID:</strong> {p.gateway_transaction_id}
                          </p>
                        )}
                        {p.gateway_fee_usd !== undefined && p.gateway_fee_usd !== null && (
                          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            <strong>Gateway Fee:</strong> ${Number(p.gateway_fee_usd).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "var(--text-muted)" }}>Payment record pending</p>
                  )}
                  <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "10px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span>Subtotal:</span>
                    <span>${Number(activeOrder.subtotal_usd || activeOrder.total_usd || 0).toFixed(2)}</span>
                  </div>
                  {Number(activeOrder.discount_usd) > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--green)" }}>
                      <span>Discount:</span>
                      <span>-${Number(activeOrder.discount_usd).toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 700, marginTop: "6px" }}>
                    <span>Total Paid:</span>
                    <span>${Number(activeOrder.total_usd || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>Ordered Items</h3>
                <div className="order-items-list">
                  {activeOrder.order_items && activeOrder.order_items.length > 0 ? (
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Size</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder.order_items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>{item.products?.name || "Sandline Garment"}</strong>
                            </td>
                            <td>{item.size || "Standard"}</td>
                            <td>{item.quantity}</td>
                            <td>${Number(item.unit_price_usd || 0).toFixed(2)}</td>
                            <td>${(Number(item.unit_price_usd || 0) * (item.quantity || 1)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                      No items breakdown recorded for this order.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

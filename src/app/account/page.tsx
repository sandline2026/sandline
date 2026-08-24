"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/../utils/supabase/client";
import { useCart } from "@/context/CartContext";
import "@/app/sandline.css";

interface OrderItem {
  id: string;
  quantity: number;
  unit_price_usd: number;
  size: string | null;
  color: string | null;
  products: {
    name: string;
    images: string[] | null;
    slug: string;
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_usd: number;
  subtotal_usd: number;
  discount_usd: number;
  shipping_usd: number;
  tracking_number?: string | null;
  carrier?: string | null;
  order_items: OrderItem[];
}

interface CustomerProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  address_line: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "wishlist">("orders");

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "India",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function loadAccountData() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user || !session.user.email) {
        router.push("/account/login?next=/account");
        return;
      }

      const email = session.user.email.toLowerCase();
      setUserEmail(email);

      // 1. Fetch customer profile
      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (customerData) {
        setProfile(customerData);
        setProfileForm({
          full_name: customerData.full_name || "",
          phone: customerData.phone || "",
          address_line: customerData.address_line || "",
          city: customerData.city || "",
          postal_code: customerData.postal_code || "",
          country: customerData.country || "India",
        });

        // 2. Fetch orders linked to this customer
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              id,
              quantity,
              unit_price_usd,
              size,
              color,
              products (name, images, slug)
            )
          `)
          .eq("customer_id", customerData.id)
          .order("created_at", { ascending: false });

        if (!ordersError && ordersData) {
          setOrders(ordersData as Order[]);
        }
      }

      setLoading(false);
    }

    loadAccountData();
  }, [router, supabase]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");
    setProfileError("");

    try {
      if (profile?.id) {
        const { error } = await supabase
          .from("customers")
          .update(profileForm)
          .eq("id", profile.id);

        if (error) throw error;
      } else {
        const { data: newCust, error } = await supabase
          .from("customers")
          .insert({
            email: userEmail,
            ...profileForm,
            acquisition_source: "account_profile",
          })
          .select()
          .single();

        if (error) throw error;
        setProfile(newCust);
      }

      setProfileMessage("Shipping address and profile updated successfully!");
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "paid":
        return { bg: "#EBF5FF", text: "#1E40AF", border: "#BFDBFE", label: "Confirmed • In Atelier" };
      case "shipped":
        return { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0", label: "Dispatched • Express Transit" };
      case "delivered":
        return { bg: "#FAF5FF", text: "#6B21A8", border: "#E9D5FF", label: "Delivered" };
      case "cancelled":
        return { bg: "#FDF2F2", text: "#9B1C1C", border: "#F8B4B4", label: "Cancelled" };
      default:
        return { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", label: "Order Pending" };
    }
  };

  if (loading) {
    return (
      <div className="sandline-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#1A1A1A", marginBottom: "12px" }}>
            Loading Your Client Portal...
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#8C6D58" }}>
            ✦ SANDLINE STUDIO JAIPUR
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sandline-page" style={{ minHeight: "100vh", background: "#FAF8F5" }}>
      {/* Top Navbar */}
      <nav>
        <Link className="logo brand-logo-wrap" href="/"><img src="/images/logo-horizontal.png" alt="SANDLINE Resort Wear" className="site-brand-logo" /></Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="/story">Story</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "140px 24px 80px" }}>
        
        {/* Welcome Header & Sign Out Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.5px", color: "#8C6D58", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              ✦ VIP CLIENT DASHBOARD
            </span>
            <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(30px, 4.5vw, 44px)", margin: "0 0 6px", color: "#1A1A1A", fontWeight: "500" }}>
              Welcome, {profile?.full_name || userEmail.split("@")[0]}.
            </h1>
            <p style={{ fontSize: "14.5px", color: "#666", margin: 0 }}>
              Logged in as <strong style={{ color: "#1A1A1A" }}>{userEmail}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href="/shop"
              style={{
                background: "#1A1A1A",
                color: "white",
                padding: "10px 22px",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Explore Shop →
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                background: "white",
                border: "1px solid #EAE6DF",
                color: "#666",
                padding: "10px 20px",
                borderRadius: "30px",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #EAE6DF", marginBottom: "32px" }}>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "12px 24px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "orders" ? "2px solid #1A1A1A" : "2px solid transparent",
              color: activeTab === "orders" ? "#1A1A1A" : "#888",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "12px 24px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "profile" ? "2px solid #1A1A1A" : "2px solid transparent",
              color: activeTab === "profile" ? "#1A1A1A" : "#888",
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Saved Address &amp; Profile
          </button>
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div style={{ background: "white", borderRadius: "20px", border: "1px solid #EAE6DF", padding: "60px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>🛍️</div>
                <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#1A1A1A", marginBottom: "8px" }}>
                  No Orders Placed Yet.
                </h3>
                <p style={{ color: "#666", fontSize: "14.5px", maxWidth: "420px", margin: "0 auto 24px", lineHeight: "1.6" }}>
                  Your handcrafted resortwear orders will appear here with live express tracking and digital receipts.
                </p>
                <Link
                  href="/shop"
                  style={{
                    display: "inline-block",
                    background: "#1A1A1A",
                    color: "white",
                    padding: "14px 32px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  Discover The Catalog →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {orders.map((order) => {
                  const statusInfo = getStatusColor(order.status);
                  return (
                    <div
                      key={order.id}
                      style={{
                        background: "white",
                        borderRadius: "20px",
                        border: "1px solid #EAE6DF",
                        padding: "28px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                      }}
                    >
                      {/* Order Header Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", paddingBottom: "20px", borderBottom: "1px solid #F0ECE6" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "16px", fontWeight: "700", color: "#1A1A1A" }}>
                              {order.order_number}
                            </span>
                            <span
                              style={{
                                background: statusInfo.bg,
                                color: statusInfo.text,
                                border: `1px solid ${statusInfo.border}`,
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "11.5px",
                                fontWeight: "600",
                                fontFamily: "'Space Mono', monospace",
                              }}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#777" }}>
                            Placed on {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "18px", fontWeight: "700", color: "#1A1A1A" }}>
                            ${Number(order.total_usd).toFixed(2)} USD
                          </div>
                          <div style={{ fontSize: "12px", color: "#8C6D58" }}>
                            Complimentary Express Delivery
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div style={{ padding: "20px 0" }}>
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              padding: "12px 0",
                              borderBottom: "1px solid #FAF8F5",
                            }}
                          >
                            <div style={{ width: "64px", height: "80px", borderRadius: "10px", overflow: "hidden", background: "#FAF8F5", border: "1px solid #EAE6DF", flexShrink: 0 }}>
                              <img
                                src={item.products?.images?.[0] || "/images/products/santorini-3d-floral-silk-slip-dress.jpg"}
                                alt={item.products?.name || "Garment"}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontFamily: "Fraunces, serif", fontSize: "16px", margin: "0 0 4px", color: "#1A1A1A" }}>
                                {item.products?.name || "Handcrafted Silhouette"}
                              </h4>
                              <div style={{ fontSize: "13px", color: "#777", fontFamily: "'Space Mono', monospace" }}>
                                {item.size ? `Size: ${item.size}` : ""} {item.color ? `• Color: ${item.color}` : ""} • Qty: {item.quantity}
                              </div>
                            </div>
                            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", fontWeight: "600", color: "#1A1A1A" }}>
                              ${(item.unit_price_usd * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking / Assistance Footer */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "16px", borderTop: "1px solid #F0ECE6" }}>
                        <div style={{ fontSize: "13px", color: "#666" }}>
                          {order.tracking_number ? (
                            <span>Tracking: <strong>{order.carrier || "DHL Express"} #{order.tracking_number}</strong></span>
                          ) : (
                            <span>✨ Handcrafted &amp; prepared at Jaipur Atelier</span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <a
                            href={`https://wa.me/919999999999?text=Hi%20Sandline,%20I%20have%20a%20query%20regarding%20Order%20${order.order_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: "#FAF8F5",
                              border: "1px solid #EAE6DF",
                              color: "#1A1A1A",
                              padding: "8px 16px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "600",
                              textDecoration: "none",
                              fontFamily: "'Space Mono', monospace",
                            }}
                          >
                            Concierge Help ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & SAVED ADDRESS */}
        {activeTab === "profile" && (
          <div style={{ background: "white", borderRadius: "20px", border: "1px solid #EAE6DF", padding: "36px" }}>
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", margin: "0 0 6px" }}>
                Default Shipping Address &amp; Contact
              </h3>
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                These details will automatically pre-fill on checkout for instant 1-click ordering.
              </p>
            </div>

            {profileMessage && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", padding: "12px 16px", borderRadius: "12px", fontSize: "13.5px", marginBottom: "20px" }}>
                ✓ {profileMessage}
              </div>
            )}

            {profileError && (
              <div style={{ background: "#FDF2F2", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "12px 16px", borderRadius: "12px", fontSize: "13.5px", marginBottom: "20px" }}>
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1A1A1A", marginBottom: "6px", textTransform: "uppercase" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    placeholder="e.g. Chloe Montgomery"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #D5D1CA", fontSize: "14px", background: "#FAF8F5", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1A1A1A", marginBottom: "6px", textTransform: "uppercase" }}>
                    Phone (with country code)
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="e.g. +1 555 019 2834"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #D5D1CA", fontSize: "14px", background: "#FAF8F5", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1A1A1A", marginBottom: "6px", textTransform: "uppercase" }}>
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.address_line}
                  onChange={(e) => setProfileForm({ ...profileForm, address_line: e.target.value })}
                  placeholder="e.g. 142 Ocean Breeze Boulevard, Apt 4B"
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #D5D1CA", fontSize: "14px", background: "#FAF8F5", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "28px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1A1A1A", marginBottom: "6px", textTransform: "uppercase" }}>
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    placeholder="e.g. Los Angeles"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #D5D1CA", fontSize: "14px", background: "#FAF8F5", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1A1A1A", marginBottom: "6px", textTransform: "uppercase" }}>
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.postal_code}
                    onChange={(e) => setProfileForm({ ...profileForm, postal_code: e.target.value })}
                    placeholder="e.g. 90291"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #D5D1CA", fontSize: "14px", background: "#FAF8F5", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#1A1A1A", marginBottom: "6px", textTransform: "uppercase" }}>
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    placeholder="e.g. United States"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #D5D1CA", fontSize: "14px", background: "#FAF8F5", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                style={{
                  background: "#1A1A1A",
                  color: "white",
                  padding: "14px 32px",
                  borderRadius: "30px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "none",
                  cursor: profileSaving ? "not-allowed" : "pointer",
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {profileSaving ? "Saving Address..." : "Save Shipping Details ✓"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
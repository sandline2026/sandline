import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/../utils/supabase/client";
import AccountNavButton from "@/components/AccountNavButton";
import "../sandline.css";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "India",
    postalCode: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadCustomer() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setIsLoggedIn(true);
        const { data: customer } = await supabase
          .from("customers")
          .select("*")
          .eq("email", session.user.email)
          .maybeSingle();

        if (customer) {
          setFormData({
            fullName: customer.full_name || "",
            email: customer.email || session.user.email,
            phone: customer.phone || "",
            address: customer.address_line || "",
            city: customer.city || "",
            country: customer.country || "India",
            postalCode: customer.postal_code || "",
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || "",
          }));
        }
      }
    }
    loadCustomer();
  }, []);

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    const result = await applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.error || "Invalid coupon code.");
    } else {
      setCouponInput("");
    }
    setCouponLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullName = formData.fullName;
    const email = formData.email;
    const phone = formData.phone || "";
    const address = formData.address;
    const city = formData.city;
    const country = formData.country;
    const postalCode = formData.postalCode;

    const supabase = createClient();

    try {
      let customerId: string;
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        if (phone || address) {
          await supabase
            .from("customers")
            .update({
              phone: phone || null,
              address_line: address,
              city,
              country,
              postal_code: postalCode,
              full_name: fullName,
            })
            .eq("id", customerId);
        }
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from("customers")
          .insert({
            full_name: fullName,
            email,
            phone: phone || null,
            address_line: address,
            city,
            country,
            postal_code: postalCode,
            acquisition_source: "website_direct",
          })
          .select("id")
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Fetch real cost prices + dropship fee for accurate profit tracking
      const productIds = items.map((i) => i.id);
      const { data: productRows } = await supabase
        .from("products")
        .select("id, cost_price, dropship_fee, manufacturer_id")
        .in("id", productIds);

      const costMap: Record<string, { cost: number; dropship: number; manufacturerId: string | null }> = {};
      productRows?.forEach((p: any) => {
        costMap[p.id] = {
          cost: Number(p.cost_price) || 0,
          dropship: Number(p.dropship_fee) || 0,
          manufacturerId: p.manufacturer_id,
        };
      });

      const orderNumber = "SL-" + Date.now().toString().slice(-8);
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: customerId,
          status: "pending",
          subtotal_usd: subtotal,
          discount_usd: discount,
          shipping_usd: 0,
          total_usd: total,
          traffic_source: "website_direct",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => {
        const info = costMap[item.id] || { cost: 0, dropship: 0, manufacturerId: null };
        return {
          order_id: order.id,
          product_id: item.id,
          manufacturer_id: info.manufacturerId,
          size: null,
          color: null,
          quantity: item.quantity,
          unit_price_usd: item.price,
          unit_cost_inr: info.cost + info.dropship,
        };
      });

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber,
          items,
          customerEmail: email,
          couponCode: appliedCoupon?.code || null,
          couponId: appliedCoupon?.id || null,
          discountAmount: discount,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      clearCart();
      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo" href="/">SAND<span>LINE</span></Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <AccountNavButton />
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div className="shop-header">
        <h1>Checkout.</h1>
        {!isLoggedIn && (
          <p style={{ fontSize: "13.5px", color: "#666", marginTop: "6px" }}>
            Have a Sandline account? <Link href="/account/login?next=/checkout" style={{ color: "#1A1A1A", fontWeight: "600", textDecoration: "underline" }}>Sign in with OTP</Link> to auto-fill your saved address.
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Your cart is empty.</p>
      ) : (
        <div className="checkout-wrap">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Ansh Bhatia"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </label>
            <label>
              Email (for order confirmation)
              <input
                type="email"
                name="email"
                placeholder="e.g. ansh@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>
            <label>
              WhatsApp / Phone (for express courier tracking)
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </label>
            <label>
              Street Address
              <input
                type="text"
                name="address"
                placeholder="Apartment, suite, street"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </label>
            <label>
              City
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </label>
            <label>
              Country
              <input
                type="text"
                name="country"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </label>
            <label>
              Postal / ZIP code
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </label>

            {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}

            <button className="btn" type="submit" disabled={loading} style={{ marginTop: "20px" }}>
              {loading ? "Redirecting to payment..." : `Pay — $${total.toFixed(2)}`}
            </button>
          </form>

          <div className="checkout-summary">
            {items.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-row-name">{item.name} × {item.quantity}</div>
                <div className="cart-row-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            {/* Promo Code Box */}
            <div className="promo-box" style={{ margin: "20px 0" }}>
              {appliedCoupon ? (
                <div className="promo-applied-tag">
                  <div>
                    <span>Coupon: </span>
                    <strong>{appliedCoupon.code}</strong>
                    <span style={{ fontSize: "12px", opacity: 0.85, marginLeft: "4px" }}>
                      ({appliedCoupon.discount_type === "percentage" ? `${appliedCoupon.discount_value}% off` : `$${appliedCoupon.discount_value} off`})
                    </span>
                  </div>
                  <button className="promo-remove-btn" onClick={removeCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon}>
                  <div className="promo-input-group">
                    <input
                      type="text"
                      className="promo-input"
                      placeholder="Promo code (e.g. SUMMER20)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponError) setCouponError("");
                      }}
                    />
                    <button className="promo-btn" type="submit" disabled={couponLoading}>
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="promo-error">{couponError}</p>}
                </form>
              )}
            </div>

            <div className="cart-subtotal" style={{ fontSize: "15px", marginTop: "12px" }}>
              <span style={{ color: "rgba(27,36,32,0.7)" }}>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="cart-discount-row">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

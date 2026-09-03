"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { createClient } from "@/../utils/supabase/client";
import AccountNavButton from "@/components/AccountNavButton";
import CurrencySelector from "@/components/CurrencySelector";
import "../sandline.css";

export default function CheckoutPage() {
  const { formatPrice, currency } = useCurrency();
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
    country: "United Arab Emirates",
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
    // Preload Razorpay Checkout Script for instant modal opening
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
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
          size: item.size || null,
          color: item.color || null,
          quantity: item.quantity,
          unit_price_usd: item.price,
          unit_cost_inr: info.cost + info.dropship,
        };
      });

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // Load Razorpay Checkout Script
      const isScriptLoaded = await new Promise<boolean>((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!isScriptLoaded) {
        throw new Error("Unable to load Razorpay. Please check your internet connection.");
      }

      // Create Razorpay Order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber,
          totalUsd: total,
          customerEmail: email,
          customerPhone: phone,
          couponId: appliedCoupon?.id || null,
          currency: country.trim().toLowerCase() === "india" ? "INR" : "USD",
          country,
        }),
      });

      const rzpData = await res.json();
      if (rzpData.error) throw new Error(rzpData.error);

      // Open Razorpay Payment Gateway Modal
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency || (country.trim().toLowerCase() === "india" ? "INR" : "USD"),
        name: "SANDLINE",
        description: `Order #${orderNumber} — Sandline Resortwear`,
        image: "/images/logo-emblem-trimmed.png",
        order_id: rzpData.orderId,
        prefill: {
          name: fullName,
          email,
          contact: phone,
        },
        handler: async function (response: any) {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
                coupon_id: appliedCoupon?.id || null,
                amount_usd: total,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              window.location.href = verifyData.redirectUrl || `/checkout/success?order_id=${order.id}`;
            } else {
              setError(verifyData.error || "Payment verification failed. Please contact concierge.");
              setLoading(false);
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Verification failed";
            setError(msg);
            setLoading(false);
          }
        },
        modal: {
          confirm_close: true,
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: {
          color: "#141C19",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo brand-logo-wrap" href="/"><img src="/images/logo-horizontal.png" alt="SANDLINE Resort Wear" className="site-brand-logo" /></Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <CurrencySelector variant="navbar" />
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
                placeholder="e.g. Elena Rostova"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                name="email"
                placeholder="elena@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>
            <label>
              Mobile Phone
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
              Delivery address
              <input
                type="text"
                name="address"
                placeholder="House / Flat No., Street, Landmark"
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
              Country / Destination
              <select
                name="country"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(27, 36, 32, 0.2)",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  background: "#FFFFFF",
                  color: "var(--ink)",
                  boxSizing: "border-box",
                }}
              >
                <option value="United Arab Emirates">🇦🇪 United Arab Emirates (Dubai / Abu Dhabi)</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Thailand">🇹🇭 Thailand (Phuket / Samui / Bangkok)</option>
                <option value="Indonesia">🇮🇩 Indonesia (Bali)</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="Singapore">🇸🇬 Singapore</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="India">🇮🇳 India</option>
                <option value="Other International Destination">🌍 Other International Destination</option>
              </select>
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

            <button className="btn" type="submit" disabled={loading} style={{ marginTop: "20px", width: "100%", padding: "16px" }}>
              {loading ? "Launching Secure Payment..." : `Proceed to Pay — ${formatPrice(total)}`}
            </button>
            <div style={{ marginTop: "14px", textAlign: "center", fontSize: "11.5px", color: "rgba(27,36,32,0.7)", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🔒 100% Encrypted &amp; Secure Checkout</span>
                <span>•</span>
                <span>Apple Pay &amp; Global Express</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "rgba(27,36,32,0.55)" }}>
                💳 Accepts Apple Pay, Visa, Mastercard, Amex, Diner&apos;s &amp; UPI
              </div>
            </div>
          </form>

          <div className="checkout-summary">
            {items.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-row-name">{item.name} × {item.quantity}</div>
                <div className="cart-row-price">{formatPrice(item.price * item.quantity)}</div>
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
                      ({appliedCoupon.discount_type === "percentage" ? `${appliedCoupon.discount_value}% off` : `${formatPrice(appliedCoupon.discount_value)} off`})
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
              <span>{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="cart-discount-row">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="cart-total-row">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
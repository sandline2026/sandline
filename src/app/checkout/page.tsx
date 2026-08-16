"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/../utils/supabase/client";
import "../sandline.css";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const country = formData.get("country") as string;
    const postalCode = formData.get("postalCode") as string;

    const supabase = createClient();

    try {
      // 1. Find or create customer
      let customerId: string;
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from("customers")
          .insert({
            full_name: fullName,
            email,
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

      // 2. Create order
      const orderNumber = "SL-" + Date.now().toString().slice(-8);
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: customerId,
          status: "pending",
          subtotal_usd: subtotal,
          discount_usd: 0,
          shipping_usd: 0,
          total_usd: subtotal,
          traffic_source: "website_direct",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // 3. Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        size: null,
        color: null,
        quantity: item.quantity,
        unit_price_usd: item.price,
        unit_cost_inr: 0,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Success
      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="sandline-page">
        <nav>
          <a className="logo" href="/">SAND<span>LINE</span></a>
        </nav>
        <div className="shop-header">
          <h1>Thank you.</h1>
          <p>Your order has been received and saved. We'll be in touch soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sandline-page">
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/cart">Cart</a>
        </div>
      </nav>

      <div className="shop-header">
        <h1>Checkout.</h1>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Your cart is empty.</p>
      ) : (
        <div className="checkout-wrap">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>Full name<input type="text" name="fullName" required /></label>
            <label>Email<input type="email" name="email" required /></label>
            <label>Address<input type="text" name="address" required /></label>
            <label>City<input type="text" name="city" required /></label>
            <label>Country<input type="text" name="country" required /></label>
            <label>Postal code<input type="text" name="postalCode" required /></label>

            {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}

            <button className="btn" type="submit" disabled={loading} style={{ marginTop: "20px" }}>
              {loading ? "Placing order..." : `Place order — $${subtotal.toFixed(2)}`}
            </button>
          </form>

          <div className="checkout-summary">
            {items.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-row-name">{item.name} × {item.quantity}</div>
                <div className="cart-row-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="cart-subtotal">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

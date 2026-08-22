import Stripe from "stripe";
import Link from "next/link";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import { sendOrderConfirmationEmail } from "@/lib/email";
import "../../sandline.css";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="sandline-page">
        <nav>
          <Link className="logo" href="/">
            SAND<span>LINE</span>
          </Link>
        </nav>
        <div className="shop-header">
          <h1>Something went wrong.</h1>
          <p>No payment session found.</p>
        </div>
      </div>
    );
  }

  let orderNumber = "";
  let paid = false;
  let customerEmail = "";
  let customerName = "";
  let totalPaid = 0;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    orderNumber = (session.metadata?.order_number as string) || "";
    const orderId = session.metadata?.order_id as string;
    const couponId = session.metadata?.coupon_id as string;

    if (session.payment_status === "paid" && orderId) {
      paid = true;
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      const amountTotal = (session.amount_total || 0) / 100;
      totalPaid = amountTotal;
      const estimatedFee = amountTotal * 0.029 + 0.3;

      // Update order status to confirmed
      await supabase.from("orders").update({ status: "confirmed" }).eq("id", orderId);

      // Check if payment was already recorded
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

      if (!existingPayment) {
        await supabase.from("payments").insert({
          order_id: orderId,
          gateway: "stripe",
          gateway_transaction_id: session.payment_intent as string,
          amount_usd: amountTotal,
          gateway_fee_usd: Number(estimatedFee.toFixed(2)),
          status: "paid",
        });

        // Increment coupon used_count if a coupon was applied
        if (couponId) {
          const { data: couponRecord } = await supabase
            .from("coupons")
            .select("used_count")
            .eq("id", couponId)
            .maybeSingle();

          if (couponRecord) {
            await supabase
              .from("coupons")
              .update({ used_count: (couponRecord.used_count || 0) + 1 })
              .eq("id", couponId);
          }
        }

        // Fetch complete order, customer, and item details to send confirmation email
        const { data: rawOrderDetails } = await supabase
          .from("orders")
          .select(`
            *,
            customers (full_name, email, address_line, city, postal_code, country),
            order_items (quantity, unit_price_usd, size, color, products (name))
          `)
          .eq("id", orderId)
          .single();

        const orderDetails = rawOrderDetails as any;
        const customer = Array.isArray(orderDetails?.customers)
          ? orderDetails?.customers[0]
          : orderDetails?.customers;

        if (orderDetails && customer?.email) {
          customerEmail = customer.email;
          customerName = customer.full_name || "Valued Customer";

          const itemsSummary = (orderDetails.order_items || []).map((oi: any) => ({
            name: oi.products?.name || "Sandline Garment",
            quantity: oi.quantity || 1,
            price: Number(oi.unit_price_usd) || 0,
            size: oi.size,
            color: oi.color,
          }));

          // Send confirmation email
          await sendOrderConfirmationEmail({
            orderNumber: orderDetails.order_number || orderNumber,
            customerName: customer.full_name || "Valued Shopper",
            customerEmail: customer.email,
            items: itemsSummary,
            subtotal: Number(orderDetails.subtotal_usd || totalPaid),
            discount: Number(orderDetails.discount_usd || 0),
            total: Number(orderDetails.total_usd || totalPaid),
            addressLine: customer.address_line,
            city: customer.city,
            postalCode: customer.postal_code,
            country: customer.country,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error processing checkout success:", err);
  }

  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo" href="/">
          SAND<span>LINE</span>
        </Link>
      </nav>

      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "160px 24px 120px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "var(--foam)",
            border: "1px solid var(--line)",
            color: "var(--lagoon)",
            fontSize: "26px",
            marginBottom: "24px",
          }}
        >
          ✦
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(34px, 5vw, 48px)", margin: "0 0 12px" }}>
          {paid ? "Your pieces are confirmed." : "Payment not confirmed."}
        </h1>

        <p style={{ fontSize: "16px", color: "rgba(27,36,32,0.7)", lineHeight: 1.6, marginBottom: "28px" }}>
          {paid ? (
            <>
              Thank you for ordering with Sandline Studio. Your order <strong>#{orderNumber}</strong> has been confirmed.
              {customerEmail && (
                <> A detailed receipt and confirmation email has been dispatched to <strong>{customerEmail}</strong>.</>
              )}
            </>
          ) : (
            "We couldn't verify your payment session. Please check your bank or contact our concierge if you were charged."
          )}
        </p>

        {paid && (
          <div
            style={{
              background: "var(--foam)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "left",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "rgba(27,36,32,0.6)" }}>Order Number</span>
              <strong style={{ fontFamily: "'Space Mono', monospace" }}>#{orderNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "rgba(27,36,32,0.6)" }}>Status</span>
              <span style={{ color: "#059669", fontWeight: 700, fontSize: "13px" }}>● Confirmed &amp; Paid</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "rgba(27,36,32,0.6)" }}>Estimated Dispatch</span>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>24–48 Hours from Jaipur</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
          <Link href="/shop" className="btn">
            Continue Shopping →
          </Link>
          <Link href="/" className="btn ghost">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

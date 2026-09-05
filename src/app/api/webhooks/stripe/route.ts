import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_not_configured");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // In development/test mode without webhook secret signature
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const couponId = session.metadata?.coupon_id;

    if (orderId && session.payment_status === "paid") {
      try {
        const amountTotal = (session.amount_total || 0) / 100;
        const estimatedFee = Number((amountTotal * 0.029 + 0.3).toFixed(2));

        // 1. Mark order as confirmed
        await supabase.from("orders").update({ status: "confirmed" }).eq("id", orderId);

        // 2. Insert payment record if not already created
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
            gateway_fee_usd: estimatedFee,
            status: "paid",
          });

          // 3. Increment coupon usage if used
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

          // 4. Send Confirmation Email & Admin Audit Alert
          const { data: orderDetails } = await supabase
            .from("orders")
            .select(`
              *,
              customers (full_name, email, address_line, city, postal_code, country),
              order_items (quantity, unit_price_usd, size, color, products (name))
            `)
            .eq("id", orderId)
            .single();

          if (orderDetails && orderDetails.customers?.email) {
            const items = (orderDetails.order_items || []).map((item: any) => ({
              name: item.products?.name || "Handcrafted Garment",
              quantity: item.quantity || 1,
              price: item.unit_price_usd || 0,
              size: item.size || null,
              color: item.color || null,
            }));

            // Customer confirmation & Admin Audit Email
            await sendOrderConfirmationEmail({
              orderNumber: orderDetails.order_number || "SL-ORDER",
              customerName: orderDetails.customers.full_name || "Valued Client",
              customerEmail: orderDetails.customers.email,
              items,
              subtotal: Number(orderDetails.subtotal_usd || 0),
              discount: Number(orderDetails.discount_usd || 0),
              total: Number(orderDetails.total_usd || 0),
              addressLine: orderDetails.customers.address_line || "",
              city: orderDetails.customers.city || "",
              postalCode: orderDetails.customers.postal_code || "",
              country: orderDetails.customers.country || "",
            });
          }
        }
      } catch (err: any) {
        console.error("Error processing checkout.session.completed:", err.message);
      }
    }
  }

  return NextResponse.json({ received: true });
}

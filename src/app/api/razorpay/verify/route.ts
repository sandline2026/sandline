import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { dispatchAdminWhatsAppAudit } from "@/lib/whatsapp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      coupon_id,
      amount_usd,
    } = body;

    const secret =
      process.env.RAZORPAY_KEY_SECRET || "kMTinxwpvxofou5MONAUEmgb";

    // Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 1. Mark order as confirmed in Supabase
    if (order_id) {
      await supabase
        .from("orders")
        .update({ status: "confirmed" })
        .eq("id", order_id);

      // 2. Insert payment record
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("order_id", order_id)
        .maybeSingle();

      if (!existingPayment) {
        await supabase.from("payments").insert({
          order_id,
          gateway: "razorpay",
          gateway_transaction_id: razorpay_payment_id,
          amount_usd: Number(amount_usd) || 0,
          gateway_fee_usd: Number(((Number(amount_usd) || 0) * 0.02).toFixed(2)),
          status: "paid",
        });

        // 3. Increment coupon usage if used
        if (coupon_id) {
          const { data: couponRecord } = await supabase
            .from("coupons")
            .select("used_count")
            .eq("id", coupon_id)
            .maybeSingle();

          if (couponRecord) {
            await supabase
              .from("coupons")
              .update({ used_count: (couponRecord.used_count || 0) + 1 })
              .eq("id", coupon_id);
          }
        }

        // 4. Send Confirmation Email & Admin Audit Notifications
        try {
          const { data: orderDetails } = await supabase
            .from("orders")
            .select(`
              *,
              customers (full_name, email, address_line, city, postal_code, country),
              order_items (quantity, unit_price_usd, size, color, products (name))
            `)
            .eq("id", order_id)
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

            // Admin WhatsApp Audit Dispatch
            await dispatchAdminWhatsAppAudit({
              orderNumber: orderDetails.order_number || "SL-ORDER",
              customerName: orderDetails.customers.full_name || "Valued Client",
              customerEmail: orderDetails.customers.email,
              gateway: "Razorpay",
              gatewayTransactionId: razorpay_payment_id,
              amount: Number(orderDetails.total_usd || 0),
              currency: "USD",
              items,
              shippingAddress: [
                orderDetails.customers.address_line,
                orderDetails.customers.city,
                orderDetails.customers.postal_code,
                orderDetails.customers.country,
              ].filter(Boolean).join(", "),
            });
          }
        } catch (emailErr) {
          console.warn("Failed to send order email/audit alert:", emailErr);
        }
      }
    }

    return NextResponse.json({ success: true, redirectUrl: `/checkout/success?order_id=${order_id}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error("Razorpay verify error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

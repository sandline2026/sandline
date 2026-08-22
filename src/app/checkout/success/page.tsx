import Stripe from "stripe";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
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
        <nav><a className="logo" href="/">SAND<span>LINE</span></a></nav>
        <div className="shop-header">
          <h1>Something went wrong.</h1>
          <p>No payment session found.</p>
        </div>
      </div>
    );
  }

  let orderNumber = "";
  let paid = false;

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
      // Approximate Stripe fee: 2.9% + $0.30 (actual fee varies by card/currency)
      const estimatedFee = amountTotal * 0.029 + 0.3;

      await supabase.from("orders").update({ status: "confirmed" }).eq("id", orderId);

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
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="sandline-page">
      <nav><a className="logo" href="/">SAND<span>LINE</span></a></nav>
      <div className="shop-header">
        <h1>{paid ? "Thank you." : "Payment not confirmed."}</h1>
        <p>
          {paid
            ? `Your order ${orderNumber} has been confirmed and paid. We'll be in touch soon.`
            : "We couldn't confirm your payment. Please contact us if you were charged."}
        </p>
      </div>
    </div>
  );
}

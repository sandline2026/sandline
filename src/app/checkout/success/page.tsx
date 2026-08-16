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

    if (session.payment_status === "paid" && orderId) {
      paid = true;
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      await supabase
        .from("orders")
        .update({ status: "confirmed" })
        .eq("id", orderId);

      await supabase.from("payments").insert({
        order_id: orderId,
        gateway: "stripe",
        gateway_transaction_id: session.payment_intent as string,
        amount_usd: (session.amount_total || 0) / 100,
        status: "paid",
      });
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

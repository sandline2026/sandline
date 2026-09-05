import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_not_configured");

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      items,
      customerEmail,
      couponCode,
      couponId,
      discountAmount,
    } = body;

    const line_items = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

    // If a coupon discount is present, create an ephemeral Stripe coupon
    if (Number(discountAmount) > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(Number(discountAmount) * 100),
        currency: "usd",
        duration: "once",
        name: couponCode ? `Coupon ${couponCode}` : "Discount",
      });
      discounts.push({ coupon: stripeCoupon.id });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customerEmail,
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout`,
      metadata: {
        order_id: orderId,
        order_number: orderNumber,
        coupon_id: couponId || "",
        coupon_code: couponCode || "",
        discount_amount: String(discountAmount || 0),
      },
    };

    if (discounts.length > 0) {
      sessionParams.discounts = discounts;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

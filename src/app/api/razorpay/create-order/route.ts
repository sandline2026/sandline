import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const key_id =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      "rzp_live_TUndvFY7tJWpuw";
    const key_secret =
      process.env.RAZORPAY_KEY_SECRET || "kMTinxwpvxofou5MONAUEmgb";

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const body = await req.json();
    const { orderId, orderNumber, totalUsd, customerEmail, customerPhone, couponId, currency: requestedCurrency, country } = body;

    const isIndia = (country && country.trim().toLowerCase() === "india") || requestedCurrency === "INR";
    const currency = isIndia ? "INR" : (requestedCurrency || "USD");

    const USD_TO_INR = 84.5;
    let amountInMinorUnits: number;
    let amountInInr: number;

    if (currency === "INR") {
      amountInInr = Math.round(Number(totalUsd) * USD_TO_INR);
      amountInMinorUnits = Math.max(100, amountInInr * 100); // 100 paise = ₹1.00
    } else {
      amountInInr = Math.round(Number(totalUsd) * USD_TO_INR);
      amountInMinorUnits = Math.max(50, Math.round(Number(totalUsd) * 100)); // 100 cents = $1.00 USD
    }

    const options = {
      amount: amountInMinorUnits,
      currency,
      receipt: orderNumber || `RCPT-${Date.now()}`,
      notes: {
        order_id: orderId || "",
        order_number: orderNumber || "",
        customer_email: customerEmail || "",
        customer_phone: customerPhone || "",
        coupon_id: couponId || "",
        amount_usd: String(totalUsd),
        country: country || "",
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: key_id,
      amountInInr,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create Razorpay order";
    console.error("Razorpay create-order error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

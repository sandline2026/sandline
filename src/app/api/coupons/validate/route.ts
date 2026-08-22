import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Please enter a coupon code." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", code.trim())
      .maybeSingle();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
    }

    if (!coupon.is_active) {
      return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
    }

    if (coupon.max_uses !== null && coupon.max_uses !== undefined) {
      if ((coupon.used_count || 0) >= coupon.max_uses) {
        return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
      }
    }

    const currentSubtotal = Number(subtotal) || 0;
    let discountAmount = 0;

    if (coupon.discount_type === "percentage") {
      discountAmount = (currentSubtotal * Number(coupon.discount_value)) / 100;
    } else {
      // Flat discount
      discountAmount = Math.min(currentSubtotal, Number(coupon.discount_value));
    }

    discountAmount = Math.max(0, Math.round(discountAmount * 100) / 100);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: Number(coupon.discount_value),
        discountAmount,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to validate coupon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const basePayload: Record<string, any> = {
      code: (body.code || "").trim().toUpperCase(),
      discount_type: body.discount_type || "percentage",
      discount_value: Number(body.discount_value) || 0,
      is_active: true,
    };

    if (body.min_order_usd) {
      basePayload.min_order_usd = Number(body.min_order_usd);
    }

    // Try inserting with max_uses first if specified
    const fullPayload = {
      ...basePayload,
      ...(body.max_uses ? { max_uses: Number(body.max_uses) } : {}),
    };

    let { error } = await supabase.from("coupons").insert(fullPayload);

    // If schema cache doesn't have max_uses, fallback to inserting without it
    if (error && (error.message.includes("max_uses") || error.code === "PGRST204")) {
      const retry = await supabase.from("coupons").insert(basePayload);
      error = retry.error;
    }

    if (error) {
      console.error("Error creating coupon:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    if (!id) return NextResponse.json({ error: "Missing coupon id" }, { status: 400 });

    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

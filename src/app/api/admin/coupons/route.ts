import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("coupons").insert({
    code: body.code.toUpperCase(),
    discount_type: body.discount_type,
    discount_value: body.discount_value,
    max_uses: body.max_uses || null,
    is_active: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

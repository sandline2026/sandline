import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const { error } = await supabase.from("products").insert({
    name: body.name,
    slug: slug + "-" + Date.now().toString().slice(-5),
    description: body.description || null,
    category_id: body.category_id || null,
    collection: body.collection || null,
    fabric: body.fabric || null,
    sizes: body.sizes ? body.sizes.split(",").map((s: string) => s.trim()) : [],
    colors: body.colors ? body.colors.split(",").map((c: string) => c.trim()) : [],
    images: body.image_url ? [body.image_url] : [],
    cost_price: Number(body.cost_price) || 0,
    selling_price_usd: Number(body.selling_price_usd) || 0,
    stock_quantity: Number(body.stock_quantity) || 0,
    stock_status: Number(body.stock_quantity) > 0 ? "in_stock" : "out_of_stock",
    is_active: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

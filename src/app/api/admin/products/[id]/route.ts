import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const updates: Record<string, any> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.category_id !== undefined) updates.category_id = body.category_id;
  if (body.collection !== undefined) updates.collection = body.collection;
  if (body.fabric !== undefined) updates.fabric = body.fabric;
  if (body.sizes !== undefined) {
    updates.sizes = Array.isArray(body.sizes) ? body.sizes : String(body.sizes).split(",").map((s: string) => s.trim());
  }
  if (body.colors !== undefined) {
    updates.colors = Array.isArray(body.colors) ? body.colors : String(body.colors).split(",").map((c: string) => c.trim());
  }
  if (body.cost_price !== undefined) updates.cost_price = Number(body.cost_price);
  if (body.selling_price_usd !== undefined) updates.selling_price_usd = Number(body.selling_price_usd);
  if (body.stock_quantity !== undefined) updates.stock_quantity = Number(body.stock_quantity);
  if (body.stock_status !== undefined) updates.stock_status = body.stock_status;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

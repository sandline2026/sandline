import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: cat } = await supabase.from("categories").select("is_active").eq("id", id).single();
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabase.from("categories").update({ is_active: !cat.is_active }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

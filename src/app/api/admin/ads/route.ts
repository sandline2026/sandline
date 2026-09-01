import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("ad_campaigns").insert({
    platform: body.platform,
    campaign_name: body.campaign_name,
    spend_usd: Number(body.spend_usd) || 0,
    reach: Number(body.reach) || 0,
    clicks: Number(body.clicks) || 0,
    conversions: Number(body.conversions) || 0,
    date_recorded: body.date_recorded,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!body.id) {
    return NextResponse.json({ error: "Missing campaign id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("ad_campaigns")
    .update({
      platform: body.platform,
      campaign_name: body.campaign_name,
      spend_usd: Number(body.spend_usd) || 0,
      reach: Number(body.reach) || 0,
      clicks: Number(body.clicks) || 0,
      conversions: Number(body.conversions) || 0,
      date_recorded: body.date_recorded,
    })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase.from("ad_campaigns").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

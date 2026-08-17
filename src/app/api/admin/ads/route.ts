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

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    const { data: allProducts, error } = await supabase
      .from("products")
      .select("id, name, slug, selling_price_usd, collection, fabric, images, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!q) {
      return NextResponse.json({ products: (allProducts || []).slice(0, 10) });
    }

    const words = q.replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);

    const filtered = (allProducts || []).filter((p: any) => {
      const nameLower = (p.name || "").toLowerCase();
      const collLower = (p.collection || "").toLowerCase().replace(/_/g, " ");
      const fabricLower = (p.fabric || "").toLowerCase();
      const fullText = `${nameLower} ${collLower} ${fabricLower}`;

      // Check if all or any search word matches
      const allWordsMatch = words.every((w) => fullText.includes(w));
      const anyWordMatch = words.some((w) => nameLower.includes(w) || collLower.includes(w));
      return allWordsMatch || anyWordMatch;
    });

    return NextResponse.json({ products: filtered.slice(0, 12) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

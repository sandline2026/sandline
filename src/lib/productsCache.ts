import { FALLBACK_PRODUCTS, type Product } from "@/data/fallbackProducts";
import { createClient } from "@supabase/supabase-js";

let cachedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes in-memory cache

export async function getCachedProducts(): Promise<Product[]> {
  const now = Date.now();
  if (cachedProducts && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedProducts;
  }

  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!sbUrl || !sbKey) {
    return FALLBACK_PRODUCTS.filter((p) => p.is_active !== false);
  }

  try {
    const supabase = createClient(sbUrl, sbKey);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, collection, selling_price_usd, cost_price, dropship_fee, stock_quantity, fabric, colors, sizes, stock_status, images, description, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      cachedProducts = FALLBACK_PRODUCTS.filter((p) => p.is_active !== false);
    } else {
      cachedProducts = data as Product[];
    }
  } catch (err) {
    console.warn("[productsCache] Fallback to local catalog:", err);
    cachedProducts = FALLBACK_PRODUCTS.filter((p) => p.is_active !== false);
  }

  lastFetchTime = now;
  return cachedProducts;
}

export async function getCachedProductBySlug(slugOrId: string): Promise<Product | null> {
  const products = await getCachedProducts();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  return (
    products.find((p) => (isUUID ? p.id === slugOrId : p.slug === slugOrId || p.id === slugOrId)) ||
    null
  );
}

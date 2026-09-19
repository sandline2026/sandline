import { FALLBACK_PRODUCTS, type Product } from "@/data/fallbackProducts";
import { createClient } from "@supabase/supabase-js";

// Always initialize with pre-bundled fallback products so cold-start is instant (0ms CPU)
let cachedProducts: Product[] = FALLBACK_PRODUCTS.filter((p) => p.is_active !== false);
let lastFetchTime = 0;
let isFetching = false;
const CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes cache for quick freshness with low egress

export async function getCachedProducts(): Promise<Product[]> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && cachedProducts.length > 0) {
    return cachedProducts;
  }

  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!sbUrl || !sbKey) {
    return cachedProducts;
  }

  // Prevent multiple concurrent fetches during cold-start
  if (isFetching) {
    return cachedProducts;
  }

  isFetching = true;
  try {
    const supabase = createClient(sbUrl, sbKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, collection, selling_price_usd, cost_price, dropship_fee, stock_quantity, fabric, colors, sizes, stock_status, images, description, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      cachedProducts = data as Product[];
      lastFetchTime = now;
    }
  } catch (err) {
    console.warn("[productsCache] Error fetching from Supabase, keeping cached catalog:", err);
  } finally {
    isFetching = false;
  }

  return cachedProducts;
}

export async function getCachedProductBySlug(slugOrId: string): Promise<Product | null> {
  const products = await getCachedProducts();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  
  let found = products.find((p) => (isUUID ? p.id === slugOrId : p.slug === slugOrId || p.id === slugOrId));
  if (found) return found;

  // Check fallback array directly
  found = FALLBACK_PRODUCTS.find((p) => (isUUID ? p.id === slugOrId : p.slug === slugOrId || p.id === slugOrId));
  if (found && found.is_active !== false) return found;

  // Single-product direct Supabase fallback lookup
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (sbUrl && sbKey) {
    try {
      const supabase = createClient(sbUrl, sbKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data } = await supabase
        .from("products")
        .select("*")
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .eq("is_active", true)
        .maybeSingle();

      if (data) {
        cachedProducts.unshift(data as Product);
        return data as Product;
      }
    } catch {
      // Ignore
    }
  }

  return null;
}

// Sandline Studio — Meta Pixel (Facebook & Instagram) E-commerce Analytics Helper

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1051839677560952";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Safe wrapper for fbq tracking calls
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
  }
}

/**
 * 1. Track Product View (ViewContent)
 */
export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  currency?: string;
}) {
  trackEvent("ViewContent", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    content_category: product.category || "Resortwear",
    value: product.price,
    currency: product.currency || "USD",
  });
}

/**
 * 2. Track Add To Bag (AddToCart)
 */
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  currency?: string;
}) {
  trackEvent("AddToCart", {
    content_name: item.name,
    content_ids: [item.id],
    content_type: "product",
    value: item.price * (item.quantity || 1),
    currency: item.currency || "USD",
  });
}

/**
 * 3. Track Checkout Initiation (InitiateCheckout)
 */
export function trackInitiateCheckout(cart: {
  total: number;
  itemCount: number;
  currency?: string;
  items?: Array<{ id: string; name: string }>;
}) {
  trackEvent("InitiateCheckout", {
    value: cart.total,
    currency: cart.currency || "USD",
    num_items: cart.itemCount,
    content_ids: cart.items?.map((i) => i.id) || [],
  });
}

/**
 * 4. Track Purchase / Paid Order (Purchase)
 */
export function trackPurchase(order: {
  orderNumber: string;
  total: number;
  currency?: string;
  items?: Array<{ id?: string; name: string; price?: number; quantity?: number }>;
}) {
  trackEvent("Purchase", {
    value: order.total,
    currency: order.currency || "USD",
    content_type: "product",
    order_id: order.orderNumber,
    num_items: order.items?.reduce((acc, curr) => acc + (curr.quantity || 1), 0) || 1,
    content_ids: order.items?.map((i) => i.id || i.name) || [],
  });
}

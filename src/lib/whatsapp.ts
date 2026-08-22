// Sandline Studio — WhatsApp Messaging & Automation Engine

export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
}

/**
 * Generates direct wa.me link with encoded message
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * 1. Order Confirmation on WhatsApp
 */
export function getWhatsAppOrderConfirmationMessage({
  orderNumber,
  customerName,
  total,
  itemsSummary,
}: {
  orderNumber: string;
  customerName?: string;
  total: number;
  itemsSummary?: string;
}): string {
  const name = customerName || "there";
  return `*SANDLINE STUDIO • ORDER CONFIRMED* ✨

Dear ${name},
Thank you for ordering with Sandline Studio! We're thrilled to confirm your order *#${orderNumber}*.

🛍️ *Order Total:* $${total.toFixed(2)} USD
🧵 *Pieces:* ${itemsSummary || "Hand-finished resort garments"}
📍 *Origin:* Jaipur Atelier, India
✈️ *Dispatch:* Tracked International Express in 24–48 hours

We will notify you on WhatsApp the moment your courier is dispatched. 

View invoice: https://sandline-nine.vercel.app/shop

Have questions? Reply directly to this chat! 🏖️`;
}

/**
 * 2. Shipping & Tracking Dispatched Update on WhatsApp
 */
export function getWhatsAppShippingMessage({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
}: {
  orderNumber: string;
  customerName?: string;
  trackingNumber?: string;
  carrier?: string;
}): string {
  const name = customerName || "there";
  return `*SANDLINE DISPATCH UPDATE* ✈️📦

Hey ${name}! Great news! Your Sandline order *#${orderNumber}* has been hand-checked, pressed, and dispatched from our Jaipur atelier.

🚚 *Carrier:* ${carrier || "Express Worldwide Courier"}
🔎 *Tracking ID:* ${trackingNumber || "Tracked on dispatch"}
⏱️ *Estimated Delivery:* 7–10 Business Days

Track your journey: https://sandline-nine.vercel.app/shop

Enjoy the getaway! 🏖️`;
}

/**
 * 3. Delivered Celebration on WhatsApp
 */
export function getWhatsAppDeliveredMessage({
  orderNumber,
  customerName,
}: {
  orderNumber: string;
  customerName?: string;
}): string {
  const name = customerName || "there";
  return `*PACKAGE DELIVERED* 🏖️👗

Dear ${name}, your Sandline delivery for order *#${orderNumber}* has arrived!

We hope your pieces accompany you on unforgettable beach sunsets, cocktail dinners, and tropical moments.

Tag @sandline on Instagram to be featured! Need a size exchange? Reply to this message. ✨`;
}

/**
 * 4. Abandoned Cart Recovery Message on WhatsApp
 */
export function getWhatsAppAbandonedCartMessage({
  customerName,
  itemsCount,
  discountCode = "SANDLINE10",
}: {
  customerName?: string;
  itemsCount?: number;
  discountCode?: string;
}): string {
  const name = customerName || "there";
  return `*YOUR SANDLINE PIECES ARE WAITING* 🌅

Hey ${name}! We noticed you left ${itemsCount ? `${itemsCount} item(s)` : "your resort dress"} in your Sandline shopping bag. 

Because our silk & linen pieces are crafted in limited batches in Jaipur, sizes sell out fast for the season.

🎁 *Here is 10% OFF for the next 24 hours:*
Use code *${discountCode}* at checkout:
👉 https://sandline-nine.vercel.app/cart

Complete your sunset wardrobe today! 🏖️`;
}

/**
 * 5. Out-of-Stock Restock Alert on WhatsApp
 */
export function getWhatsAppRestockAlertMessage({
  customerName,
  productName,
  productSlug,
}: {
  customerName?: string;
  productName: string;
  productSlug?: string;
}): string {
  const name = customerName || "there";
  const link = productSlug
    ? `https://sandline-nine.vercel.app/product/${productSlug}`
    : "https://sandline-nine.vercel.app/shop";

  return `*BACK IN STOCK ALERT* 🔔✨

Hey ${name}! The *${productName}* you were waiting for is back in our inventory!

Our Jaipur atelier just hand-finished a fresh limited batch. Grab your size before it sells out again:
👉 ${link}

Happy shopping! 🏖️`;
}

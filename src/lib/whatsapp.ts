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
📍 *Origin:* India Atelier
✈️ *Dispatch:* Tracked International Express in 24–48 hours

We will notify you on WhatsApp the moment your courier is dispatched. 

View invoice: https://sandline.store/shop

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

Hey ${name}! Great news! Your Sandline order *#${orderNumber}* has been hand-checked, pressed, and dispatched from our India atelier.

🚚 *Carrier:* ${carrier || "Express Worldwide Courier"}
🔎 *Tracking ID:* ${trackingNumber || "Tracked on dispatch"}
⏱️ *Estimated Delivery:* 7–10 Business Days

Track your journey: https://sandline.store/shop

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

Because our silk & linen pieces are crafted in limited batches in India, sizes sell out fast for the season.

🎁 *Here is 10% OFF for the next 24 hours:*
Use code *${discountCode}* at checkout:
👉 https://sandline.store/cart

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
    ? `https://sandline.store/product/${productSlug}`
    : "https://sandline.store/shop";

  return `*BACK IN STOCK ALERT* 🔔✨

Hey ${name}! The *${productName}* you were waiting for is back in our inventory!

Our India atelier just hand-finished a fresh limited batch. Grab your size before it sells out again:
👉 ${link}

Happy shopping! 🏖️`;
}

/**
 * 6. Admin Order Audit Alert on WhatsApp
 */
export interface AdminOrderAuditParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  gateway: string;
  gatewayTransactionId?: string;
  amount: number;
  currency?: string;
  items: { name: string; quantity: number; size?: string | null; color?: string | null; price: number }[];
  shippingAddress?: string;
}

export function getAdminOrderAuditWhatsAppMessage(params: AdminOrderAuditParams): string {
  const itemsText = params.items
    .map((i) => `• ${i.name} (x${i.quantity}) [${[i.size, i.color].filter(Boolean).join("/") || "Standard"}] - $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");

  return `🚨 *SANDLINE NEW ORDER AUDIT ALERT* 🚨
━━━━━━━━━━━━━━━━━━━━━
📦 *Order:* #${params.orderNumber}
👤 *Client:* ${params.customerName}
📧 *Email:* ${params.customerEmail}
📞 *Phone:* ${params.customerPhone || "N/A"}
💳 *Payment:* ${params.gateway.toUpperCase()} (${params.gatewayTransactionId || "Paid"})
💰 *Total:* ${params.currency || "USD"} $${params.amount.toFixed(2)}
📍 *Ship To:* ${params.shippingAddress || "Worldwide Express"}

🛍️ *Items Ordered:*
${itemsText}

📊 *Admin Portal:* https://sandline.store/admin/orders
━━━━━━━━━━━━━━━━━━━━━`;
}

export async function dispatchAdminWhatsAppAudit(params: AdminOrderAuditParams) {
  const webhookUrl = process.env.ADMIN_WHATSAPP_WEBHOOK_URL;
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE;
  const message = getAdminOrderAuditWhatsAppMessage(params);

  console.log(`[ADMIN WHATSAPP AUDIT DISPATCH] Order #${params.orderNumber}`);
  console.log(message);

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: adminPhone,
          message,
          orderNumber: params.orderNumber,
          data: params,
        }),
      });
    } catch (e) {
      console.error("[WHATSAPP WEBHOOK ERROR]", e);
    }
  }

  return { success: true, message };
}

// Sandline Studio — Transactional Email Service

export interface OrderItemSummary {
  name: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
}

export interface OrderConfirmationParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItemSummary[];
  subtotal: number;
  discount: number;
  total: number;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderStatusUpdateParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  newStatus: string;
  trackingNumber?: string;
  carrier?: string;
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationParams) {
  const {
    orderNumber,
    customerName,
    customerEmail,
    items,
    subtotal,
    discount,
    total,
    addressLine,
    city,
    postalCode,
    country,
  } = params;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E9ECEF; font-size: 14px; color: #111827;">
          <strong>${item.name}</strong>
          ${item.size || item.color ? `<br/><span style="font-size: 12px; color: #6C757D;">${[item.size, item.color].filter(Boolean).join(" • ")}</span>` : ""}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E9ECEF; font-size: 14px; color: #6C757D; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E9ECEF; font-size: 14px; color: #111827; text-align: right; font-weight: 600;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation #${orderNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E9ECEF; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                
                <!-- Brand Header -->
                <tr>
                  <td align="center" style="background-color: #111827; padding: 36px 20px;">
                    <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #F6EFE3; letter-spacing: 0.15em;">
                      SAND<span style="color: #FF7A54;">LINE</span>
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 0.2em; color: rgba(246, 239, 227, 0.7); margin-top: 6px; text-transform: uppercase;">
                      RESORTWEAR • JAIPUR &amp; THE WORLD
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 24px;">
                    <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #D97706; margin-bottom: 6px;">
                      ✦ Order Confirmed &amp; Paid
                    </div>
                    <h1 style="margin: 0 0 14px; font-size: 22px; color: #111827; font-family: Georgia, serif;">
                      Thank you for your order, ${customerName || "there"}!
                    </h1>
                    <p style="margin: 0 0 24px; font-size: 14.5px; line-height: 1.6; color: #4B5563;">
                      We're delighted to confirm your order <strong>#${orderNumber}</strong>. Each piece is crafted and inspected in our Jaipur atelier before its express journey across the ocean.
                    </p>

                    <!-- Order Box Summary -->
                    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px 20px; margin-bottom: 28px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Order Number</td>
                          <td style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">Status</td>
                        </tr>
                        <tr>
                          <td style="font-size: 15px; font-weight: bold; color: #111827; padding-top: 4px;">#${orderNumber}</td>
                          <td style="font-size: 13px; font-weight: bold; color: #059669; text-align: right; padding-top: 4px;">● Confirmed &amp; Paid</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Items Table -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <thead>
                        <tr>
                          <th style="padding-bottom: 10px; border-bottom: 2px solid #E9ECEF; font-size: 11px; text-transform: uppercase; color: #6B7280; text-align: left;">Silhouette</th>
                          <th style="padding-bottom: 10px; border-bottom: 2px solid #E9ECEF; font-size: 11px; text-transform: uppercase; color: #6B7280; text-align: center;">Qty</th>
                          <th style="padding-bottom: 10px; border-bottom: 2px solid #E9ECEF; font-size: 11px; text-transform: uppercase; color: #6B7280; text-align: right;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>

                    <!-- Financial Breakdown -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                      <tr>
                        <td style="padding: 4px 0; font-size: 13.5px; color: #6B7280;">Subtotal</td>
                        <td style="padding: 4px 0; font-size: 13.5px; color: #111827; text-align: right;">$${subtotal.toFixed(2)}</td>
                      </tr>
                      ${
                        discount > 0
                          ? `
                      <tr>
                        <td style="padding: 4px 0; font-size: 13.5px; color: #059669; font-weight: 600;">Promo Discount</td>
                        <td style="padding: 4px 0; font-size: 13.5px; color: #059669; text-align: right; font-weight: 600;">-$${discount.toFixed(2)}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td style="padding: 4px 0; font-size: 13.5px; color: #6B7280;">Express Worldwide Shipping</td>
                        <td style="padding: 4px 0; font-size: 13.5px; color: #059669; text-align: right; font-weight: 600;">FREE</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0; border-top: 1px solid #E9ECEF; font-size: 16px; font-weight: bold; color: #111827;">Total Paid</td>
                        <td style="padding: 12px 0 0; border-top: 1px solid #E9ECEF; font-size: 18px; font-weight: bold; color: #111827; text-align: right;">$${total.toFixed(2)} USD</td>
                      </tr>
                    </table>

                    <!-- Shipping Address Block -->
                    ${
                      addressLine || country
                        ? `
                    <div style="background-color: #F8F9FA; border-radius: 10px; padding: 16px 18px; margin-bottom: 28px;">
                      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #6B7280; margin-bottom: 6px; letter-spacing: 0.05em;">Shipping Destination</div>
                      <div style="font-size: 13.5px; color: #111827; line-height: 1.5;">
                        ${customerName ? `<strong>${customerName}</strong><br/>` : ""}
                        ${addressLine ? `${addressLine}<br/>` : ""}
                        ${[city, postalCode, country].filter(Boolean).join(", ")}
                      </div>
                    </div>
                    `
                        : ""
                    }

                    <!-- Dispatch Notice -->
                    <div style="border-left: 3px solid #D97706; background-color: #FFFBEB; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px;">
                      <div style="font-size: 13px; font-weight: bold; color: #92400E; margin-bottom: 2px;">Estimated Dispatch: 24–48 Hours</div>
                      <div style="font-size: 12.5px; color: #B45309; line-height: 1.4;">
                        Your parcel will ship via tracked international express courier. You will receive an email with tracking details as soon as it leaves Jaipur.
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 24px 32px; border-top: 1px solid #E9ECEF; text-align: center;">
                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 6px;">
                      Have questions about your order? Reply directly to this email or reach us on WhatsApp.
                    </div>
                    <div style="font-size: 11px; color: #9CA3AF;">
                      © 2026 Sandline Studio • Handcrafted in Jaipur, India • Shipped Worldwide
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmailViaProvider({
    to: customerEmail,
    subject: `✨ Order Confirmed: #${orderNumber} | Sandline Studio`,
    html,
  });
}

export async function sendOrderStatusUpdateEmail(params: OrderStatusUpdateParams) {
  const { orderNumber, customerName, customerEmail, newStatus, trackingNumber, carrier } = params;

  const statusDescriptions: Record<string, { title: string; desc: string; color: string; badge: string }> = {
    shipped: {
      title: "Your order is on its way!",
      desc: "Great news! Your Sandline pieces have been hand-checked, packaged, and dispatched from our Jaipur atelier via tracked international courier.",
      color: "#2563EB",
      badge: "In Transit / Shipped",
    },
    delivered: {
      title: "Your order has been delivered!",
      desc: "Your Sandline package has safely arrived at your destination. We hope your new silhouettes bring endless joy on your beach outings and sunset getaways!",
      color: "#059669",
      badge: "Delivered",
    },
    processing: {
      title: "Your order is being prepared",
      desc: "Our Jaipur atelier is currently hand-finishing and pressing your resortwear pieces. We will notify you once courier dispatch is underway.",
      color: "#4F46E5",
      badge: "Processing & Tailoring",
    },
    confirmed: {
      title: "Your order is confirmed",
      desc: "Your payment has cleared and your order is queued for tailoring and packaging.",
      color: "#059669",
      badge: "Confirmed",
    },
    cancelled: {
      title: "Your order has been cancelled",
      desc: "Your order has been cancelled. Any refund has been initiated back to your original payment method.",
      color: "#DC2626",
      badge: "Cancelled",
    },
  };

  const statusInfo = statusDescriptions[newStatus.toLowerCase()] || {
    title: `Order Status Updated: ${newStatus}`,
    desc: `Your order status has been updated to "${newStatus}".`,
    color: "#D97706",
    badge: newStatus.toUpperCase(),
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order #${orderNumber} Update</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E9ECEF; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #111827; padding: 36px 20px;">
                    <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #F6EFE3; letter-spacing: 0.15em;">
                      SAND<span style="color: #FF7A54;">LINE</span>
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 0.2em; color: rgba(246, 239, 227, 0.7); margin-top: 6px; text-transform: uppercase;">
                      ORDER STATUS UPDATE
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <div style="display: inline-block; background-color: ${statusInfo.color}15; color: ${statusInfo.color}; border: 1px solid ${statusInfo.color}40; padding: 5px 12px; border-radius: 999px; font-size: 11.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
                      ● ${statusInfo.badge}
                    </div>

                    <h1 style="margin: 0 0 14px; font-size: 22px; color: #111827; font-family: Georgia, serif;">
                      ${statusInfo.title}
                    </h1>

                    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.6; color: #4B5563;">
                      Dear ${customerName || "Customer"},<br/><br/>
                      ${statusInfo.desc}
                    </p>

                    <!-- Order Box -->
                    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="font-size: 12px; color: #6B7280; text-transform: uppercase;">Order Number</td>
                          <td style="font-size: 15px; font-weight: bold; color: #111827; text-align: right;">#${orderNumber}</td>
                        </tr>
                        ${
                          trackingNumber
                            ? `
                        <tr>
                          <td style="font-size: 12px; color: #6B7280; text-transform: uppercase; padding-top: 8px;">Tracking Number</td>
                          <td style="font-size: 14px; font-family: monospace; font-weight: bold; color: #2563EB; text-align: right; padding-top: 8px;">${trackingNumber} (${carrier || "Express Courier"})</td>
                        </tr>
                        `
                            : ""
                        }
                      </table>
                    </div>

                    <p style="font-size: 13.5px; line-height: 1.5; color: #6B7280; margin: 0;">
                      If you need to change your delivery instructions or have any questions, feel free to reply directly to this message.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 24px 32px; border-top: 1px solid #E9ECEF; text-align: center;">
                    <div style="font-size: 11px; color: #9CA3AF;">
                      © 2026 Sandline Studio • Handcrafted in Jaipur, India • Shipped Worldwide
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmailViaProvider({
    to: customerEmail,
    subject: `📦 Order #${orderNumber} Update: ${statusInfo.badge} | Sandline Studio`,
    html,
  });
}

async function sendEmailViaProvider({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL DISPATCH - SIMULATED (No RESEND_API_KEY set)]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Sandline Studio <orders@sandline.store>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[EMAIL ERROR] Resend failed:", errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    console.log("[EMAIL SUCCESS] Sent to:", to, "ID:", data.id);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("[EMAIL EXCEPTION]", err);
    return { success: false, error: String(err) };
  }
}

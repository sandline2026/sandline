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
                      RESORTWEAR • INDIA &amp; THE WORLD
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
                      We're delighted to confirm your order <strong>#${orderNumber}</strong>. Each piece is crafted and inspected in our India atelier before its express journey across the ocean.
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
                        Your parcel will ship via tracked international express courier. You will receive an email with tracking details as soon as it leaves India.
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
                      © 2026 Sandline Studio • Handcrafted in India • Shipped Worldwide
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

  // Send confirmation to customer
  await sendEmailViaProvider({
    to: customerEmail,
    subject: `✨ Order Confirmed: #${orderNumber} | Sandline Studio`,
    html,
  });

  // Automatically dispatch Admin Audit Email
  await sendAdminOrderAuditEmail({
    ...params,
    gateway: "Razorpay / Stripe",
  });

  return { success: true };
}

export interface AdminOrderAuditEmailParams extends OrderConfirmationParams {
  gateway?: string;
  gatewayTransactionId?: string;
}

export async function sendAdminOrderAuditEmail(params: AdminOrderAuditEmailParams) {
  const adminEmail = process.env.ADMIN_EMAIL || "orders@sandline.store";
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
    gateway = "Online Gateway",
    gatewayTransactionId,
  } = params;

  const itemsRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 10px 0; font-size: 13.5px; color: #111827;">
          <strong>${item.name}</strong>
          ${item.size || item.color ? `<br/><span style="font-size: 12px; color: #6B7280;">Size: ${item.size || "N/A"} | Color: ${item.color || "Standard"}</span>` : ""}
        </td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #374151; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; font-size: 13.5px; color: #111827; text-align: right; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const auditHtml = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"/><title>Audit Alert: #${orderNumber}</title></head>
      <body style="margin: 0; padding: 24px; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E5E7EB; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <tr>
                  <td>
                    <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; color: #92400E; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; display: inline-block;">
                      🚨 LIVE AUDIT ALERT • NEW PAID ORDER
                    </div>
                    <h2 style="margin: 0 0 8px; color: #111827; font-size: 20px;">New Order Placed: #${orderNumber}</h2>
                    <p style="margin: 0 0 20px; font-size: 14px; color: #4B5563;">A new luxury resortwear order has been confirmed and paid through <strong>${gateway}</strong>.</p>
                    
                    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13.5px;">
                        <tr><td style="color: #6B7280; width: 130px;">Client Name:</td><td><strong>${customerName}</strong></td></tr>
                        <tr><td style="color: #6B7280;">Client Email:</td><td><a href="mailto:${customerEmail}" style="color: #2563EB;">${customerEmail}</a></td></tr>
                        <tr><td style="color: #6B7280;">Shipping To:</td><td>${[addressLine, city, postalCode, country].filter(Boolean).join(", ") || "N/A"}</td></tr>
                        <tr><td style="color: #6B7280;">Gateway / ID:</td><td>${gateway} ${gatewayTransactionId ? `(${gatewayTransactionId})` : ""}</td></tr>
                        <tr><td style="color: #6B7280;">Total Paid:</td><td style="font-size: 16px; font-weight: bold; color: #059669;">$${total.toFixed(2)} USD</td></tr>
                      </table>
                    </div>

                    <h4 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #6B7280; letter-spacing: 0.05em;">Items Ordered (${items.reduce((s, i) => s + i.quantity, 0)} Units):</h4>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <thead>
                        <tr style="border-bottom: 2px solid #E5E7EB; text-transform: uppercase; font-size: 11px; color: #6B7280;">
                          <th align="left" style="padding-bottom: 6px;">Product</th>
                          <th align="center" style="padding-bottom: 6px;">Qty</th>
                          <th align="right" style="padding-bottom: 6px;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>${itemsRows}</tbody>
                    </table>

                    <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                      <a href="https://sandline.store/admin/orders" style="background-color: #111827; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; display: inline-block;">
                        Open Admin Portal &amp; Fulfill Order →
                      </a>
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
    to: adminEmail,
    subject: `🚨 [AUDIT ALERT] New Order #${orderNumber} by ${customerName} ($${total.toFixed(2)})`,
    html: auditHtml,
  });
}

export async function sendOrderStatusUpdateEmail(params: OrderStatusUpdateParams) {
  const { orderNumber, customerName, customerEmail, newStatus, trackingNumber, carrier } = params;

  const statusDescriptions: Record<string, { title: string; desc: string; color: string; badge: string }> = {
    shipped: {
      title: "Your order is on its way!",
      desc: "Great news! Your Sandline pieces have been hand-checked, packaged, and dispatched from our India atelier via tracked international courier.",
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
      desc: "Our India atelier is currently hand-finishing and pressing your resortwear pieces. We will notify you once courier dispatch is underway.",
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
                      © 2026 Sandline Studio • Handcrafted in India • Shipped Worldwide
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

export async function sendOtpVerificationEmail({
  email,
  otp,
  magicLink,
}: {
  email: string;
  otp: string;
  magicLink?: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sign in to Sandline Studio</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 12px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EAE6DF; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
                
                <!-- Brand Header -->
                <tr>
                  <td align="center" style="background-color: #111827; padding: 36px 20px;">
                    <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #F6EFE3; letter-spacing: 0.15em;">
                      SAND<span style="color: #FF7A54;">LINE</span>
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 0.2em; color: rgba(246, 239, 227, 0.7); margin-top: 6px; text-transform: uppercase;">
                      RESORTWEAR • CLIENT ACCESS
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 28px; text-align: center;">
                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em; color: #D97706; margin-bottom: 8px;">
                      ✦ 1-CLICK INSTANT SIGN-IN
                    </div>
                    <h1 style="margin: 0 0 12px; font-size: 24px; color: #111827; font-family: Georgia, serif;">
                      Sign In to Sandline Studio
                    </h1>
                    <p style="margin: 0 0 28px; font-size: 14.5px; line-height: 1.6; color: #4B5563;">
                      Click the button below to sign in instantly to your account. No password or code required:
                    </p>

                    ${
                      magicLink
                        ? `
                    <!-- 1-Click Magic Link Button -->
                    <div style="margin: 0 auto 28px; text-align: center;">
                      <a href="${magicLink}" style="display: inline-block; background-color: #111827; color: #FFFFFF; padding: 18px 42px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
                        ✦ Sign In to Sandline Studio →
                      </a>
                    </div>
                    `
                        : ""
                    }

                    <div style="border-top: 1px solid #EAE6DF; margin: 24px 0 20px; position: relative;">
                      <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #FFFFFF; padding: 0 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9CA3AF;">
                        Or use 6-digit access code
                      </span>
                    </div>

                    <!-- 6-Digit Code Box -->
                    <div style="background: linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 100%); border: 1px dashed #111827; border-radius: 12px; padding: 14px 24px; margin: 0 auto 20px; display: inline-block;">
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 30px; font-weight: 800; letter-spacing: 8px; color: #111827; margin-right: -8px;">
                        ${otp}
                      </div>
                    </div>

                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 20px;">
                      ⏱️ This link and code are valid for <strong>10 minutes</strong>.
                    </div>

                    <div style="border-top: 1px solid #EAE6DF; padding-top: 20px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                      If you did not request this login link, you can safely disregard this email.
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 20px 24px; border-top: 1px solid #EAE6DF; text-align: center;">
                    <div style="font-size: 11px; color: #9CA3AF;">
                      © 2026 Sandline Studio • Handcrafted in India • Shipped Worldwide
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
    to: email,
    subject: `✨ Sign In to Sandline Studio (1-Click Magic Link)`,
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

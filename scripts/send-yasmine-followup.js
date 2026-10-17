const fs = require('fs');
const path = require('path');

// 1. Read env variables
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const RESEND_API_KEY = env.RESEND_API_KEY || (typeof Buffer !== "undefined" ? Buffer.from("cmVfYlBHQzlaRkdfSzNMY1NyMnFrSlpWRFBkTjZOeDUzN3NF", "base64").toString("utf-8") : "");

async function sendFollowupEmail() {
  const to = "yhuneidi242@gmail.com";
  const cc = ["Puneetsingh0105@gmail.com", "anshsujal6100@gmail.com"];
  const bcc = ["sandlinestore@gmail.com"];
  const subject = "Re: Complete your Sandline order – Exclusive 20% OFF inside! 🎁";

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Capri Dress Reservation</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 14px;">
      <tr>
        <td align="center">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #ECE7DE; box-shadow: 0 4px 18px rgba(0,0,0,0.04);">
            
            <!-- Brand Header -->
            <tr>
              <td align="center" style="background-color: #111827; padding: 36px 20px;">
                <div style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #F6EFE3; letter-spacing: 0.15em;">
                  SAND<span style="color: #FF7A54;">LINE</span>
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 0.22em; color: rgba(246, 239, 227, 0.7); margin-top: 6px; text-transform: uppercase;">
                  RESORTWEAR • CLIENT CONCIERGE
                </div>
              </td>
            </tr>

            <!-- Content Body -->
            <tr>
              <td style="padding: 36px 32px 28px;">
                <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em; color: #D97706; margin-bottom: 8px;">
                  ✦ RESERVATION COURTESY UPDATE
                </div>
                
                <h1 style="margin: 0 0 16px; font-size: 22px; color: #111827; font-family: Georgia, serif; line-height: 1.35;">
                  Hi Yasmine,
                </h1>

                <p style="margin: 0 0 16px; font-size: 14.5px; line-height: 1.65; color: #374151;">
                  Following up gently on our previous note — we noticed you hadn't had a chance to complete your checkout yet, and we wanted to reach out before the current batch of the <strong>Capri 3D Rosette Crepe Halter Maxi Dress (Size M)</strong> sells out for the season.
                </p>

                <p style="margin: 0 0 22px; font-size: 14.5px; line-height: 1.65; color: #374151;">
                  We have specially kept your piece reserved at our atelier for delivery to <strong>Mama Shelter Residence in Dubai</strong>. We understand that international payment authentication or Apple Pay can occasionally time out or glitch.
                </p>

                <!-- Dress Box -->
                <div style="background-color: #FAF9F6; border: 1px solid #EBE5DB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size: 15px; font-weight: 600; color: #111827;">Capri 3D Rosette Crepe Halter Maxi Dress</td>
                      <td style="font-size: 13.5px; font-weight: 600; color: #6B7280; text-align: right;">Size M</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #6B7280; padding-top: 4px;">Pastel Yellow • Handcrafted Limited Atelier Piece</td>
                      <td style="font-size: 14px; font-weight: 700; color: #059669; text-align: right; padding-top: 4px;">20% OFF</td>
                    </tr>
                  </table>
                </div>

                <!-- Coupon Highlight -->
                <div style="background-color: #FFFBEB; border: 1px dashed #F59E0B; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 28px;">
                  <div style="font-size: 11.5px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em; color: #92400E; margin-bottom: 6px;">
                    Your Exclusive 20% Discount Code
                  </div>
                  <div style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: bold; color: #B45309; letter-spacing: 0.15em;">
                    BEACH20
                  </div>
                  <div style="font-size: 12px; color: #92400E; margin-top: 6px;">
                    Applied at checkout • Includes Complimentary Express Air Shipping to Dubai
                  </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="https://sandline.store/product/capri-3d-rosette-halter-maxi-dress" style="display: inline-block; background-color: #111827; color: #FFFFFF; padding: 16px 36px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 13.5px; letter-spacing: 0.08em; text-transform: uppercase; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
                    ✦ Complete Your Order (20% OFF) →
                  </a>
                </div>

                <p style="margin: 0 0 16px; font-size: 13.5px; line-height: 1.6; color: #4B5563;">
                  If you faced any issue with the card gateway or would prefer an alternate payment link, or have questions about delivery time to Dubai, feel free to reply directly to this email or message us on WhatsApp at <strong>+91 99580 45663</strong>.
                </p>

                <p style="margin: 24px 0 0; font-size: 14px; color: #111827; font-weight: 500;">
                  Warm regards,<br/>
                  <strong>Puneet &amp; Team Sandline</strong><br/>
                  <span style="font-size: 12px; color: #6B7280;">Sandline Studio Concierge • <a href="https://sandline.store" style="color: #6B7280; text-decoration: none;">sandline.store</a></span>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #F9FAFB; padding: 20px 24px; border-top: 1px solid #EAE6DF; text-align: center;">
                <div style="font-size: 11px; color: #9CA3AF;">
                  © 2026 Sandline Studio • Handcrafted in India • Express Worldwide Shipping
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

  const text = `Hi Yasmine,

Following up gently on our previous note — we noticed you hadn't had a chance to complete your checkout yet, and we wanted to reach out before the current batch of the Capri 3D Rosette Crepe Halter Maxi Dress (Size M) sells out for the season.

We have specially kept your piece reserved at our atelier for delivery to Mama Shelter Residence in Dubai. We understand that international payment authentication or Apple Pay can occasionally time out or glitch.

As a token of our appreciation, your exclusive 20% OFF coupon code is still active:
Coupon: BEACH20

You can complete your checkout directly using this link:
https://sandline.store/product/capri-3d-rosette-halter-maxi-dress

If you face any issues with the payment gateway, need an alternate payment option, or need help with shipping to Dubai, feel free to reply directly to this email or reach us on WhatsApp at +91 99580 45663.

Warm regards,
Puneet & Team Sandline
Website: https://sandline.store`;

  console.log("Sending follow-up email to Yasmine Huneidi via Resend API...");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "Sandline Studio <orders@sandline.store>",
      to: [to],
      cc,
      reply_to: "sandlinestore@gmail.com",
      subject,
      html,
      text,
    }),
  });

  const data = await res.json();
  console.log("Resend response status:", res.status);
  console.log("Resend response data:", JSON.stringify(data, null, 2));

  if (!res.ok || !data.id) {
    console.error("Failed to send follow-up email:", data);
    process.exit(1);
  }

  console.log("\n============================================");
  console.log("✓ SUCCESS: Follow-up email sent to Yasmine Huneidi!");
  console.log("Resend Message ID:", data.id);
  console.log("============================================");
}

sendFollowupEmail().catch(err => {
  console.error("Exception:", err);
  process.exit(1);
});

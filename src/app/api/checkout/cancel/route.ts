import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAdminPaymentIssueAlert } from "@/lib/email";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rstczvqfjiqoshlaabgy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Fnm-5bXoTSnhzJnfUMzaYw_pCXPvY7_"
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      reason = "Customer cancelled or dismissed payment",
      errorCode,
      errorStep,
      errorDescription,
    } = body;

    if (!orderId && !orderNumber) {
      return NextResponse.json({ error: "Missing orderId or orderNumber" }, { status: 400 });
    }

    // 1. Fetch Order and Customer details from Supabase
    let query = supabase
      .from("orders")
      .select(`
        id,
        order_number,
        total_usd,
        status,
        customer_id,
        customers (full_name, email, phone, address_line, city, country, postal_code),
        order_items (product_id, quantity, unit_price_usd, size, color)
      `);

    if (orderId) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("order_number", orderNumber);
    }

    const { data: rawOrder, error: fetchErr } = await query.maybeSingle();

    if (fetchErr) {
      console.error("[CHECKOUT CANCEL] Error fetching order:", fetchErr.message);
    }

    const order = rawOrder as any;
    let customer = Array.isArray(order?.customers) ? order?.customers[0] : order?.customers;

    if (!customer?.email && order?.customer_id) {
      const { data: custData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", order.customer_id)
        .maybeSingle();
      if (custData) customer = custData;
    }

    // 2. Update order notes in Supabase so admin sees the failure reason
    const failureNote = `[PAYMENT DROP-OFF] ${reason}${errorCode ? ` | Code: ${errorCode}` : ""}${errorStep ? ` | Step: ${errorStep}` : ""}${errorDescription ? ` | Desc: ${errorDescription}` : ""}`;
    const targetOrderId = order?.id || orderId;

    if (targetOrderId) {
      await supabase
        .from("orders")
        .update({
          notes: failureNote,
          status: "cancelled",
        })
        .eq("id", targetOrderId);
    }

    // 3. Resolve item names for admin alert
    let itemsSummary: { name: string; quantity: number; price: number; size?: string | null; color?: string | null }[] = [];
    if (order?.order_items && order.order_items.length > 0) {
      const productIds = order.order_items.map((i: any) => i.product_id);
      const { data: products } = await supabase.from("products").select("id, name").in("id", productIds);
      const prodMap = new Map((products || []).map((p: any) => [p.id, p.name]));

      itemsSummary = order.order_items.map((i: any) => ({
        name: prodMap.get(i.product_id) || "Sandline Garment",
        quantity: i.quantity || 1,
        price: Number(i.unit_price_usd) || 0,
        size: i.size,
        color: i.color,
      }));
    }

    // 4. Dispatch Admin Alert Email
    if (customer?.email || order?.order_number) {
      console.log(`[CHECKOUT CANCEL ALERT] Sending alert for order #${order?.order_number || orderNumber} to admin...`);
      await sendAdminPaymentIssueAlert({
        orderNumber: order?.order_number || orderNumber || "N/A",
        customerName: customer?.full_name || "Valued Client",
        customerEmail: customer?.email || "Not provided",
        customerPhone: customer?.phone,
        total: Number(order?.total_usd) || 0,
        country: customer?.country,
        city: customer?.city,
        addressLine: customer?.address_line,
        reason,
        errorCode,
        errorStep,
        errorDescription,
        items: itemsSummary,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error handling checkout cancel";
    console.error("[CHECKOUT CANCEL EXCEPTION]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

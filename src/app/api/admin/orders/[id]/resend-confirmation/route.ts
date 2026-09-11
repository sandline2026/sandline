import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmationEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rstczvqfjiqoshlaabgy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Fnm-5bXoTSnhzJnfUMzaYw_pCXPvY7_"
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: rawOrder, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        customers (full_name, email, address_line, city, postal_code, country),
        order_items (product_id, quantity, unit_price_usd, size, color)
      `)
      .eq("id", id)
      .single();

    if (orderError || !rawOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = rawOrder as any;
    let customer = Array.isArray(order?.customers) ? order?.customers[0] : order?.customers;

    if (!customer?.email && order?.customer_id) {
      const { data: custData } = await supabase
        .from("customers")
        .select("*")
        .eq("id", order.customer_id)
        .single();
      if (custData) customer = custData;
    }

    if (!customer?.email) {
      return NextResponse.json({ error: "Customer email not found on order" }, { status: 400 });
    }

    const productIds = (order.order_items || []).map((oi: any) => oi.product_id);
    const { data: prods } = await supabase.from("products").select("id, name").in("id", productIds);
    const prodMap = new Map((prods || []).map((p: any) => [p.id, p.name]));

    const itemsSummary = (order.order_items || []).map((oi: any) => ({
      name: prodMap.get(oi.product_id) || "Sandline Garment",
      quantity: oi.quantity || 1,
      price: Number(oi.unit_price_usd) || 0,
      size: oi.size,
      color: oi.color,
    }));

    const result = await sendOrderConfirmationEmail({
      orderNumber: order.order_number || id.slice(0, 8),
      customerName: customer.full_name || "Valued Shopper",
      customerEmail: customer.email,
      items: itemsSummary,
      subtotal: Number(order.subtotal_usd || order.total_usd || 0),
      discount: Number(order.discount_usd || 0),
      total: Number(order.total_usd || 0),
      addressLine: customer.address_line,
      city: customer.city,
      postalCode: customer.postal_code,
      country: customer.country,
    });

    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to re-send confirmation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cviwdzcgadfkolvvobal.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_d5yolyCcJMQ_lhnmk0QTCQ_M4iMiedI"
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatePayload: Record<string, any> = {};
    if (body.status !== undefined) {
      updatePayload.status = body.status;
    }
    if (body.trackingNumber !== undefined) {
      updatePayload.tracking_number = body.trackingNumber;
    }
    if (body.carrier !== undefined) {
      updatePayload.shipping_partner = body.carrier;
    } else if (body.shippingPartner !== undefined) {
      updatePayload.shipping_partner = body.shippingPartner;
    }

    const { error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger status update email to customer
    if (body.status) {
      const { data: rawOrder } = await supabase
        .from("orders")
        .select(`
          order_number,
          customer_id,
          customers (full_name, email)
        `)
        .eq("id", id)
        .single();

      const order = rawOrder as any;
      let customer = Array.isArray(order?.customers) ? order?.customers[0] : order?.customers;

      if (!customer?.email && order?.customer_id) {
        const { data: custData } = await supabase
          .from("customers")
          .select("full_name, email")
          .eq("id", order.customer_id)
          .single();
        if (custData) customer = custData;
      }

      if (order && customer?.email) {
        console.log(`[ORDER STATUS EMAIL] Dispatching to ${customer.email} for order #${order.order_number} (${body.status})`);
        await sendOrderStatusUpdateEmail({
          orderNumber: order.order_number || id.slice(0, 8),
          customerName: customer.full_name || "Valued Client",
          customerEmail: customer.email,
          newStatus: body.status,
          trackingNumber: body.trackingNumber,
          carrier: body.carrier,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

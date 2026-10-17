import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rstczvqfjiqoshlaabgy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Fnm-5bXoTSnhzJnfUMzaYw_pCXPvY7_"
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
    let emailResult: { success?: boolean; id?: string; error?: string } | null = null;
    if (body.status || body.sendEmail || body.trackingNumber) {
      const { data: rawOrder } = await supabase
        .from("orders")
        .select(`
          order_number,
          status,
          tracking_number,
          shipping_partner,
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
        const targetStatus = body.status || order.status || "shipped";
        const targetTracking = body.trackingNumber !== undefined ? body.trackingNumber : order.tracking_number;
        const targetCarrier = body.carrier !== undefined ? body.carrier : (order.shipping_partner || "DHL Express");

        console.log(`[ORDER STATUS EMAIL] Dispatching to ${customer.email} for order #${order.order_number} (${targetStatus})`);
        emailResult = await sendOrderStatusUpdateEmail({
          orderNumber: order.order_number || id.slice(0, 8),
          customerName: customer.full_name || "Valued Client",
          customerEmail: customer.email,
          newStatus: targetStatus,
          trackingNumber: targetTracking || undefined,
          carrier: targetCarrier || undefined,
        });
      }
    }

    return NextResponse.json({
      success: true,
      emailSent: emailResult ? (emailResult.success ?? false) : false,
      emailId: emailResult?.id,
      emailError: emailResult?.error,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

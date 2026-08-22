import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const updatePayload: Record<string, any> = {};
    if (body.status !== undefined) {
      updatePayload.status = body.status;
    }

    const { error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger status update email to customer if status changed
    if (body.status) {
      const { data: rawOrder } = await supabase
        .from("orders")
        .select(`
          order_number,
          customers (full_name, email)
        `)
        .eq("id", id)
        .single();

      const order = rawOrder as any;
      const customer = Array.isArray(order?.customers) ? order?.customers[0] : order?.customers;

      if (order && customer?.email) {
        await sendOrderStatusUpdateEmail({
          orderNumber: order.order_number || id.slice(0, 8),
          customerName: customer.full_name || "Valued Shopper",
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

import { NextRequest, NextResponse } from "next/server";
import { createOrder, getAllOrders } from "@/lib/orderService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Items array is required" },
        { status: 400 }
      );
    }

    if (!body.customerEmail || !body.customerName) {
      return NextResponse.json(
        { success: false, error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    const baseAmount = Number(body.baseAmount || body.totalINR || 0);
    if (baseAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount" },
        { status: 400 }
      );
    }

    const orderId = body.orderId || `M272-${Date.now().toString().slice(-8)}`;

    const order = await createOrder({
      orderId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      contact: body.contact || "",
      discordId: body.discordId || "",
      items: body.items,
      baseAmount,
      paymentMethod: body.paymentMethod || "fampay_upi",
    });

    const fampayUpiId =
      process.env.NEXT_PUBLIC_FAMPAY_UPI_ID ||
      process.env.FAMPAY_UPI_ID ||
      "mani272@fam";

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        payAmountRupees: (order.payAmount / 100).toFixed(2),
        fampayUpiId,
      },
    });
  } catch (error: any) {
    console.error("[API Orders POST] Error creating order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to list orders" },
      { status: 500 }
    );
  }
}

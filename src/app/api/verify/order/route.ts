import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orderService";
import { verifyPayments } from "@/lib/verify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = body?.orderId?.trim();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    let order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // If order is already paid, return immediately
    if (order.status === "paid") {
      return NextResponse.json({
        success: true,
        status: "paid",
        order: {
          ...order,
          payAmountRupees: (order.payAmount / 100).toFixed(2),
        },
      });
    }

    // If still pending, trigger email verification
    if (order.status === "pending") {
      try {
        await verifyPayments(25); // Check emails from the past 25 minutes
        order = await getOrder(orderId);
      } catch (checkErr) {
        console.error("[Verify Order] Error running quick verification:", checkErr);
      }
    }

    return NextResponse.json({
      success: true,
      status: order?.status || "pending",
      order: order
        ? {
            ...order,
            payAmountRupees: (order.payAmount / 100).toFixed(2),
          }
        : null,
    });
  } catch (error: any) {
    console.error("[API Verify Order] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify order" },
      { status: 500 }
    );
  }
}

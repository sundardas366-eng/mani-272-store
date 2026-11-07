import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orderService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await getOrder(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

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
    console.error("[API Orders GET ID] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve order" },
      { status: 500 }
    );
  }
}

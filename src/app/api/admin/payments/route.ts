import { NextResponse } from "next/server";
import { getAllPayments, getAllKeys } from "@/lib/paymentStore";

export async function GET() {
  try {
    const payments = await getAllPayments();
    const keys = await getAllKeys();

    return NextResponse.json({
      success: true,
      payments,
      keys,
      totalPayments: payments.length,
      totalKeys: keys.length,
    });
  } catch (error: any) {
    console.error("[Admin Payments API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve payment records" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyPayments } from "@/lib/verify";

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();

    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      const urlSecret = req.nextUrl.searchParams.get("secret");

      const isAuthorized =
        (authHeader && authHeader === `Bearer ${cronSecret}`) ||
        urlSecret === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid or missing CRON_SECRET" },
          { status: 401 }
        );
      }
    }

    const lookbackMinutes = Number(req.nextUrl.searchParams.get("lookback") || 60);
    const result = await verifyPayments(lookbackMinutes);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error: any) {
    console.error("[API Verify Cron] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Allow POST trigger as well
  return GET(req);
}

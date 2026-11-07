import { NextRequest, NextResponse } from "next/server";
import { verifyPayments } from "@/lib/verify";

export async function GET(req: NextRequest) {
  try {
    const cronSecret =
      process.env.CRON_SECRET?.trim() ||
      process.env.BOARD_API_KEY?.trim() ||
      "mani272_d41571add8b84d149c424a988c46b3569ea73628";

    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      const apiKeyHeader = req.headers.get("x-api-key");
      const urlSecret = req.nextUrl.searchParams.get("secret");
      const queryApiKey = req.nextUrl.searchParams.get("apiKey");

      const isAuthorized =
        (authHeader && authHeader === `Bearer ${cronSecret}`) ||
        apiKeyHeader === cronSecret ||
        urlSecret === cronSecret ||
        queryApiKey === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid or missing API key" },
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


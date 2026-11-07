import { NextRequest, NextResponse } from "next/server";
import { generateLicenseKey } from "@/lib/deliverProduct";

function isAuthorized(req: NextRequest): boolean {
  const validApiKey =
    process.env.BOARD_API_KEY?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    "mani272_d41571add8b84d149c424a988c46b3569ea73628";

  const headerKey = req.headers.get("x-api-key");
  const authHeader = req.headers.get("authorization");
  const bearerKey = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
  const queryKey = req.nextUrl.searchParams.get("apiKey");

  return (
    headerKey === validApiKey ||
    bearerKey === validApiKey ||
    queryKey === validApiKey
  );
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Invalid API Key" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "MANI 272 STORE Key Board API is connected and active.",
    supportedDurations: [
      { id: "1day", label: "1 Day Access", prefix: "MANI-1D" },
      { id: "3days", label: "3 Days Access", prefix: "MANI-3D" },
      { id: "7days", label: "7 Days Access", prefix: "MANI-7D" },
      { id: "30days", label: "30 Days Access", prefix: "MANI-30D" },
      { id: "lifetime", label: "Lifetime Access", prefix: "MANI-LIFE" },
    ],
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Invalid API Key" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const duration = body.duration || "30days";
    const count = Math.min(Math.max(Number(body.count || 1), 1), 50);

    const keys = Array.from({ length: count }, () => generateLicenseKey(duration));

    return NextResponse.json({
      success: true,
      count: keys.length,
      duration,
      keys,
      key: keys[0],
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate keys" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { isValidUtrFormat } from "@/lib/bankParsers";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";
import {
  hasUtr,
  getKeyByUtr,
  recordVerifiedPayment,
} from "@/lib/paymentStore";
import { verifyPaymentViaGmail } from "@/lib/gmailVerifier";
import {
  calculatePlanDays,
  calculateKeyExpiration,
  callKeywordBotApi,
  generateLicenseKey,
  sendDiscordWebhookNotification,
} from "@/lib/deliverProduct";
import { getOrder, markOrderAsPaid } from "@/lib/orderService";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // Step 1: Rate Limiting (Max 5 attempts per IP per hour)
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many verification attempts. Rate limit exceeded. Try again in ${rateCheck.retryAfterSeconds} seconds.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
          remainingAttempts: 0,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawUtr = (body.utr || "").toString().trim();
    const orderId = (body.orderId || "").toString().trim();
    const customerEmail = (body.customerEmail || body.email || "").toString().trim();
    const customerDiscord = (body.customerDiscord || body.discordId || "").toString().trim();
    const requestedDays = Number(body.planDays || body.days || 0);
    const minPriceINR = Number(body.minAmountINR || body.planPrice || 0);

    // Step 2: Validate UTR format (12 numeric digits)
    if (!rawUtr || !isValidUtrFormat(rawUtr)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid UTR format. Please enter a valid 12-digit numeric UPI reference number.",
          remainingAttempts: rateCheck.remaining,
        },
        { status: 400 }
      );
    }

    // Step 3: Idempotency & Replay Attack Check
    const existingKey = await getKeyByUtr(rawUtr);
    if (existingKey) {
      // Idempotent success: return existing generated key
      return NextResponse.json({
        success: true,
        verified: true,
        idempotent: true,
        utr: rawUtr,
        key: existingKey.key,
        expiresAt: existingKey.expires_at,
        planDays: existingKey.plan_days,
        message: "Payment previously verified. Here is your access key.",
        downloadUrl: "https://discord.gg/4DMtsmZX6k",
        remainingAttempts: rateCheck.remaining,
      });
    }

    const isAlreadyUsed = await hasUtr(rawUtr);
    if (isAlreadyUsed) {
      return NextResponse.json(
        {
          success: false,
          error: "This UTR has already been claimed for another order. Replay attacks are prohibited.",
          remainingAttempts: rateCheck.remaining,
        },
        { status: 409 }
      );
    }

    // Resolve minimum required amount
    let targetMinAmount = minPriceINR;
    let targetOrder = null;
    if (orderId) {
      targetOrder = await getOrder(orderId);
      if (targetOrder) {
        targetMinAmount = Math.max(targetMinAmount, targetOrder.baseAmount);
      }
    }

    // Default to minimum 1-day plan price if not specified
    if (!targetMinAmount || targetMinAmount <= 0) {
      targetMinAmount = 119;
    }

    // Step 4: Search Gmail via REST API / IMAP for credit alert
    const gmailResult = await verifyPaymentViaGmail({
      utr: rawUtr,
      minAmountINR: targetMinAmount,
    });

    if (!gmailResult.verified) {
      return NextResponse.json(
        {
          success: false,
          error:
            gmailResult.error ||
            "Payment not found yet, try again in a few minutes.",
          remainingAttempts: rateCheck.remaining,
        },
        { status: 404 }
      );
    }

    // Step 5: Determine plan duration based on actual credited amount
    const creditedINR = gmailResult.amountINR || targetMinAmount;
    const planDays = requestedDays > 0 ? requestedDays : calculatePlanDays(creditedINR);
    const expiresAt = calculateKeyExpiration(planDays);

    // Step 6: Generate access key via Bot API
    const botKey = await callKeywordBotApi(planDays, orderId, customerEmail);
    const licenseKey = botKey || generateLicenseKey(planDays);

    // Step 7: Atomic insert to payments (UNIQUE utr) and keys
    const paymentRecord = {
      utr: rawUtr,
      amount: creditedINR,
      amountPaise: Math.round(creditedINR * 100),
      plan_days: planDays,
      status: "verified" as const,
      customer_email: customerEmail || (targetOrder?.customerEmail) || "customer@mani272.com",
      customer_discord: customerDiscord || (targetOrder?.discordId) || "",
      order_id: orderId || targetOrder?.orderId || "",
      bank_name: gmailResult.bankName || "UPI Credit Alert",
      created_at: new Date().toISOString(),
    };

    const keyRecord = {
      key: licenseKey,
      utr: rawUtr,
      expires_at: expiresAt.toISOString(),
      plan_days: planDays,
      created_at: new Date().toISOString(),
    };

    await recordVerifiedPayment(paymentRecord, keyRecord);

    // Update order status if linked to an active order
    if (orderId) {
      await markOrderAsPaid(orderId, rawUtr, licenseKey).catch((err) =>
        console.warn("[Order Sync] Could not mark order as paid:", err)
      );
    }

    // Send Discord sales alert
    const downloadUrl = targetOrder?.downloadUrl || "https://discord.gg/4DMtsmZX6k";
    if (customerEmail || customerDiscord) {
      await sendDiscordWebhookNotification(
        {
          orderId: orderId || `MANI-${rawUtr.slice(-6)}`,
          customerName: targetOrder?.customerName || customerEmail.split("@")[0] || "Customer",
          customerEmail: customerEmail || "support@mani272.com",
          discordId: customerDiscord,
          payAmount: Math.round(creditedINR * 100),
          baseAmount: creditedINR,
          utr: rawUtr,
          items: [
            {
              productId: "license-key",
              productName: `MANI 272 Access (${planDays} Days)`,
              duration: `${planDays}days`,
              priceINR: creditedINR,
              quantity: 1,
            },
          ],
          downloadUrl,
        },
        licenseKey,
        downloadUrl
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      verified: true,
      utr: rawUtr,
      amount: creditedINR,
      planDays,
      key: licenseKey,
      expiresAt: expiresAt.toISOString(),
      downloadUrl,
      remainingAttempts: rateCheck.remaining,
    });
  } catch (error: any) {
    console.error("[Verify UTR API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during verification.",
      },
      { status: 500 }
    );
  }
}

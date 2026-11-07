import crypto from "crypto";

export interface DeliveryResult {
  licenseKey: string;
  downloadUrl: string;
  deliveredAt: Date;
  discordNotified: boolean;
}

export interface OrderForDelivery {
  orderId: string;
  customerName: string;
  customerEmail: string;
  contact?: string;
  discordId?: string;
  payAmount: number; // in paise
  baseAmount: number;
  utr?: string;
  items: Array<{
    productId: string;
    productName: string;
    duration?: string;
    durationLabel?: string;
    priceINR?: number;
    quantity?: number;
  }>;
  downloadUrl?: string;
}

/**
 * Calculates plan days based on paid amount or duration string.
 * Plan Table:
 *   ₹119  -> 1 day
 *   ₹349  -> 3 days
 *   ₹649  -> 7 days
 *   ₹1599 -> 30 days
 *   ₹3999 -> 3650 days (Lifetime)
 */
export function calculatePlanDays(amountINR: number, durationStr?: string): number {
  if (durationStr === "1day") return 1;
  if (durationStr === "3days") return 3;
  if (durationStr === "7days") return 7;
  if (durationStr === "30days") return 30;
  if (durationStr === "lifetime") return 3650;

  if (amountINR >= 3999) return 3650;
  if (amountINR >= 1599) return 30;
  if (amountINR >= 649) return 7;
  if (amountINR >= 349) return 3;
  if (amountINR >= 119) return 1;

  return 1;
}

/**
 * Generates an automated license key formatted according to purchased duration:
 * e.g. 1day -> MANI-1D-XXXX-XXXX-XXXX
 *      3days -> MANI-3D-XXXX-XXXX-XXXX
 *      7days -> MANI-7D-XXXX-XXXX-XXXX
 *      30days -> MANI-30D-XXXX-XXXX-XXXX
 *      lifetime -> MANI-LIFE-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(duration?: string | number): string {
  const bytes = crypto.randomBytes(6).toString("hex").toUpperCase();
  const part1 = bytes.substring(0, 4);
  const part2 = bytes.substring(4, 8);
  const part3 = crypto.randomBytes(2).toString("hex").toUpperCase();

  let prefix = "MANI";
  if (duration === "1day" || duration === 1) prefix = "MANI-1D";
  else if (duration === "3days" || duration === 3) prefix = "MANI-3D";
  else if (duration === "7days" || duration === 7) prefix = "MANI-7D";
  else if (duration === "30days" || duration === 30) prefix = "MANI-30D";
  else if (duration === "lifetime" || duration === 3650) prefix = "MANI-LIFE";

  return `${prefix}-${part1}-${part2}-${part3}`;
}

/**
 * Calculates key expiration date based on duration in days.
 */
export function calculateKeyExpiration(days: number): Date {
  const now = new Date();
  if (days >= 3650) {
    // 10 years for lifetime
    return new Date(now.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
  }
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Calls keyword-bot API to generate access key valid for the exact duration.
 * Uses official API key: mani272_8ca9bcfb6152cbbb5b5d42e4a2637bd074edf134
 */
export async function callKeywordBotApi(
  days: number,
  orderId?: string,
  customerEmail?: string
): Promise<string | null> {
  const boardUrl = process.env.BOARD_API_URL?.trim();
  const apiKey =
    process.env.BOARD_API_KEY?.trim() ||
    process.env.BOT_API_KEY?.trim() ||
    "mani272_8ca9bcfb6152cbbb5b5d42e4a2637bd074edf134";

  if (!boardUrl || !boardUrl.startsWith("http")) {
    return null;
  }

  try {
    const res = await fetch(boardUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        orderId: orderId || `KEY-${Date.now().toString().slice(-6)}`,
        days,
        duration: `${days}days`,
        customerEmail: customerEmail || "customer@mani272.com",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.key || data.licenseKey || data.token) {
        return (data.key || data.licenseKey || data.token).toString();
      }
    }
  } catch (err) {
    console.warn("[Bot API] External bot call failed, falling back to built-in generator:", err);
  }

  return null;
}

/**
 * Attempts to request a key from an external bot/board panel API if BOARD_API_URL is configured.
 */
async function fetchKeyFromBoard(order: OrderForDelivery, duration?: string): Promise<string | null> {
  const days = calculatePlanDays(order.baseAmount, duration);
  return await callKeywordBotApi(days, order.orderId, order.customerEmail);
}

/**
 * Sends a rich Discord embed to the configured sales webhook.
 */
export async function sendDiscordWebhookNotification(
  order: OrderForDelivery,
  licenseKey: string,
  downloadUrl: string
): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_SALES_WEBHOOK_URL?.trim();
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return false;
  }

  const inrAmount = (order.payAmount / 100).toFixed(2);
  const productList = order.items
    .map((item) => `• **${item.productName}** (${item.durationLabel || item.duration || "Standard"})`)
    .join("\n");

  const embed = {
    title: "⚡ Payment Verified & Key Auto-Delivered! (FamPay UPI)",
    color: 0xf50b00, // MANI RED #F50B00
    description: `Order **#${order.orderId}** has been automatically verified via FamPay UPI and key issued.`,
    fields: [
      {
        name: "💰 Amount Received",
        value: `**₹${inrAmount}**`,
        inline: true,
      },
      {
        name: "🧾 UTR / Reference ID",
        value: `\`${order.utr || "Verified"}\``,
        inline: true,
      },
      {
        name: "👤 Customer",
        value: `${order.customerName}\n${order.customerEmail}`,
        inline: true,
      },
      {
        name: "🎮 Discord User ID",
        value: order.discordId ? `<@${order.discordId}> (\`${order.discordId}\`)` : "Not provided",
        inline: true,
      },
      {
        name: "📱 Contact",
        value: order.contact || "N/A",
        inline: true,
      },
      {
        name: "📦 Products Ordered",
        value: productList || "N/A",
        inline: false,
      },
      {
        name: "🔑 Automated License Key",
        value: `\`\`\`${licenseKey}\`\`\``,
        inline: false,
      },
      {
        name: "📥 Download Link",
        value: downloadUrl || "https://discord.gg/4DMtsmZX6k",
        inline: false,
      },
    ],
    footer: {
      text: "MANI 272 STORE • 24/7 Automated Key Delivery",
      icon_url: "https://mani-272-store.vercel.app/images/logo/mani-272-logo.gif",
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "MANI 272 STORE Bot",
        avatar_url: "https://mani-272-store.vercel.app/images/logo/mani-272-logo.gif",
        embeds: [embed],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[Discord Webhook] Failed to dispatch webhook:", err);
    return false;
  }
}

/**
 * Handles product delivery for a verified order.
 */
export async function deliverProduct(order: OrderForDelivery): Promise<DeliveryResult> {
  const duration = order.items?.[0]?.duration;
  // Try external board API first, or generate automatically
  const boardKey = await fetchKeyFromBoard(order, duration);
  const licenseKey = boardKey || generateLicenseKey(duration);

  const downloadUrl = order.downloadUrl || "https://discord.gg/4DMtsmZX6k";
  const discordNotified = await sendDiscordWebhookNotification(order, licenseKey, downloadUrl);

  return {
    licenseKey,
    downloadUrl,
    deliveredAt: new Date(),
    discordNotified,
  };
}

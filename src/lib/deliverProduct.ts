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
 * Generates an automated license key formatted according to purchased duration:
 * e.g. 1day -> MANI-1D-XXXX-XXXX-XXXX
 *      30days -> MANI-30D-XXXX-XXXX-XXXX
 *      lifetime -> MANI-LIFE-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(duration?: string): string {
  const bytes = crypto.randomBytes(6).toString("hex").toUpperCase();
  const part1 = bytes.substring(0, 4);
  const part2 = bytes.substring(4, 8);
  const part3 = crypto.randomBytes(2).toString("hex").toUpperCase();

  let prefix = "MANI";
  if (duration === "1day") prefix = "MANI-1D";
  else if (duration === "3days") prefix = "MANI-3D";
  else if (duration === "7days") prefix = "MANI-7D";
  else if (duration === "30days") prefix = "MANI-30D";
  else if (duration === "lifetime") prefix = "MANI-LIFE";

  return `${prefix}-${part1}-${part2}-${part3}`;
}

/**
 * Attempts to request a key from an external bot/board panel API if BOARD_API_URL is configured.
 */
async function fetchKeyFromBoard(order: OrderForDelivery, duration?: string): Promise<string | null> {
  const boardUrl = process.env.BOARD_API_URL?.trim();
  const apiKey =
    process.env.BOARD_API_KEY?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    "mani272_d41571add8b84d149c424a988c46b3569ea73628";

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
        orderId: order.orderId,
        duration: duration || "30days",
        product: order.items[0]?.productName || "Gaming Panel",
        customerEmail: order.customerEmail,
        discordId: order.discordId || "",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.key || data.licenseKey || data.token) {
        return (data.key || data.licenseKey || data.token).toString();
      }
    }
  } catch (err) {
    console.warn("[Board API] External board call failed, falling back to built-in generator:", err);
  }

  return null;
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

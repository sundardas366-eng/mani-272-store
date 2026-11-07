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
 * Generates a license key formatted as MANI-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const bytes = crypto.randomBytes(6).toString("hex").toUpperCase();
  // Format: MANI-XXXX-XXXX-XXXX
  const part1 = bytes.substring(0, 4);
  const part2 = bytes.substring(4, 8);
  const part3 = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `MANI-${part1}-${part2}-${part3}`;
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
    title: "⚡ Payment Verified & Product Delivered! (FamPay UPI)",
    color: 0xf50b00, // MANI RED #F50B00
    description: `Order **#${order.orderId}** has been automatically verified via FamPay UPI and delivered.`,
    fields: [
      {
        name: "💰 Amount Received",
        value: `**₹${inrAmount}**`,
        inline: true,
      },
      {
        name: "🧾 UTR / Reference ID",
        value: `\`${order.utr || "N/A"}\``,
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
        name: "🔑 Generated License Key",
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
      text: "MANI 272 STORE • Automated Payment & Delivery System",
      icon_url: "https://mani-272-store.vercel.app/logo.png",
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "MANI 272 STORE Bot",
        avatar_url: "https://mani-272-store.vercel.app/logo.png",
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
  const licenseKey = generateLicenseKey();
  const downloadUrl = order.downloadUrl || "https://discord.gg/4DMtsmZX6k";

  const discordNotified = await sendDiscordWebhookNotification(order, licenseKey, downloadUrl);

  return {
    licenseKey,
    downloadUrl,
    deliveredAt: new Date(),
    discordNotified,
  };
}

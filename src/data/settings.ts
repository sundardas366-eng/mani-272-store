// ============================================================
// MANI 272 STORE — Site Settings (Updated with Team, YouTube, Pricing)
// ============================================================

import type { SiteSettings, Review, DurationPrice } from "@/types";

// ---- Official MANI 272 Logo ----
const LOGO_URL = "/images/logo/mani-272-logo.gif";

// ---- Duration-based pricing tiers ----
export const DEFAULT_PRICING: DurationPrice[] = [
  { id: "1day",     label: "1 Day Access",       usd: 2,  inr: 119,   },
  { id: "3days",    label: "3 Days Access",      usd: 4,  inr: 349,   },
  { id: "7days",    label: "7 Days Access",      usd: 8,  inr: 649,   },
  { id: "30days",   label: "30 Days Access",     usd: 23, inr: 1599,  },
  { id: "lifetime", label: "Lifetime Access",    usd: 45, inr: 3999,  badge: "BEST VALUE" },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: LOGO_URL,
  siteName: "MANI 272 STORE",
  bannerText: "Premium Gaming Digital Products",
  announcementText: "🎉 Welcome to MANI 272 STORE — Use code MANI10 for 10% off your first order!",
  primaryColor: "#F50B00",
  discordInviteUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/4DMtsmZX6k",
  discordServerName: process.env.NEXT_PUBLIC_DISCORD_SERVER_NAME || "MANI 272 STORE",
  discordServerDescription:
    process.env.NEXT_PUBLIC_DISCORD_SERVER_DESCRIPTION ||
    "Join the official MANI 272 STORE Discord community for instant support, product updates, custom configs and exclusive gamer perks.",
  discordLogoUrl: "/images/logo/discord-logo.svg",
  // YouTube — Official channel provided by user
  youtubeChannelUrl: "https://www.youtube.com/@eagle272-v4p",
  youtubeChannelName: "EAGLE 272",
  youtubeChannelDescription:
    "Official YouTube channel for MANI 272 STORE. Tutorials, demos, product showcases and live gameplay previews.",
  youtubeChannelLogo: "",
  youtubeVideoUrl: "",
  youtubeEnabled: true,
  // Team members
  owner: {
    name: "Mani 272",
    position: "SERVER OWNER",
    description: "Server Owner and Founder of MANI 272 STORE. Managing operations, security, infrastructure and ensuring top-tier service delivery.",
    photoUrl: "/images/team/mani-272-avatar.jpg",
    discordUserId: "1457931837769908467",
    discordUrl: "https://discord.com/users/1457931837769908467",
  },
  coFounder: {
    name: "Eagle 272",
    position: "CO-FOUNDER",
    description: "Co-Founder of MANI 272 STORE. Leading development, YouTube channel production, community operations and technical support.",
    photoUrl: "/images/team/eagle-272-avatar.jpg",
    discordUserId: "1508220374033109190",
    discordUrl: "https://discord.com/users/1508220374033109190",
  },
  // Pricing
  pricing: DEFAULT_PRICING,
  // Purchase section image (empty until provided)
  purchaseSectionImage: "",
};

// NOTE: Do NOT invent fake reviews. These are empty by default.
export const REVIEWS: Review[] = [];

export const STATS = {
  totalProducts: 24,
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
};

// Helper: get pricing tier by id
export function getPricingTier(id: string): DurationPrice | undefined {
  return DEFAULT_PRICING.find((p) => p.id === id);
}

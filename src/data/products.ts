// ============================================================
// MANI 272 STORE — Official 13 Products Catalog Data
// ============================================================

import type { Product, Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "panel", name: "Panels", description: "Control panels for every need", icon: "LayoutDashboard" },
  { id: "aim", name: "Aim", description: "Aim assist and aimbot tools", icon: "Target" },
  { id: "silent-aim", name: "Silent Aim", description: "Stealth aim modules", icon: "Crosshair" },
  { id: "bypass", name: "Bypass", description: "UID and library bypass modules", icon: "ShieldOff" },
  { id: "utility", name: "Utilities", description: "Boosters, emotes and gaming utilities", icon: "Wrench" },
];

const now = new Date().toISOString();

export const PRODUCTS: Product[] = [
  // 1. BASIC
  {
    id: "p01",
    slug: "basic",
    name: "BASIC",
    category: "panel",
    price: 1500,
    status: "available",
    description: "Entry-level control panel with essential settings and clean interface.",
    fullDescription:
      "BASIC is the entry-level control panel with essential settings and a clean interface. Perfect for beginners who need a simple, no-frills configuration tool. Upgrade to higher tiers anytime.",
    image: "/images/products/basic-panel.svg",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 2. BRUTAL
  {
    id: "p02",
    slug: "brutal",
    name: "BRUTAL",
    category: "panel",
    price: 2999,
    status: "available",
    description: "Aggressive full-featured control panel with extensive customization options.",
    fullDescription:
      "BRUTAL is an aggressive, full-featured control panel with extensive customization options. Includes every setting you need — from aim configuration to visual overlays. Built for power users.",
    image:
      "https://cdn.discordapp.com/attachments/1534802084761833532/1568649555841519818/thJWfLcEka4-HD.jpg?ex=6af0963e&is=6aef44be&hm=fc26171f4ce1068fe9a0d5a6f0dc0105d00c11fd6f32ef186d1373595cae058d&",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: true,
    bestSeller: false,
    specialOffer: true,
    createdAt: now,
    updatedAt: now,
  },

  // 3. PREMIUM
  {
    id: "p03",
    slug: "premium",
    name: "PREMIUM",
    category: "panel",
    price: 3999,
    status: "available",
    description: "Top-tier panel with all modules unlocked and priority support.",
    fullDescription:
      "PREMIUM is the top-tier control panel with every module unlocked. Includes priority updates, dedicated support, advanced configuration options, and early access to new features. The ultimate choice for serious users.",
    image:
      "https://media.discordapp.net/attachments/1534802084761833532/1568646398449295360/Premium_Aimbot_Functions_Panel.png?ex=6af0934d&is=6aef41cd&hm=6f0e32f56a79e83e0df8b64c3fefc90ec3f78e81a4bb4bbc030c33733d58b6cb&=&format=webp&quality=lossless&width=1536&height=865",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: true,
    bestSeller: true,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 4. AIMBOT VISIBLE
  {
    id: "p04",
    slug: "aimbot-visible",
    name: "AIMBOT VISIBLE",
    category: "aim",
    price: 2200,
    status: "available",
    description: "Visible aimbot panel with on-screen aim assist and customizable HUD overlay.",
    fullDescription:
      "AIMBOT VISIBLE provides an on-screen visible aimbot with both manual and auto modes. Features include FOV circle, bone selector, smooth factor, and target priority. The panel overlay is fully customizable.",
    image:
      "https://media.discordapp.net/attachments/1534802084761833532/1568650811221872822/Free_Fire_Alley_HUD_with_Aim_Overlay.png?ex=6af09769&is=6aef45e9&hm=b03dc13ad99da3e915776cce747b8437b586db674f19bbe2a95f6a14105537cd&=&format=webp&quality=lossless&width=768&height=433",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 5. INTERNAL
  {
    id: "p05",
    slug: "internal",
    name: "INTERNAL",
    category: "panel",
    price: 3499,
    status: "available",
    description: "Deep in-game integration with internal rendering pipeline and zero input lag.",
    fullDescription:
      "INTERNAL provides deep in-game integration with an internal overlay that renders directly into the game's rendering pipeline. Low overhead, zero input lag, and seamless visual integration.",
    image:
      "https://media.discordapp.net/attachments/1534802084761833532/1568649745340309627/MANI_272_Internal_Panel_Gaming_Thumbnail.png?ex=6af0966b&is=6aef44eb&hm=f9cfbcae3ec618ba470207c30e44694cc6fcb2ad04ae7308891a94e25b856bc3&=&format=webp&quality=lossless&width=768&height=433",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: true,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 6. SILENT AIM
  {
    id: "p06",
    slug: "silent-aim",
    name: "SILENT AIM",
    category: "silent-aim",
    price: 2500,
    status: "available",
    description: "Stealth aim module that redirects shots without any visible flick or crosshair movement.",
    fullDescription:
      "SILENT AIM is a stealth-oriented aim module that redirects your shots to the closest valid target without any visible crosshair movement. Perfect for streamers and competitive players who need undetectable precision. Includes smooth prediction, configurable FOV, and bone selector.",
    image:
      "https://media.discordapp.net/attachments/1534802084761833532/1568646400378409031/Gaming_Range_Aimbot_Interface.png?ex=6af0934d&is=6aef41cd&hm=c7b2fe260d94dc4cf70fa4b79a3269b0fd0da1df30d32ced1bf06613334d0f06&=&format=webp&quality=lossless&width=1536&height=865",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: true,
    bestSeller: true,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 7. AIMKILL EXE
  {
    id: "p07",
    slug: "aimkill-exe",
    name: "AIMKILL EXE",
    category: "aim",
    price: 2800,
    status: "available",
    description: "Executable aim assist tool designed for PC players with instant target acquisition.",
    fullDescription:
      "AIMKILL EXE is a standalone executable aim assist tool designed for PC players. Features hotkey activation, configurable keybinds, smooth acceleration, and multi-game compatibility. Runs independently with minimal CPU footprint.",
    image:
      "https://media.discordapp.net/attachments/1534802084761833532/1568652306164093109/Aim_Kill_Pvt_Gaming_Banner.png?ex=6af098cd&is=6aef474d&hm=073b037a837ea5f04aac841da5abf6188f786e4661794ddac9b7a98f003c438b&=&format=webp&quality=lossless&width=1536&height=864",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: true,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 8. UID BYPASS
  {
    id: "p08",
    slug: "uid-bypass",
    name: "UID BYPASS",
    category: "bypass",
    price: 1999,
    status: "available",
    description: "Hardware and account identifier bypass ensuring complete session anonymity.",
    fullDescription:
      "UID BYPASS masks and spoofs your unique hardware and account identifiers to prevent device-level tracking. Features one-click ID regeneration, persistent spoofing across restarts, and compatibility with leading anti-cheat solutions.",
    image:
      "https://media.discordapp.net/attachments/1534802084761833532/1566102511318859937/UID_BYEPASS_1_.jpg?ex=6aefe3df&is=6aee925f&hm=91b93978e5a0961227d494cc671979ae9a744e345e15ed480603865e0e2cd76f&=&format=webp",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: false,
    specialOffer: true,
    createdAt: now,
    updatedAt: now,
  },

  // 9. LIB BYPASS
  {
    id: "p09",
    slug: "lib-bypass",
    name: "LIB BYPASS",
    category: "bypass",
    price: 2499,
    status: "available",
    description: "Library-level bypass hooking into system libraries for complete anti-cheat immunity.",
    fullDescription:
      "LIB BYPASS is a library-level bypass that hooks into the game's library layer to provide anti-cheat compatibility. Supports both ARM and ARM64 architectures. Regularly updated to match the latest anti-cheat patches.",
    image:
      "https://media.discordapp.net/attachments/1534802084761833532/1568646399657115648/Neon_Bypass_Arena_Promo.png?ex=6af0934d&is=6aef41cd&hm=8c484650e089c82b78dad88fcf543faa7ed425b0bb194f3748f1010413f5b34d&=&format=webp&quality=lossless&width=1536&height=865",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: true,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 10. EMOTE
  {
    id: "p10",
    slug: "emote",
    name: "EMOTE",
    category: "utility",
    price: 999,
    status: "available",
    description: "Emote unlocker and customizable fast-trigger panel.",
    fullDescription:
      "EMOTE gives you access to a large library of emotes with a customizable panel. Quick-trigger shortcuts, favorites, and custom emote uploads. Works seamlessly across multiple game modes.",
    image:
      "https://cdn.discordapp.com/attachments/1534802084761833532/1568652049824878612/MANI_272_Emote_Hack_Lobby_Overlay.png?ex=6af09890&is=6aef4710&hm=745ceb2ca23e33d01760f31cd7f36b7fbfafed2d953ae7c069aa898badf541c4&",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 11. FPS BOOST
  {
    id: "p11",
    slug: "fps-boost",
    name: "FPS BOOST",
    category: "utility",
    price: 899,
    status: "available",
    description: "System and game optimizer that unlocks maximum FPS, reduces stutter, and stabilizes frametimes.",
    fullDescription:
      "FPS BOOST is a comprehensive performance optimization utility. Cleans standby memory, optimizes CPU core allocation, tunes DirectX/Vulkan pipelines, and removes background throttling to deliver smooth, competitive framerates.",
    image: "/images/products/fps-boost.svg",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 12. VAULT
  {
    id: "p12",
    slug: "vault",
    name: "VAULT",
    category: "panel",
    price: 1799,
    status: "available",
    description: "Encrypted configuration storage and profile manager with one-click restore.",
    fullDescription:
      "VAULT provides encrypted configuration storage with one-click restore. Save multiple profiles, switch between them instantly, and protect your settings with a password. Includes cloud backup support.",
    image: "/images/products/vault-panel.svg",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },

  // 13. STREAMER
  {
    id: "p13",
    slug: "streamer",
    name: "STREAMER",
    category: "panel",
    price: 2599,
    status: "available",
    description: "Discreet streamer-safe panel completely invisible to recording software.",
    fullDescription:
      "STREAMER is designed to stay completely invisible during live streams. All overlays, indicators, and UI elements are hidden from screen capture while remaining fully functional. Perfect for content creators.",
    image: "/images/products/streamer-panel.svg",
    links: { discord: "https://discord.gg/4DMtsmZX6k" },
    featured: false,
    bestSeller: false,
    specialOffer: false,
    createdAt: now,
    updatedAt: now,
  },
];

// ---- Helper functions ----
export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return PRODUCTS.find(
    (p) =>
      p.slug === clean ||
      p.slug === clean.replace(/-panel$/, "") ||
      p.slug + "-panel" === clean ||
      p.id === clean
  );
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((p) => p.bestSeller);
}

export function getSpecialOffers(): Product[] {
  return PRODUCTS.filter((p) => p.specialOffer);
}

export function getLatestProducts(): Product[] {
  return [...PRODUCTS].reverse();
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

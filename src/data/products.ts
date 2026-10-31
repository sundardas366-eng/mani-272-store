// ============================================================
// MANI 272 STORE — Product Catalog Data
// All 24 products from screenshots, with editable fields.
// ============================================================

import type { Product, Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "silent-aim", name: "Silent Aim", description: "Stealth aim modules", icon: "Crosshair" },
  { id: "aim", name: "Aim", description: "Aim assist and aimbot tools", icon: "Target" },
  { id: "bypass", name: "Bypass", description: "UID and library bypass modules", icon: "ShieldOff" },
  { id: "panel", name: "Panels", description: "Control panels for every need", icon: "LayoutDashboard" },
  { id: "utility", name: "Utilities", description: "Boosters, stores and emote panels", icon: "Wrench" },
];

const now = new Date().toISOString();

export const PRODUCTS: Product[] = [
  // ---- SILENT AIM ----
  {
    id: "p01", slug: "silent-aim", name: "SILENT-AIM", category: "silent-aim",
    price: 2500, status: "available",
    description: "Silent aim — hits land without visible flick.",
    fullDescription: "SILENT-AIM is a stealth-oriented aim module that redirects your shots to the closest valid target without any visible crosshair movement. Perfect for streamers and competitive players who need undetectable precision. Includes smooth prediction, configurable FOV, and bone selector.",
    image: "/images/products/silent-aim.png",
    links: {},
    featured: true, bestSeller: true, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p02", slug: "silent-aim-max", name: "SILENT-AIM-MAX", category: "silent-aim",
    price: 3500, status: "available",
    description: "Maximum-tier silent aim with advanced prediction.",
    fullDescription: "SILENT-AIM-MAX is the enhanced version with advanced prediction algorithms, improved anti-detection, and extended configuration options. Includes priority target selection, smooth factor tuning, and compatibility with the latest anti-cheat updates.",
    image: "/images/products/silent-aim-max.jpg",
    links: {},
    featured: true, bestSeller: false, specialOffer: true,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p03", slug: "cover-silent-exe", name: "COVER-SILENT-EXE", category: "silent-aim",
    price: 1800, status: "available",
    description: "Cover silent aim EXE build. Standalone.",
    fullDescription: "COVER-SILENT-EXE is a standalone executable build of the cover silent aim module. No installation required — just run and configure. Lightweight and optimized for low-end systems.",
    image: "/images/products/cover-silent-exe.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p04", slug: "cover-silent-apk", name: "COVER-SILENT-APK", category: "silent-aim",
    price: 1500, status: "available",
    description: "Cover silent aim mobile APK for Android.",
    fullDescription: "COVER-SILENT-APK is the mobile version of the cover silent aim module, built for Android devices. Optimized for touch controls and low battery consumption. Works on both rooted and non-rooted devices.",
    image: "/images/products/cover-silent-apk.svg",
    links: {},
    featured: false, bestSeller: true, specialOffer: false,
    createdAt: now, updatedAt: now,
  },

  // ---- AIM ----
  {
    id: "p05", slug: "force-aim", name: "FORCE-AIM", category: "aim",
    price: 1200, status: "available",
    description: "Force aim module — locks trajectory onto target.",
    fullDescription: "FORCE-AIM locks your trajectory onto the closest valid target with high precision. Features include adjustable lock strength, target priority, and smooth tracking. Ideal for close to mid-range engagements.",
    image: "/images/products/force-aim.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p06", slug: "aimkill", name: "AIMKILL", category: "aim",
    price: 1500, status: "available",
    description: "Classic aim assist core with smooth tracking.",
    fullDescription: "AIMKILL is the classic aim assist module with smooth tracking, quick target acquisition, and configurable sensitivity. Battle-tested across multiple game versions with consistent performance.",
    image: "/images/products/aimkill.svg",
    links: {},
    featured: true, bestSeller: true, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p07", slug: "aimkill-max", name: "AIMKILL-MAX", category: "aim",
    price: 2200, status: "available",
    description: "Enhanced AIMKILL — more control, better smoothing.",
    fullDescription: "AIMKILL-MAX is the enhanced version of AIMKILL with additional control options, improved smoothing algorithms, and extended configuration. Includes recoil compensation and multi-target handling.",
    image: "/images/products/aimkill-max.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: true,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p08", slug: "aimkill-exe", name: "AIMKILL-EXE", category: "aim",
    price: 1000, status: "available",
    description: "Standalone AIMKILL executable. Plug-and-run.",
    fullDescription: "AIMKILL-EXE is the standalone executable version of AIMKILL. No dependencies, no installation — download, run, and configure. Perfect for users who want a quick setup without extra software.",
    image: "/images/products/aimkill-exe.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p09", slug: "aimbot-visible-panel", name: "AIMBOT-VISIBLE-PANEL", category: "aim",
    price: 2000, status: "available",
    description: "Visible aimbot panel — on-screen aim assist.",
    fullDescription: "AIMBOT-VISIBLE-PANEL provides an on-screen visible aimbot with both manual and auto modes. Features include FOV circle, bone selector, smooth factor, and target priority. The panel overlay is fully customizable.",
    image: "/images/products/aimbot-visible-panel.svg",
    links: {},
    featured: true, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },

  // ---- BYPASS ----
  {
    id: "p10", slug: "uid-bypass", name: "UID-BYPASS", category: "bypass",
    price: 1800, status: "available",
    description: "UID bypass module for clean session handling.",
    fullDescription: "UID-BYPASS provides clean session handling and account safety by bypassing UID-based detection. Includes random UID generation, session masking, and compatibility with multiple game versions.",
    image: "/images/products/uid-bypass.jpg",
    links: {},
    featured: false, bestSeller: true, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p11", slug: "lib-bypass", name: "LIB-BYPASS", category: "bypass",
    price: 2000, status: "available",
    description: "Library-level bypass layer for anti-cheat compat.",
    fullDescription: "LIB-BYPASS is a library-level bypass that hooks into the game's library layer to provide anti-cheat compatibility. Supports both ARM and ARM64 architectures. Regularly updated to match the latest anti-cheat patches.",
    image: "/images/products/lib-bypass.png",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },

  // ---- PANEL ----
  {
    id: "p12", slug: "mobile-panel", name: "MOBILE-PANEL", category: "panel",
    price: 1200, status: "available",
    description: "Optimised mobile control panel with touch layout.",
    fullDescription: "MOBILE-PANEL is a touch-optimized control panel designed for mobile devices. Features a clean, intuitive interface with large touch targets, quick-toggle switches, and profile management.",
    image: "/images/products/mobile-panel.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p13", slug: "streamer-panel", name: "STREAMER-PANEL", category: "panel",
    price: 1800, status: "available",
    description: "Streamer-safe panel — discreet during live streams.",
    fullDescription: "STREAMER-PANEL is designed to stay completely invisible during live streams. All overlays, indicators, and UI elements are hidden from screen capture while remaining fully functional. Perfect for content creators.",
    image: "/images/products/streamer-panel.svg",
    links: {},
    featured: true, bestSeller: true, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p14", slug: "vault-panel", name: "VAULT-PANEL", category: "panel",
    price: 2500, status: "available",
    description: "Encrypted config storage with one-click restore.",
    fullDescription: "VAULT-PANEL provides encrypted configuration storage with one-click restore. Save multiple profiles, switch between them instantly, and protect your settings with a password. Includes cloud backup support.",
    image: "/images/products/vault-panel.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: true,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p15", slug: "basic-panel", name: "BASIC-PANEL", category: "panel",
    price: 800, status: "available",
    description: "Entry panel — essential settings, clean starter.",
    fullDescription: "BASIC-PANEL is the entry-level control panel with essential settings and a clean interface. Perfect for beginners who need a simple, no-frills configuration tool. Upgrade to higher tiers anytime.",
    image: "/images/products/basic-panel.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p16", slug: "brutal-panel", name: "BRUTAL-PANEL", category: "panel",
    price: 2000, status: "available",
    description: "Aggressive full-featured panel with customisation.",
    fullDescription: "BRUTAL-PANEL is an aggressive, full-featured control panel with extensive customisation options. Includes every setting you need — from aim configuration to visual overlays. Built for power users.",
    image: "/images/products/brutal-panel.svg",
    links: {},
    featured: false, bestSeller: true, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p17", slug: "premium-panel", name: "PREMIUM-PANEL", category: "panel",
    price: 3500, status: "available",
    description: "Top-tier panel — all modules unlocked, priority support.",
    fullDescription: "PREMIUM-PANEL is the top-tier control panel with every module unlocked. Includes priority updates, dedicated support, advanced configuration options, and early access to new features. The ultimate choice for serious users.",
    image: "/images/products/premium-panel.svg",
    links: {},
    featured: true, bestSeller: true, specialOffer: true,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p18", slug: "loader-panel", name: "LOADER-PANEL", category: "panel",
    price: 1500, status: "available",
    description: "Secure loader — loads config without exposing files.",
    fullDescription: "LOADER-PANEL is a secure loader that injects configurations without exposing raw files on disk. Includes encryption, anti-tamper protection, and automatic cleanup after session end.",
    image: "/images/products/loader-panel.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p19", slug: "internal-panel", name: "INTERNAL-PANEL", category: "panel",
    price: 2200, status: "available",
    description: "Internal overlay with deep in-game integration.",
    fullDescription: "INTERNAL-PANEL provides deep in-game integration with an internal overlay that renders directly into the game's rendering pipeline. Low overhead, zero input lag, and seamless visual integration.",
    image: "/images/products/internal-panel.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },

  // ---- UTILITY ----
  {
    id: "p20", slug: "id-store", name: "ID-STORE", category: "utility",
    price: 600, status: "available",
    description: "Organised credential manager for fast access.",
    fullDescription: "ID-STORE is an organised credential manager that lets you store and quickly switch between multiple accounts. Includes search, categories, and encrypted storage. Perfect for managing multiple gaming accounts.",
    image: "/images/products/id-store.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p21", slug: "emote-panel", name: "EMOTE-PANEL", category: "utility",
    price: 500, status: "available",
    description: "Emote panel with large customisable library.",
    fullDescription: "EMOTE-PANEL gives you access to a large library of emotes with a customizable panel. Quick-trigger shortcuts, favorites, and custom emote uploads. Works across multiple games.",
    image: "/images/products/emote-panel.png",
    links: {},
    featured: false, bestSeller: false, specialOffer: true,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p22", slug: "fps-boost", name: "FPS-BOOST", category: "utility",
    price: 400, status: "available",
    description: "FPS boost utility — smooths framerate, reduces stutter.",
    fullDescription: "FPS-BOOST optimizes your system for maximum framerate and reduced stutter. Automatically adjusts graphics settings, clears background processes, and applies performance tweaks. One-click optimization.",
    image: "/images/products/fps-boost.svg",
    links: {},
    featured: false, bestSeller: true, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p23", slug: "selling-stuff", name: "SELLING-STUFF", category: "utility",
    price: 1000, status: "available",
    description: "Complete selling package with templates.",
    fullDescription: "SELLING-STUFF is a complete selling package that includes ready-to-use resources, templates, and tools for bulk sellers. Streamlines your selling workflow with automation and organization features.",
    image: "/images/products/selling-stuff.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
  {
    id: "p24", slug: "nitro-seller", name: "NITRO-SELLER", category: "utility",
    price: 800, status: "available",
    description: "Nitro selling toolkit for bulk sellers.",
    fullDescription: "NITRO-SELLER is a streamlined toolkit for bulk sellers. Includes batch processing, automated listing, inventory management, and sales tracking. Designed for high-volume operations.",
    image: "/images/products/nitro-seller.svg",
    links: {},
    featured: false, bestSeller: false, specialOffer: false,
    createdAt: now, updatedAt: now,
  },
];

// ---- Helper functions ----
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
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

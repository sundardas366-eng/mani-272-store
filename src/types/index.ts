// ============================================================
// MANI 272 STORE — TypeScript Types (Updated)
// ============================================================

export type ProductCategory =
  | "silent-aim"
  | "aim"
  | "bypass"
  | "panel"
  | "utility";

export type ProductStatus = "available" | "unavailable";

export interface ProductLinks {
  youtube?: string;
  discord?: string;
  demo?: string;
  documentation?: string;
  custom?: string;
  mega?: string;
  mediafire?: string;
  googleDrive?: string;
  download?: string;
}

// ---- Duration-based pricing ----
export type PricingDuration = "1day" | "3days" | "7days" | "30days" | "lifetime";

export interface DurationPrice {
  id: PricingDuration;
  label: string;
  usd: number;
  inr: number;
  badge?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  fullDescription: string;
  status: ProductStatus;
  image: string;
  gallery?: string[];
  links: ProductLinks;
  featured: boolean;
  bestSeller: boolean;
  specialOffer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
}

// ---- Cart with duration support ----
export interface CartItem {
  product: Product;
  quantity: number;
  duration: PricingDuration;
  durationLabel: string;
  priceUSD: number;
  priceINR: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: {
    productId: string;
    productName: string;
    duration: string;
    durationLabel: string;
    priceUSD: number;
    priceINR: number;
    quantity: number;
  }[];
  total: number;
  status: "pending" | "paid" | "processing" | "completed" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

// ---- Team Members ----
export interface TeamMember {
  name: string;
  position: string;
  description: string;
  photoUrl: string;
  discordUserId: string;
  discordUrl: string;
}

export interface SiteSettings {
  logoUrl: string;
  siteName: string;
  bannerText: string;
  announcementText: string;
  primaryColor: string;
  discordInviteUrl: string;
  discordServerName: string;
  discordServerDescription: string;
  discordLogoUrl: string;
  // YouTube
  youtubeChannelUrl: string;
  youtubeChannelName: string;
  youtubeChannelDescription: string;
  youtubeChannelLogo: string;
  youtubeVideoUrl: string;
  youtubeEnabled: boolean;
  // Team
  owner: TeamMember;
  coFounder: TeamMember;
  // Pricing
  pricing: DurationPrice[];
  // Purchase section image
  purchaseSectionImage: string;
}

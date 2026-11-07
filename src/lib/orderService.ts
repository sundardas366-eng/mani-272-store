import fs from "fs";
import path from "path";
import { connectToDatabase } from "./db";
import { Order, IOrder } from "@/models/Order";
import { PRODUCTS } from "@/data/products";

// Fallback in-memory / local file storage for development when MONGODB_URI is not set
const LOCAL_DATA_FILE = path.join(process.cwd(), ".data", "orders.json");

interface LocalOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  contact: string;
  discordId?: string;
  items: Array<{
    productId: string;
    productName: string;
    duration?: string;
    durationLabel?: string;
    priceUSD?: number;
    priceINR: number;
    quantity: number;
  }>;
  baseAmount: number;
  payAmount: number;
  status: "pending" | "paid" | "expired" | "cancelled";
  paymentMethod: string;
  utr?: string;
  licenseKey?: string;
  downloadUrl?: string;
  paidAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

function readLocalOrders(): LocalOrder[] {
  try {
    if (!fs.existsSync(LOCAL_DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(LOCAL_DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLocalOrders(orders: LocalOrder[]) {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("Failed to write local orders:", err);
  }
}

/**
 * Generates a unique payAmount in PAISE (e.g. ₹499 -> 49937 paise = ₹499.37)
 * Ensures no other currently active pending order shares the exact same payAmount.
 */
export async function generateUniquePayAmount(baseAmountINR: number): Promise<number> {
  const basePaise = Math.round(baseAmountINR * 100);
  const now = new Date();

  const conn = await connectToDatabase();
  let activePaiseSet = new Set<number>();

  if (conn) {
    const activeOrders = await Order.find({
      status: "pending",
      expiresAt: { $gt: now },
    }).select("payAmount");
    activePaiseSet = new Set(activeOrders.map((o) => o.payAmount));
  } else {
    const localOrders = readLocalOrders();
    activePaiseSet = new Set(
      localOrders
        .filter((o) => o.status === "pending" && new Date(o.expiresAt) > now)
        .map((o) => o.payAmount)
    );
  }

  // Shuffle 1..99 offsets to find an unused paise amount
  const candidateOffsets = Array.from({ length: 99 }, (_, i) => i + 1).sort(
    () => Math.random() - 0.5
  );

  for (const offset of candidateOffsets) {
    const candidate = basePaise + offset;
    if (!activePaiseSet.has(candidate)) {
      return candidate;
    }
  }

  // If all 99 offsets are somehow in use for this exact amount, expand offset to 100..199
  for (let offset = 100; offset <= 250; offset++) {
    const candidate = basePaise + offset;
    if (!activePaiseSet.has(candidate)) {
      return candidate;
    }
  }

  return basePaise + Math.floor(Math.random() * 99) + 1;
}

export interface CreateOrderInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  contact: string;
  discordId?: string;
  items: Array<{
    productId: string;
    productName: string;
    duration?: string;
    durationLabel?: string;
    priceUSD?: number;
    priceINR: number;
    quantity: number;
  }>;
  baseAmount: number;
  paymentMethod?: string;
}

/**
 * Creates a new pending order with a unique payAmount (paise) and 15-min expiry.
 */
export async function createOrder(input: CreateOrderInput) {
  const payAmountPaise = await generateUniquePayAmount(input.baseAmount);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
  const createdAt = new Date();

  // Determine initial product download URL from product catalog
  const firstItem = input.items[0];
  const prod = PRODUCTS.find((p) => p.id === firstItem?.productId);
  const downloadUrl =
    prod?.links?.mega ||
    prod?.links?.mediafire ||
    prod?.links?.googleDrive ||
    "https://discord.gg/4DMtsmZX6k";

  const conn = await connectToDatabase();

  if (conn) {
    const newOrder = await Order.create({
      orderId: input.orderId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      contact: input.contact,
      discordId: input.discordId,
      items: input.items,
      baseAmount: input.baseAmount,
      payAmount: payAmountPaise,
      status: "pending",
      paymentMethod: input.paymentMethod || "fampay_upi",
      downloadUrl,
      expiresAt,
      createdAt,
      updatedAt: createdAt,
    });
    return newOrder.toObject();
  } else {
    // Local fallback
    const localOrder: LocalOrder = {
      orderId: input.orderId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      contact: input.contact,
      discordId: input.discordId,
      items: input.items,
      baseAmount: input.baseAmount,
      payAmount: payAmountPaise,
      status: "pending",
      paymentMethod: input.paymentMethod || "fampay_upi",
      downloadUrl,
      expiresAt: expiresAt.toISOString(),
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    };
    const orders = readLocalOrders();
    orders.unshift(localOrder);
    writeLocalOrders(orders);
    return localOrder;
  }
}

/**
 * Fetches an order by its orderId
 */
export async function getOrder(orderId: string) {
  const conn = await connectToDatabase();
  if (conn) {
    const order = await Order.findOne({ orderId }).lean();
    return order;
  } else {
    const orders = readLocalOrders();
    return orders.find((o) => o.orderId === orderId) || null;
  }
}

/**
 * Fetches all orders (for admin or user dashboard)
 */
export async function getAllOrders() {
  const conn = await connectToDatabase();
  if (conn) {
    return await Order.find().sort({ createdAt: -1 }).lean();
  } else {
    return readLocalOrders();
  }
}


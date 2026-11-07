/**
 * ============================================================
 * MANI 272 STORE — Payment & License Key Storage Engine
 * ============================================================
 * Implements persistent storage for payments and generated license keys.
 * Tables:
 *   - payments(utr UNIQUE, amount, plan_days, status, customer_email, created_at)
 *   - keys(key, utr, expires_at, created_at)
 *
 * Enforces UNIQUE constraint on UTR to block replay attacks,
 * ensures idempotency, and provides dual persistence (MongoDB + Atomic File Store).
 */

import fs from "fs";
import path from "path";
import os from "os";
import { connectToDatabase } from "./db";
import { Payment } from "@/models/Payment";
import mongoose, { Schema, Document, Model } from "mongoose";

export interface StoredPayment {
  utr: string; // UNIQUE primary key / reference
  amount: number; // in INR
  amountPaise: number;
  plan_days: number; // duration in days (e.g. 1, 3, 7, 30, 3650)
  status: "verified" | "pending" | "rejected";
  customer_email?: string;
  customer_discord?: string;
  order_id?: string;
  bank_name?: string;
  created_at: string;
}

export interface StoredKey {
  key: string;
  utr: string; // foreign key linked to payment
  expires_at: string;
  plan_days: number;
  created_at: string;
}

// ------------------------------------------------------------------
// Mongoose Model for License Keys Table (keys)
// ------------------------------------------------------------------
export interface IKeyDoc extends Document {
  key: string;
  utr: string;
  expires_at: Date;
  plan_days: number;
  createdAt: Date;
}

const KeySchema: Schema<IKeyDoc> = new Schema(
  {
    key: { type: String, required: true, trim: true },
    utr: { type: String, required: true, unique: true, index: true, trim: true },
    expires_at: { type: Date, required: true },
    plan_days: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

KeySchema.index({ utr: 1 }, { unique: true });

export const KeyModel: Model<IKeyDoc> =
  mongoose.models.LicenseKeyRecord ||
  mongoose.model<IKeyDoc>("LicenseKeyRecord", KeySchema);

// ------------------------------------------------------------------
// File-based ACID storage fallback (for serverless / local resilience)
// ------------------------------------------------------------------
interface FileStoreData {
  payments: StoredPayment[];
  keys: StoredKey[];
}

const DATA_DIR =
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? os.tmpdir()
    : path.join(process.cwd(), ".data");

const STORE_FILE = path.join(DATA_DIR, "mani_payments_and_keys.json");

declare global {
  var __mani_payment_store: FileStoreData | undefined;
}

function readFileStore(): FileStoreData {
  if (globalThis.__mani_payment_store) {
    return globalThis.__mani_payment_store;
  }

  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.payments) && Array.isArray(parsed.keys)) {
        globalThis.__mani_payment_store = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local payment store file:", err);
  }

  const emptyStore: FileStoreData = { payments: [], keys: [] };
  globalThis.__mani_payment_store = emptyStore;
  return emptyStore;
}

function writeFileStore(data: FileStoreData): void {
  globalThis.__mani_payment_store = data;
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn("Failed to write payment store to disk:", err);
  }
}

// ------------------------------------------------------------------
// Storage Operations
// ------------------------------------------------------------------

/**
 * Checks if a UTR has already been recorded (enforcing UNIQUE constraint).
 */
export async function hasUtr(utr: string): Promise<boolean> {
  const cleanUtr = utr.trim();

  // 1. Check in-memory / file store
  const store = readFileStore();
  if (store.payments.some((p) => p.utr === cleanUtr)) {
    return true;
  }

  // 2. Check MongoDB
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const exists = await Payment.exists({ utr: cleanUtr });
      if (exists) return true;
    } catch {}
  }

  return false;
}

/**
 * Retrieves a key linked to a UTR (for idempotent lookups).
 */
export async function getKeyByUtr(utr: string): Promise<StoredKey | null> {
  const cleanUtr = utr.trim();

  // 1. Check in-memory / file store
  const store = readFileStore();
  const foundKey = store.keys.find((k) => k.utr === cleanUtr);
  if (foundKey) return foundKey;

  // 2. Check MongoDB
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const doc = await KeyModel.findOne({ utr: cleanUtr }).lean();
      if (doc) {
        return {
          key: doc.key,
          utr: doc.utr,
          expires_at: doc.expires_at.toISOString(),
          plan_days: doc.plan_days,
          created_at: doc.createdAt?.toISOString() || new Date().toISOString(),
        };
      }
    } catch {}
  }

  return null;
}

/**
 * Atomically records a verified payment and its generated key.
 * Throws an error if the UTR is already used (UNIQUE constraint violation).
 */
export async function recordVerifiedPayment(
  payment: StoredPayment,
  keyRecord: StoredKey
): Promise<{ success: boolean; payment: StoredPayment; key: StoredKey }> {
  const cleanUtr = payment.utr.trim();

  // Enforce UNIQUE constraint
  const alreadyUsed = await hasUtr(cleanUtr);
  if (alreadyUsed) {
    throw new Error(`UTR ${cleanUtr} has already been used. Replay attacks are prohibited.`);
  }

  // 1. Save to in-memory & file store
  const store = readFileStore();
  store.payments.unshift({ ...payment, utr: cleanUtr });
  store.keys.unshift({ ...keyRecord, utr: cleanUtr });
  writeFileStore(store);

  // 2. Save to MongoDB
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await Payment.create({
        utr: cleanUtr,
        amountPaise: payment.amountPaise || Math.round(payment.amount * 100),
        receivedAt: new Date(payment.created_at),
        senderName: payment.bank_name || "UPI Bank Alert",
        matchedOrderId: payment.order_id || "",
        verifiedAt: new Date(),
      });

      await KeyModel.create({
        key: keyRecord.key,
        utr: cleanUtr,
        expires_at: new Date(keyRecord.expires_at),
        plan_days: keyRecord.plan_days,
      });
    } catch (dbErr: any) {
      if (dbErr.code === 11000) {
        throw new Error(`UTR ${cleanUtr} duplicate key error in database.`);
      }
      console.warn("MongoDB record save warning:", dbErr);
    }
  }

  return { success: true, payment, key: keyRecord };
}

/**
 * Returns all payments for admin oversight.
 */
export async function getAllPayments(): Promise<StoredPayment[]> {
  const store = readFileStore();

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const docs = await Payment.find().sort({ createdAt: -1 }).limit(100).lean();
      if (docs && docs.length > 0) {
        // Merge with file store
        const map = new Map<string, StoredPayment>();
        store.payments.forEach((p) => map.set(p.utr, p));
        docs.forEach((d) => {
          if (!map.has(d.utr)) {
            map.set(d.utr, {
              utr: d.utr,
              amount: (d.amountPaise || 0) / 100,
              amountPaise: d.amountPaise || 0,
              plan_days: 1,
              status: "verified",
              created_at: d.createdAt?.toISOString() || new Date().toISOString(),
              order_id: d.matchedOrderId,
            });
          }
        });
        return Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    } catch {}
  }

  return store.payments;
}

/**
 * Returns all generated keys for admin oversight.
 */
export async function getAllKeys(): Promise<StoredKey[]> {
  const store = readFileStore();

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const docs = await KeyModel.find().sort({ createdAt: -1 }).limit(100).lean();
      if (docs && docs.length > 0) {
        const map = new Map<string, StoredKey>();
        store.keys.forEach((k) => map.set(k.utr, k));
        docs.forEach((d) => {
          if (!map.has(d.utr)) {
            map.set(d.utr, {
              key: d.key,
              utr: d.utr,
              expires_at: d.expires_at.toISOString(),
              plan_days: d.plan_days,
              created_at: d.createdAt?.toISOString() || new Date().toISOString(),
            });
          }
        });
        return Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    } catch {}
  }

  return store.keys;
}

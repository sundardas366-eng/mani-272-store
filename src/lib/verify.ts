import fs from "fs";
import path from "path";
import { connectToDatabase } from "./db";
import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";
import { readFamPayEmails, ParsedPayment } from "./checkPayments";
import { deliverProduct } from "./deliverProduct";

const LOCAL_PAYMENTS_FILE = path.join(process.cwd(), ".data", "payments.json");
const LOCAL_ORDERS_FILE = path.join(process.cwd(), ".data", "orders.json");

interface LocalPaymentRecord {
  utr: string;
  amountPaise: number;
  receivedAt: string;
  matchedOrderId?: string;
  verifiedAt: string;
}

function readLocalPayments(): LocalPaymentRecord[] {
  try {
    if (!fs.existsSync(LOCAL_PAYMENTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_PAYMENTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLocalPayments(records: LocalPaymentRecord[]) {
  try {
    const dir = path.dirname(LOCAL_PAYMENTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_PAYMENTS_FILE, JSON.stringify(records, null, 2));
  } catch (err) {
    console.error("Failed to write local payments:", err);
  }
}

export interface VerificationResult {
  checkedCount: number;
  matchedCount: number;
  expiredCount: number;
  matchedOrders: Array<{
    orderId: string;
    utr: string;
    amountPaise: number;
    licenseKey: string;
  }>;
}

/**
 * Runs payment verification by reading FamPay confirmation emails from Gmail,
 * recording UTRs uniquely to prevent replay attacks, and marking matching pending
 * orders as 'paid' while delivering digital license keys and webhook alerts.
 */
export async function verifyPayments(lookbackMinutes = 60): Promise<VerificationResult> {
  const result: VerificationResult = {
    checkedCount: 0,
    matchedCount: 0,
    expiredCount: 0,
    matchedOrders: [],
  };

  const payments = await readFamPayEmails(lookbackMinutes);
  result.checkedCount = payments.length;

  const conn = await connectToDatabase();
  const now = new Date();

  if (conn) {
    // 1. Process each incoming FamPay payment from Gmail
    for (const p of payments) {
      try {
        // Prevent UTR replay attacks using MongoDB unique constraint
        await Payment.create({
          utr: p.utr,
          amountPaise: p.amountPaise,
          receivedAt: p.receivedAt,
          senderName: p.senderName,
          rawEmailSnippet: p.rawSnippet,
          verifiedAt: now,
        });
      } catch (err: unknown) {
        // Code 11000 = Duplicate key error (UTR already recorded/used)
        if (typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 11000) {
          continue; // Skip already processed payment
        }
        console.error(`[Verify] Payment insert error for UTR ${p.utr}:`, err);
        continue;
      }

      // 2. Find matching pending order with exact payAmount
      // Allows payment window within order validity
      const matchedOrder = await Order.findOneAndUpdate(
        {
          status: "pending",
          payAmount: p.amountPaise,
          expiresAt: { $gte: new Date(p.receivedAt.getTime() - 10 * 60 * 1000) },
        },
        {
          $set: {
            status: "paid",
            utr: p.utr,
            paidAt: p.receivedAt,
            updatedAt: now,
          },
        },
        { new: true }
      );

      if (matchedOrder) {
        // 3. Deliver product (generate license key & send Discord webhook)
        const delivery = await deliverProduct({
          orderId: matchedOrder.orderId,
          customerName: matchedOrder.customerName,
          customerEmail: matchedOrder.customerEmail,
          contact: matchedOrder.contact,
          discordId: matchedOrder.discordId,
          payAmount: matchedOrder.payAmount,
          baseAmount: matchedOrder.baseAmount,
          utr: p.utr,
          items: matchedOrder.items,
          downloadUrl: matchedOrder.downloadUrl,
        });

        matchedOrder.licenseKey = delivery.licenseKey;
        matchedOrder.downloadUrl = delivery.downloadUrl;
        await matchedOrder.save();

        // Link payment record to orderId
        await Payment.updateOne({ utr: p.utr }, { matchedOrderId: matchedOrder.orderId });

        result.matchedCount++;
        result.matchedOrders.push({
          orderId: matchedOrder.orderId,
          utr: p.utr,
          amountPaise: p.amountPaise,
          licenseKey: delivery.licenseKey,
        });
      }
    }

    // 4. Auto-expire old pending orders
    const expireRes = await Order.updateMany(
      { status: "pending", expiresAt: { $lt: now } },
      { $set: { status: "expired", updatedAt: now } }
    );
    result.expiredCount = expireRes.modifiedCount || 0;
  } else {
    // Local JSON fallback mode
    const localPayments = readLocalPayments();
    const existingUtrs = new Set(localPayments.map((lp) => lp.utr));

    let localOrders: Array<any> = [];
    try {
      if (fs.existsSync(LOCAL_ORDERS_FILE)) {
        localOrders = JSON.parse(fs.readFileSync(LOCAL_ORDERS_FILE, "utf-8"));
      }
    } catch {
      localOrders = [];
    }

    for (const p of payments) {
      if (existingUtrs.has(p.utr)) continue;

      existingUtrs.add(p.utr);
      const newPayRecord: LocalPaymentRecord = {
        utr: p.utr,
        amountPaise: p.amountPaise,
        receivedAt: p.receivedAt.toISOString(),
        verifiedAt: now.toISOString(),
      };

      // Match local pending order
      const orderIdx = localOrders.findIndex(
        (o) => o.status === "pending" && o.payAmount === p.amountPaise
      );

      if (orderIdx !== -1) {
        const order = localOrders[orderIdx];
        order.status = "paid";
        order.utr = p.utr;
        order.paidAt = p.receivedAt.toISOString();
        order.updatedAt = now.toISOString();

        const delivery = await deliverProduct({
          orderId: order.orderId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          contact: order.contact,
          discordId: order.discordId,
          payAmount: order.payAmount,
          baseAmount: order.baseAmount,
          utr: p.utr,
          items: order.items,
          downloadUrl: order.downloadUrl,
        });

        order.licenseKey = delivery.licenseKey;
        order.downloadUrl = delivery.downloadUrl;
        newPayRecord.matchedOrderId = order.orderId;

        result.matchedCount++;
        result.matchedOrders.push({
          orderId: order.orderId,
          utr: p.utr,
          amountPaise: p.amountPaise,
          licenseKey: delivery.licenseKey,
        });
      }

      localPayments.push(newPayRecord);
    }

    // Auto expire local orders
    for (const o of localOrders) {
      if (o.status === "pending" && new Date(o.expiresAt) < now) {
        o.status = "expired";
        o.updatedAt = now.toISOString();
        result.expiredCount++;
      }
    }

    writeLocalPayments(localPayments);
    try {
      fs.writeFileSync(LOCAL_ORDERS_FILE, JSON.stringify(localOrders, null, 2));
    } catch (err) {
      console.error("Failed to update local orders:", err);
    }
  }

  return result;
}


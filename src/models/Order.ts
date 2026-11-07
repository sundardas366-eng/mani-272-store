import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  productName: string;
  duration?: string;
  durationLabel?: string;
  priceUSD?: number;
  priceINR: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail: string;
  contact: string;
  discordId?: string;
  items: IOrderItem[];
  baseAmount: number; // Base amount in INR
  payAmount: number; // Exact amount to pay in PAISE (e.g. 49937 paise = ₹499.37)
  status: "pending" | "paid" | "expired" | "cancelled";
  paymentMethod: string;
  utr?: string;
  licenseKey?: string;
  downloadUrl?: string;
  paidAt?: Date;
  expiresAt: Date; // 15 minutes after creation
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    duration: { type: String },
    durationLabel: { type: String },
    priceUSD: { type: Number },
    priceINR: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    discordId: {
      type: String,
      trim: true,
    },
    items: [OrderItemSchema],
    baseAmount: {
      type: Number,
      required: true,
    },
    payAmount: {
      type: Number,
      required: true,
      index: true, // Used for atomic exact paise match
    },
    status: {
      type: String,
      enum: ["pending", "paid", "expired", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      default: "fampay_upi",
    },
    utr: {
      type: String,
      sparse: true,
      index: true,
      trim: true,
    },
    licenseKey: {
      type: String,
      trim: true,
    },
    downloadUrl: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast verification match
OrderSchema.index({ status: 1, payAmount: 1, createdAt: 1, expiresAt: 1 });

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

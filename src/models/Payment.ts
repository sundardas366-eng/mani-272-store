import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  utr: string;
  amountPaise: number;
  receivedAt: Date;
  senderName?: string;
  rawSender?: string;
  rawEmailSnippet?: string;
  matchedOrderId?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    utr: {
      type: String,
      required: true,
      unique: true, // Prevents UTR replay attack (MongoDB duplicate key error code 11000)
      index: true,
      trim: true,
    },
    amountPaise: {
      type: Number,
      required: true,
      index: true,
    },
    receivedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    senderName: {
      type: String,
      default: "",
    },
    rawSender: {
      type: String,
      default: "no-reply@famapp.in",
    },
    rawEmailSnippet: {
      type: String,
      default: "",
    },
    matchedOrderId: {
      type: String,
      default: "",
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique index
PaymentSchema.index({ utr: 1 }, { unique: true });

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

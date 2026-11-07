"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  Home,
  ShieldCheck,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  contact?: string;
  discordId?: string;
  items: Array<{
    productId: string;
    productName: string;
    duration?: string;
    durationLabel?: string;
    priceINR?: number;
    quantity: number;
  }>;
  baseAmount: number;
  payAmount: number; // in paise
  payAmountRupees: string; // e.g. "499.37"
  status: "pending" | "paid" | "expired" | "cancelled";
  paymentMethod: string;
  fampayUpiId?: string;
  utr?: string;
  licenseKey?: string;
  downloadUrl?: string;
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch order data
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
          if (data.order.status === "paid") {
            setShowCelebration(true);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Generate UPI QR Code once order is loaded
  useEffect(() => {
    if (!order) return;

    const upiId = order.fampayUpiId || "mani272@fam";
    const amount = order.payAmountRupees || (order.payAmount / 100).toFixed(2);
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=MANI%20272%20STORE&am=${encodeURIComponent(
      amount
    )}&cu=INR&tn=Order%20${encodeURIComponent(order.orderId)}`;

    QRCode.toDataURL(upiUri, {
      width: 260,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Generation error:", err));
  }, [order]);

  // Expiration countdown
  useEffect(() => {
    if (!order || order.status !== "pending") return;

    const interval = setInterval(() => {
      const expiry = new Date(order.expiresAt).getTime();
      const now = Date.now();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        setIsExpired(true);
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  // Auto-polling for verification every 5 seconds if pending
  useEffect(() => {
    if (!order || order.status !== "pending" || isExpired) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/verify/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.orderId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order && data.order.status === "paid") {
            setOrder(data.order);
            setShowCelebration(true);
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error("Auto poll error:", err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [order, isExpired]);

  // Manual "I Have Paid" trigger
  const handleManualVerify = async () => {
    if (!order) return;
    setVerifying(true);
    try {
      const res = await fetch("/api/verify/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        if (data.order.status === "paid") {
          setShowCelebration(true);
        }
      }
    } catch (err) {
      console.error("Manual verify failed:", err);
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = (text: string, type: "amount" | "upi" | "key") => {
    navigator.clipboard.writeText(text);
    if (type === "amount") {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else if (type === "upi") {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto">
        <div className="loader-ring mx-auto mb-4" />
        <p className="text-white/60 font-medium">Fetching order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-white/40 text-sm mb-6">
          Could not find an order matching ID <code className="text-mani-red font-mono">{orderId}</code>.
        </p>
        <Link href="/products" className="btn-glow inline-flex items-center gap-2">
          Browse Products
        </Link>
      </div>
    );
  }

  const fampayUpi = order.fampayUpiId || "mani272@fam";
  const exactAmount = order.payAmountRupees || (order.payAmount / 100).toFixed(2);
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(fampayUpi)}&pn=MANI%20272%20STORE&am=${encodeURIComponent(
    exactAmount
  )}&cu=INR&tn=Order%20${encodeURIComponent(order.orderId)}`;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* ============================================================== */}
      {/* CASE 1: ORDER IS PAID (INSTANT DELIVERY) */}
      {/* ============================================================== */}
      {order.status === "paid" && (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border-emerald-500/40 relative overflow-hidden">
          {/* Subtle green ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Payment Verified! ⚡
          </h1>
          <p className="text-emerald-400 font-semibold text-sm mb-6">
            FamPay UPI payment of ₹{exactAmount} automatically confirmed via UTR {order.utr || "Verified"}
          </p>

          {/* License Key Box */}
          <div className="glass-card rounded-2xl p-6 mb-6 text-left border-mani-red/50 bg-black/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-mani-red flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Your Digital License Key
              </span>
              <button
                onClick={() => copyToClipboard(order.licenseKey || "", "key")}
                className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded transition"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Key
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest bg-black/60 p-4 rounded-xl border border-white/10 select-all break-all text-center">
              {order.licenseKey || "MANI-PAID-KEY-VERIFIED"}
            </div>
          </div>

          {/* Download & Discord Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <a
              href={order.downloadUrl || "https://discord.gg/4DMtsmZX6k"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center justify-center gap-2 py-3.5 text-base font-bold"
            >
              <Download className="w-5 h-5" /> Download Software / Files
            </a>
            <a
              href="https://discord.gg/4DMtsmZX6k"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center justify-center gap-2 py-3.5 text-base font-bold"
            >
              <ExternalLink className="w-5 h-5" /> Join Discord Server
            </a>
          </div>

          {/* Order Details Breakdown */}
          <div className="border-t border-white/10 pt-6 text-left space-y-2 text-xs sm:text-sm text-white/60">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-mono text-white font-bold">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer</span>
              <span className="text-white font-medium">{order.customerName} ({order.customerEmail})</span>
            </div>
            {order.utr && (
              <div className="flex justify-between">
                <span>Bank Reference / UTR</span>
                <span className="font-mono text-emerald-400 font-bold">{order.utr}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Status</span>
              <span className="text-emerald-400 font-bold">Instant Auto-Delivery Complete</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CASE 2: ORDER IS EXPIRED */}
      {/* ============================================================== */}
      {order.status === "expired" || isExpired ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border-red-500/30">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Expired</h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            The 15-minute payment window for this specific paise amount has expired. 
            Please create a new order to receive a fresh unique amount.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="btn-glow inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Create New Order
            </Link>
            <Link href="/" className="btn-ghost inline-flex items-center gap-2">
              <Home className="w-4 h-4" /> Return Home
            </Link>
          </div>
        </div>
      ) : null}

      {/* ============================================================== */}
      {/* CASE 3: ORDER IS PENDING (AWAITING FAMPAY UPI TRANSFER) */}
      {/* ============================================================== */}
      {order.status === "pending" && !isExpired && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border-white/10 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Clock className="w-3.5 h-3.5 animate-spin" /> Awaiting UPI Payment Confirmation
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Complete Your Payment
            </h1>
            <p className="text-white/50 text-xs sm:text-sm mt-1">
              Transfer the <strong className="text-white">exact paise amount</strong> below. 
              Our system checks incoming FamPay notifications and auto-delivers your key!
            </p>
          </div>

          {/* CRITICAL ATTENTION: EXACT AMOUNT CALLOUT */}
          <div className="rounded-2xl p-5 mb-8 bg-gradient-to-r from-mani-red/20 via-black to-mani-red/20 border-2 border-mani-red shadow-lg shadow-mani-red/20 text-center relative">
            <div className="text-xs font-black uppercase tracking-widest text-mani-red mb-1">
              ⚠️ PAY THIS EXACT AMOUNT (DO NOT ROUND OFF)
            </div>
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ₹{exactAmount}
              </span>
              <button
                onClick={() => copyToClipboard(exactAmount, "amount")}
                className="p-2 rounded-lg bg-mani-red/30 hover:bg-mani-red/50 text-white transition flex items-center gap-1.5 text-xs font-bold"
                title="Copy Exact Amount"
              >
                {copiedAmount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedAmount ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-white/70 text-xs max-w-lg mx-auto">
              The extra <strong className="text-mani-red font-bold">.{exactAmount.split(".")[1] || "00"} paise</strong> uniquely identifies your transaction among other buyers.
            </p>
          </div>

          {/* QR Code and Payment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            {/* QR Code Column */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10 text-center">
              <div className="p-3 bg-white rounded-2xl shadow-2xl mb-4 border-2 border-mani-red/40">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt="FamPay UPI QR Code"
                    width={220}
                    height={220}
                    className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] block rounded-lg"
                  />
                ) : (
                  <div className="w-[220px] h-[220px] flex items-center justify-center">
                    <div className="loader-ring" />
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-white mb-2">
                Scan with any UPI App
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-[11px] text-white/50 font-medium">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">FamPay</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Google Pay</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">PhonePe</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Paytm</span>
              </div>

              {/* Mobile Deep Link */}
              <a
                href={upiDeepLink}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2 md:hidden"
              >
                <Zap className="w-3.5 h-3.5 text-mani-red" /> Pay via Installed UPI App
              </a>
            </div>

            {/* UPI ID & Timer Column */}
            <div className="space-y-4">
              {/* UPI ID */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1">
                  FamPay UPI ID
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base sm:text-lg font-bold text-white select-all">
                    {fampayUpi}
                  </span>
                  <button
                    onClick={() => copyToClipboard(fampayUpi, "upi")}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUpi ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-1">
                  Time Remaining
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-mani-red" />
                  <span className="font-mono text-2xl font-black text-mani-red">
                    {timeLeft || "15:00"}
                  </span>
                  <span className="text-xs text-white/40">minutes</span>
                </div>
              </div>

              {/* Order Info */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Order ID:</span>
                  <span className="font-mono text-white font-bold">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Customer:</span>
                  <span className="text-white font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Email:</span>
                  <span className="text-white font-medium">{order.customerEmail}</span>
                </div>
              </div>

              {/* Manual "I Have Paid" Action */}
              <button
                onClick={handleManualVerify}
                disabled={verifying}
                className="btn-glow w-full py-3.5 font-bold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying with Gmail...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> I Have Paid ₹{exactAmount}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-white/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Auto-checking payment status in background every 5s...</span>
              </div>
            </div>
          </div>

          {/* Step by Step Instructions */}
          <div className="rounded-2xl p-5 bg-black/20 border border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-mani-red" /> How Verification Works:
            </h3>
            <ol className="text-xs text-white/60 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Open your favorite UPI app (FamPay, GPay, PhonePe, Paytm).</li>
              <li>Scan the QR code or send to <strong className="text-white">{fampayUpi}</strong>.</li>
              <li>Enter the EXACT amount of <strong className="text-mani-red">₹{exactAmount}</strong>.</li>
              <li>Once payment succeeds, FamPay notifies our server via email.</li>
              <li>Your order status will automatically turn green and reveal your license key!</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-12 pb-24 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="glass-card rounded-3xl p-12 text-center text-white/50 max-w-md mx-auto">
              <div className="loader-ring mx-auto mb-4" />
              Loading order details...
            </div>
          }
        >
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

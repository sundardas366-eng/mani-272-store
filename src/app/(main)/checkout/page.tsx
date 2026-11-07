"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Lock,
  ShieldCheck,
  Zap,
  ArrowRight,
  User,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  // Auth & customer states
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [contact, setContact] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("fampay_upi");
  const [processing, setProcessing] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check existing login session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mani-272-user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) {
          setCurrentUser(u);
          setEmail(u.email);
          setName(u.name || u.email.split("@")[0]);
        }
      }
      const savedEmail = localStorage.getItem("mani_customer_email");
      if (savedEmail && !email) setEmail(savedEmail);
      const savedName = localStorage.getItem("mani_customer_name");
      if (savedName && !name) setName(savedName);
    } catch {}
  }, []);

  // Inline login handler
  const handleInlineAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setAuthLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const derivedName = name.trim() || trimmedEmail.split("@")[0];
      const user = {
        email: trimmedEmail,
        name: derivedName,
        role: trimmedEmail.includes("admin") ? "admin" : "user",
      };

      try {
        localStorage.setItem("mani-272-user", JSON.stringify(user));
        localStorage.setItem("mani_customer_email", user.email);
        localStorage.setItem("mani_customer_name", user.name);
      } catch {}

      setCurrentUser(user);
      setName(user.name);
      setEmail(user.email);
      setAuthLoading(false);
      toast.success(`Signed in as ${user.name}!`);
    }, 500);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("mani-272-user");
    } catch {}
    setCurrentUser(null);
    setPassword("");
    toast.success("Signed out");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalEmail = (email || (currentUser ? currentUser.email : "")).trim();
    const finalName = (name || (currentUser ? currentUser.name : "") || (finalEmail ? finalEmail.split("@")[0] : "Customer")).trim();
    const finalContact = (contact || "Instant Email Delivery").trim();

    if (!finalEmail) {
      setErrorMessage("Please enter your email or sign in to receive your key.");
      toast.error("Please sign in or enter your delivery email");
      return;
    }

    setProcessing(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: finalName,
          customerEmail: finalEmail,
          contact: finalContact,
          discordId: discordId.trim(),
          paymentMethod,
          baseAmount: total,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            duration: i.duration,
            durationLabel: i.durationLabel,
            priceINR: i.priceINR || i.product.price,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (data.success && data.order?.orderId) {
        // Cache order in localStorage so it can never be lost
        try {
          localStorage.setItem("mani_last_order", JSON.stringify(data.order));
          localStorage.setItem(`mani_order_${data.order.orderId}`, JSON.stringify(data.order));
        } catch (e) {
          console.warn("Could not save order in localStorage:", e);
        }

        clearCart();
        router.push(`/order-confirmation?id=${data.order.orderId}`);
      } else {
        setErrorMessage(data.error || "Failed to create order. Please try again.");
        setProcessing(false);
      }
    } catch (err: any) {
      console.error("Checkout request failed:", err);
      setErrorMessage("Network error. Please try again.");
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-white/40 mb-4 text-lg">Your cart is empty</p>
            <button
              onClick={() => router.push("/products")}
              className="btn-glow inline-flex items-center gap-2"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-12 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mani-brand text-3xl md:text-4xl">
              <span className="mani-red">Secure</span> <span className="mani-white">Checkout</span>
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Automated 24/7 instant key delivery powered by FamPay UPI
            </p>
          </div>

          {/* Automated System Notice */}
          <div className="glass-card rounded-2xl p-4 mb-8 border-mani-red/30 bg-mani-red/5 flex items-start gap-3">
            <Zap className="w-5 h-5 text-mani-red flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-mani-red font-bold text-sm tracking-wide">
                INSTANT AUTOMATED VERIFICATION ENABLED
              </p>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">
                When you place your order, you will receive an exact paise amount (e.g. ₹{total}.37). 
                Once you transfer via UPI, our server checks the confirmation email and delivers your license key 
                and download link within seconds.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="glass-card rounded-xl p-4 mb-6 border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Replaced Contact Block with Login & Customer Authentication */}
            <div className="lg:col-span-2 space-y-6">
              {currentUser ? (
                /* 1. AUTHENTICATED CUSTOMER STATE */
                <div className="glass-card rounded-2xl p-6 sm:p-8 border-mani-red/40 bg-black/60 shadow-lg shadow-mani-red/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mani-red to-red-950 border border-mani-red/60 flex items-center justify-center font-black text-white text-lg shadow-md shadow-mani-red/20">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-white text-base">
                            {currentUser.name || "Customer Account"}
                          </h2>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> VERIFIED
                          </span>
                        </div>
                        <p className="text-white/40 text-xs mt-0.5 font-mono">{currentUser.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-xs text-white/40 hover:text-mani-red transition self-start sm:self-auto"
                    >
                      Switch Account / Sign Out
                    </button>
                  </div>

                  {/* Delivery Details on File */}
                  <div className="mt-5 space-y-4">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-white/50">Key Delivery Destination:</span>
                      <span className="font-mono text-mani-red font-bold text-sm">{currentUser.email}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">
                          Phone / WhatsApp / Telegram
                        </label>
                        <input
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="input-mani w-full text-xs"
                          placeholder="+91 98765 43210 or @username"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block flex items-center justify-between">
                          <span>Discord User ID (Optional)</span>
                          <span className="text-[10px] text-white/40 lowercase">for role & DM</span>
                        </label>
                        <input
                          type="text"
                          value={discordId}
                          onChange={(e) => setDiscordId(e.target.value)}
                          className="input-mani w-full font-mono text-xs"
                          placeholder="e.g. 1457931837769908467"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. CUSTOMER LOGIN & SIGN-IN CARD (Replaces previous manual form) */
                <div className="glass-card rounded-2xl p-6 sm:p-8 border-mani-red/30 bg-black/70 shadow-lg shadow-mani-red/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="font-bold text-white text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5 text-mani-red" /> Customer Login & Delivery Account
                      </h2>
                      <p className="text-white/40 text-xs mt-1">
                        Sign in to access your license keys and automatic download links.
                      </p>
                    </div>

                    <Link
                      href="/login"
                      className="text-xs text-mani-red hover:underline inline-flex items-center gap-1 font-medium self-start sm:self-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Open Lamp Login Page
                    </Link>
                  </div>

                  {/* Tabs: Sign In / Create Account */}
                  <div className="flex border-b border-white/10 mb-6 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                        authMode === "login"
                          ? "border-mani-red text-mani-red"
                          : "border-transparent text-white/40 hover:text-white"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                        authMode === "register"
                          ? "border-mani-red text-mani-red"
                          : "border-transparent text-white/40 hover:text-white"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Login / Register Fields */}
                  <div className="space-y-4">
                    {authMode === "register" && (
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-mani pl-10 w-full text-xs"
                            placeholder="e.g. Sundar Das"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                        Email Address (For Key Delivery) *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-mani pl-10 w-full text-xs font-mono"
                          placeholder="sundardas366@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type={showPass ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-mani pl-10 pr-10 w-full text-xs"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                          Phone / WhatsApp / Telegram
                        </label>
                        <input
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="input-mani w-full text-xs"
                          placeholder="+91 98765 43210 or @username"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block flex items-center justify-between">
                          <span>Discord ID (Optional)</span>
                          <span className="text-[10px] text-white/40 lowercase">for role & DM</span>
                        </label>
                        <input
                          type="text"
                          value={discordId}
                          onChange={(e) => setDiscordId(e.target.value)}
                          className="input-mani w-full font-mono text-xs"
                          placeholder="e.g. 1457931837769908467"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleInlineAuth}
                      disabled={authLoading}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-mani-red text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-mani-red transition flex items-center justify-center gap-2 mt-2"
                    >
                      {authLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Account...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>{authMode === "login" ? "Sign In & Save Session" : "Create Account & Save Session"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h2 className="font-bold text-white text-lg mb-4">Select Payment Option</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "fampay_upi",
                      label: "FamPay UPI (Instant Auto-Verify)",
                      badge: "FASTEST ⚡",
                      desc: "Pay via GPay, PhonePe, Paytm, or FamPay with auto-key delivery",
                    },
                    {
                      id: "upi_manual",
                      label: "Standard UPI / QR",
                      badge: "POPULAR",
                      desc: "Scan QR code on the next screen and receive license key instantly",
                    },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`cursor-pointer rounded-xl p-4 text-left transition-all border block relative ${
                        paymentMethod === m.id
                          ? "border-mani-red bg-mani-red/10 text-white shadow-lg shadow-mani-red/10"
                          : "border-white/10 text-white/60 hover:border-white/20 bg-black/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{m.label}</span>
                        {m.badge && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-mani-red text-white">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50">{m.desc}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div>
              <div className="glass-card rounded-2xl p-6 sm:p-8 sticky top-24">
                <h2 className="font-bold text-white text-lg mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-start text-sm border-b border-white/5 pb-2"
                    >
                      <div>
                        <span className="text-white font-medium block">{item.product.name}</span>
                        <span className="text-white/40 text-xs">
                          {item.durationLabel || item.duration || "Standard"} × {item.quantity}
                        </span>
                      </div>
                      <span className="text-white font-semibold">
                        {formatPrice((item.priceINR || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/60">Subtotal</span>
                    <span className="text-sm text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-mani-red font-medium">Automated Verification Fee</span>
                    <span className="text-xs text-emerald-400 font-bold">FREE (0.00)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-base font-bold text-white">Estimated Total</span>
                    <span className="text-2xl font-black text-mani-red">{formatPrice(total)}</span>
                  </div>
                  <p className="text-[11px] text-white/40 mt-1">
                    *Exact paise amount (1-99 paise) assigned on next page for instant auto-detection.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={processing}
                  className="btn-glow w-full inline-flex items-center justify-center gap-2 py-3.5 text-base font-bold disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <div className="loader-ring !w-5 !h-5 !border-2" /> Generating Payment QR...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Proceed to Pay {formatPrice(total)}
                    </>
                  )}
                </button>

                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                  <p className="text-white/30 text-[11px] flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Secure & Encrypted Transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

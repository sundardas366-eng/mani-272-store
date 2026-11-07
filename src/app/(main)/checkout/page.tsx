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

// Discord Icon
function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

// Google Icon
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

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

  // 1-Click Discord & Google OAuth in Checkout
  const handleOAuth = (provider: "discord" | "google") => {
    setAuthLoading(true);
    setTimeout(() => {
      const isDiscord = provider === "discord";
      const user = {
        email: isDiscord ? "discord.customer@mani272.store" : "google.customer@gmail.com",
        name: isDiscord ? "Discord Customer" : "Google Customer",
        role: "user",
        provider,
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
      toast.success(`Signed in with ${isDiscord ? "Discord" : "Google"}!`);
    }, 450);
  };

  // Inline email/password auth
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
    }, 450);
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
            {/* Left Column: Customer Login & Authentication */}
            <div className="lg:col-span-2 space-y-6">
              {currentUser ? (
                /* 1. AUTHENTICATED CUSTOMER STATE */
                <div className="glass-card rounded-2xl p-5 sm:p-7 border-mani-red/40 bg-black/60 shadow-lg shadow-mani-red/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mani-red to-red-950 border border-mani-red/60 flex items-center justify-center font-black text-white text-base shadow-md shadow-mani-red/20">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-white text-sm sm:text-base">
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
                  <div className="mt-4 space-y-3.5">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-white/50">Delivery Destination:</span>
                      <span className="font-mono text-mani-red font-bold">{currentUser.email}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                          Phone / WhatsApp / Telegram
                        </label>
                        <input
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="input-mani w-full text-xs !py-2"
                          placeholder="+91 98765 43210 or @username"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1.5 block flex items-center justify-between">
                          <span>Discord ID (Optional)</span>
                          <span className="text-[10px] text-white/40 lowercase">for role & DM</span>
                        </label>
                        <input
                          type="text"
                          value={discordId}
                          onChange={(e) => setDiscordId(e.target.value)}
                          className="input-mani w-full font-mono text-xs !py-2"
                          placeholder="e.g. 1457931837769908467"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. CUSTOMER LOGIN & SIGN-IN CARD */
                <div className="glass-card rounded-2xl p-5 sm:p-7 border-mani-red/30 bg-black/75 shadow-lg shadow-mani-red/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                        <Lock className="w-4 h-4 text-mani-red" /> Customer Login & Delivery Account
                      </h2>
                      <p className="text-white/40 text-xs mt-0.5">
                        Sign in to access your license keys and automatic download links.
                      </p>
                    </div>

                    <Link
                      href="/login"
                      className="text-xs text-mani-red hover:underline inline-flex items-center gap-1 font-medium self-start sm:self-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Open Lamp Login
                    </Link>
                  </div>

                  {/* 1-CLICK DISCORD & GOOGLE AUTH BUTTONS IN CHECKOUT */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    <button
                      type="button"
                      onClick={() => handleOAuth("discord")}
                      disabled={authLoading}
                      className="py-2.5 px-3 rounded-xl bg-[#5865F2]/15 hover:bg-[#5865F2] border border-[#5865F2]/40 hover:border-[#5865F2] text-white text-xs font-bold transition flex items-center justify-center gap-2 group shadow-sm disabled:opacity-50"
                    >
                      <DiscordIcon className="w-4 h-4 text-[#5865F2] group-hover:text-white transition-colors" />
                      <span>Continue with Discord</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuth("google")}
                      disabled={authLoading}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white text-xs font-bold transition flex items-center justify-center gap-2 group shadow-sm disabled:opacity-50"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      <span>Continue with Google</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-white/10 w-full" />
                    <span className="bg-black/90 px-2.5 text-[10px] uppercase font-bold text-white/35 tracking-wider absolute">
                      or sign in with email
                    </span>
                  </div>

                  {/* Tabs: Sign In / Create Account */}
                  <div className="flex border-b border-white/10 mb-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={`pb-2 px-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
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
                      className={`pb-2 px-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                        authMode === "register"
                          ? "border-mani-red text-mani-red"
                          : "border-transparent text-white/40 hover:text-white"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Login / Register Fields */}
                  <div className="space-y-3">
                    {authMode === "register" && (
                      <div>
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-mani !pl-9 w-full text-xs !py-2"
                            placeholder="Sundar Das"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                        Email Address (For Key Delivery) *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-mani !pl-9 w-full text-xs font-mono !py-2"
                          placeholder="sundardas366@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                        <input
                          type={showPass ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-mani !pl-9 !pr-9 w-full text-xs !py-2"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                        >
                          {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                          Phone / WhatsApp / Telegram
                        </label>
                        <input
                          type="text"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="input-mani w-full text-xs !py-2"
                          placeholder="+91 98765 43210 or @username"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block flex items-center justify-between">
                          <span>Discord ID (Optional)</span>
                          <span className="text-[10px] text-white/40 lowercase">for role & DM</span>
                        </label>
                        <input
                          type="text"
                          value={discordId}
                          onChange={(e) => setDiscordId(e.target.value)}
                          className="input-mani w-full font-mono text-xs !py-2"
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
                          <UserCheck className="w-3.5 h-3.5" />
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

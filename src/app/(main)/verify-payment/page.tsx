"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import Confetti from "react-confetti";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
  days: number;
  inr: number;
  badge?: string;
}

const PLANS: Plan[] = [
  { id: "1day", name: "1 Day Access", days: 1, inr: 119 },
  { id: "3days", name: "3 Days Access", days: 3, inr: 349 },
  { id: "7days", name: "7 Days Access", days: 7, inr: 649 },
  { id: "30days", name: "30 Days Access", days: 30, inr: 1599, badge: "POPULAR" },
  { id: "lifetime", name: "Lifetime Access", days: 3650, inr: 3999, badge: "BEST VALUE" },
];

export default function VerifyPaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[0]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [utr, setUtr] = useState("");
  const [email, setEmail] = useState("");
  const [discordOrTelegram, setDiscordOrTelegram] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifiedKey, setVerifiedKey] = useState<string | null>(null);
  const [keyExpiresAt, setKeyExpiresAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const upiId = "das360s@fam";

  // Generate dynamic QR code whenever plan changes
  useEffect(() => {
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=MANI272&am=${selectedPlan.inr}&cu=INR&tn=${encodeURIComponent(selectedPlan.name)}`;

    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUtr = utr.trim();
    if (!cleanUtr) {
      setErrorMessage("Please enter your 12-digit UTR reference number.");
      return;
    }

    if (!/^\d{12}$/.test(cleanUtr)) {
      setErrorMessage("UTR must be exactly 12 numeric digits (e.g. 431289123456).");
      return;
    }

    setVerifying(true);
    setErrorMessage("");
    setRateLimitInfo(null);

    try {
      const res = await fetch("/api/payments/verify-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utr: cleanUtr,
          planDays: selectedPlan.days,
          minAmountINR: selectedPlan.inr,
          customerEmail: email.trim(),
          customerDiscord: discordOrTelegram.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.verified) {
        toast.success("Payment verified! Your license key is ready.");
        setVerifiedKey(data.key);
        setKeyExpiresAt(data.expiresAt);
        setShowCelebration(true);
      } else {
        const msg = data.error || "Payment not found yet, try again in a few minutes.";
        setErrorMessage(msg);
        if (data.remainingAttempts !== undefined) {
          setRateLimitInfo(`Attempts remaining this hour: ${data.remainingAttempts}/5`);
        }
        if (res.status === 429) {
          toast.error("Rate limit reached. Please wait before retrying.");
        } else {
          toast.error(msg);
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage("Failed to connect to verification server. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const copyKey = () => {
    if (!verifiedKey) return;
    navigator.clipboard.writeText(verifiedKey);
    setCopiedKey(true);
    toast.success("License key copied!");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-8 pb-16 px-4">
        {showCelebration && (
          <Confetti
            width={typeof window !== "undefined" ? window.innerWidth : 800}
            height={typeof window !== "undefined" ? window.innerHeight : 600}
            recycle={false}
            numberOfPieces={300}
          />
        )}

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mani-red/10 border border-mani-red/30 text-mani-red text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" /> 24/7 Automated UPI Verification
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              UPI Payment & Key Generator
            </h1>
            <p className="text-white/50 text-sm mt-2 max-w-xl mx-auto">
              Select your plan, pay to UPI ID <code className="text-mani-red font-mono font-bold">{upiId}</code>, 
              and enter your 12-digit UTR. Our system verifies the bank credit alert and generates your license key instantly.
            </p>
          </div>

          {/* VERIFIED KEY SUCCESS STATE */}
          {verifiedKey ? (
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border-emerald-500/50 shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <h2 className="text-3xl font-black text-white mb-2">
                Payment Verified Successfully! ⚡
              </h2>
              <p className="text-emerald-400 font-semibold text-sm mb-6">
                UTR {utr} verified against bank credit alert. Your license key is active.
              </p>

              {/* License Key Box */}
              <div className="glass-card rounded-2xl p-6 mb-6 text-left border-mani-red/50 bg-black/60 max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-mani-red flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> License Key ({selectedPlan.name})
                  </span>
                  <button
                    onClick={copyKey}
                    className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded transition"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest bg-black/80 p-4 rounded-xl border border-white/10 select-all break-all text-center">
                  {verifiedKey}
                </div>
                {keyExpiresAt && (
                  <p className="text-white/40 text-xs mt-3 text-center">
                    Expires: {new Date(keyExpiresAt).toLocaleDateString()} {new Date(keyExpiresAt).toLocaleTimeString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <a
                  href="https://discord.gg/4DMtsmZX6k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow inline-flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold"
                >
                  <Download className="w-4 h-4" /> Download Panel & Loader
                </a>
                <button
                  onClick={() => {
                    setVerifiedKey(null);
                    setUtr("");
                  }}
                  className="btn-ghost inline-flex items-center justify-center gap-2 py-3 px-6 text-sm"
                >
                  Verify Another Payment
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Plan Selection & QR Code */}
              <div className="lg:col-span-5 space-y-6">
                {/* Plan Selection */}
                <div className="glass-card rounded-2xl p-5 border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
                    Step 1: Choose Your Plan
                  </h3>
                  <div className="space-y-2">
                    {PLANS.map((plan) => {
                      const isSelected = selectedPlan.id === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan)}
                          className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                            isSelected
                              ? "bg-mani-red/20 border-mani-red text-white shadow-lg shadow-mani-red/20"
                              : "bg-black/40 border-white/10 text-white/70 hover:border-white/20"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{plan.name}</span>
                              {plan.badge && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-mani-red text-white">
                                  {plan.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-white/40">{plan.days} Days Validity</span>
                          </div>
                          <span className="text-lg font-black text-white">₹{plan.inr}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* QR Code Card */}
                <div className="glass-card rounded-2xl p-6 border-white/10 text-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl inline-block mb-3 border-2 border-mani-red/40">
                    {qrCodeUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrCodeUrl}
                        alt="UPI Payment QR"
                        width={200}
                        height={200}
                        className="w-[180px] h-[180px] block rounded-lg"
                      />
                    ) : (
                      <div className="w-[180px] h-[180px] flex items-center justify-center">
                        <div className="loader-ring" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-bold text-white mb-1">
                    Pay exactly ₹{selectedPlan.inr}
                  </p>
                  <p className="text-[11px] text-white/50 mb-3">
                    Scan using FamPay, PhonePe, Google Pay, Paytm
                  </p>

                  {/* UPI ID copy */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white font-bold select-all">{upiId}</span>
                    <button
                      onClick={copyUpi}
                      className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedUpi ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: UTR Verification Form */}
              <div className="lg:col-span-7">
                <div className="glass-card rounded-2xl p-6 sm:p-8 border-white/10 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-mani-red" />
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">
                      Step 2: Submit UTR for Verification
                    </h2>
                  </div>
                  <p className="text-white/50 text-xs mb-6">
                    Enter the 12-digit transaction reference number from your UPI receipt. Our backend reads bank credit alert emails to verify real payment.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* UTR Input */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        12-Digit UTR / UPI Reference Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={12}
                          value={utr}
                          onChange={(e) => {
                            setUtr(e.target.value.replace(/\D/g, ""));
                            setErrorMessage("");
                          }}
                          placeholder="e.g. 431289123456"
                          className="w-full bg-black/60 border border-white/20 focus:border-mani-red rounded-xl px-4 py-3.5 text-white font-mono text-base tracking-wider placeholder:text-white/30 focus:outline-none transition"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">
                          {utr.length}/12
                        </span>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        Email Address (for key backup & receipt)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-black/60 border border-white/20 focus:border-mani-red rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none transition"
                      />
                    </div>

                    {/* Telegram / Discord Username */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        Discord or Telegram (optional)
                      </label>
                      <input
                        type="text"
                        value={discordOrTelegram}
                        onChange={(e) => setDiscordOrTelegram(e.target.value)}
                        placeholder="@username or Discord ID"
                        className="w-full bg-black/60 border border-white/20 focus:border-mani-red rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none transition"
                      />
                    </div>

                    {/* Error / Rate limit notice */}
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{errorMessage}</p>
                          {rateLimitInfo && (
                            <p className="text-[11px] text-white/50 mt-1">{rateLimitInfo}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={verifying || utr.length !== 12}
                      className="btn-glow w-full py-4 font-bold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 transition"
                    >
                      {verifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Bank Credit Alert...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" /> Verify & Generate Access Key
                        </>
                      )}
                    </button>
                  </form>

                  {/* Anti-fraud & Security info */}
                  <div className="border-t border-white/10 mt-6 pt-4 space-y-2 text-[11px] text-white/40">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Single-use guarantee: Replay attacks and duplicate UTRs are blocked.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Only credit alerts within the last 24 hours are accepted.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
